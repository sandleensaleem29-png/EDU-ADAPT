const { Op, fn, col } = require('sequelize');
const sequelize = require('../config/database');
const { Response, Question, QuizAttempt, Topic } = require('../models');

/**
 * Adaptive Learning Algorithm
 * 
 * Uses a sliding window of the student's latest 5 responses to determine:
 * 1. Next difficulty level
 * 2. Weak topics that need improvement
 * 3. Personalized recommendations
 * 
 * Rules:
 * - Accuracy >= 80% -> increase difficulty
 * - Accuracy 60-79% -> maintain same difficulty
 * - Accuracy < 60% -> decrease difficulty + provide hints
 */

// Get the latest N responses for a student
async function getRecentResponses(userId, limit = 5) {
  const attempts = await QuizAttempt.findAll({
    where: { userId, status: 'completed' },
    order: [['completedAt', 'DESC']],
    limit: 10
  });

  if (attempts.length === 0) return [];

  const attemptIds = attempts.map(a => a.id);

  const responses = await Response.findAll({
    where: { quizAttemptId: { [Op.in]: attemptIds } },
    include: [{ model: Question, as: 'question', attributes: ['topicId', 'difficulty'] }],
    order: [['createdAt', 'DESC']],
    limit: limit * 2
  });

  return responses.slice(0, limit);
}

// Calculate accuracy from responses
function calculateAccuracy(responses) {
  if (responses.length === 0) return 0;
  const correct = responses.filter(r => r.isCorrect).length;
  return Math.round((correct / responses.length) * 100);
}

// Determine next difficulty based on recent performance
function determineNextDifficulty(recentResponses) {
  if (recentResponses.length === 0) return 'medium';

  const accuracy = calculateAccuracy(recentResponses);
  const lastDifficulty = recentResponses[0]?.question?.difficulty || 'medium';

  if (accuracy >= 80) {
    if (lastDifficulty === 'easy') return 'medium';
    if (lastDifficulty === 'medium') return 'hard';
    return 'hard';
  } else if (accuracy >= 60) {
    return lastDifficulty;
  } else {
    if (lastDifficulty === 'hard') return 'medium';
    if (lastDifficulty === 'medium') return 'easy';
    return 'easy';
  }
}

// Get topic-wise performance
async function getTopicPerformance(userId) {
  const attempts = await QuizAttempt.findAll({
    where: { userId, status: 'completed' },
    include: [{ model: Topic, as: 'topic', attributes: ['id', 'name'] }]
  });

  const topicMap = {};

  for (const attempt of attempts) {
    const topicId = attempt.topicId;
    const topicName = attempt.topic?.name || 'Unknown';

    if (!topicMap[topicId]) {
      topicMap[topicId] = {
        topicId,
        topicName,
        totalAttempts: 0,
        totalCorrect: 0,
        totalQuestions: 0,
        scores: []
      };
    }

    topicMap[topicId].totalAttempts++;
    topicMap[topicId].totalCorrect += attempt.correctAnswers;
    topicMap[topicId].totalQuestions += attempt.totalQuestions;
    topicMap[topicId].scores.push(attempt.score);
  }

  return Object.values(topicMap).map(t => ({
    ...t,
    accuracy: t.totalQuestions > 0 ? Math.round((t.totalCorrect / t.totalQuestions) * 100) : 0,
    avgScore: t.scores.length > 0 ? Math.round(t.scores.reduce((a, b) => a + b, 0) / t.scores.length) : 0
  }));
}

// Identify weak and strong topics
function identifyWeakAndStrongTopics(topicPerformance) {
  const weak = [];
  const strong = [];

  for (const topic of topicPerformance) {
    if (topic.accuracy < 60) {
      weak.push(topic);
    } else if (topic.accuracy >= 80) {
      strong.push(topic);
    }
  }

  return {
    weak: weak.sort((a, b) => a.accuracy - b.accuracy),
    strong: strong.sort((a, b) => b.accuracy - a.accuracy)
  };
}

// Generate recommendations based on performance
async function generateRecommendations(userId) {
  const recentResponses = await getRecentResponses(userId, 5);
  const topicPerformance = await getTopicPerformance(userId);
  const { weak, strong } = identifyWeakAndStrongTopics(topicPerformance);
  const nextDifficulty = determineNextDifficulty(recentResponses);
  const accuracy = calculateAccuracy(recentResponses);

  const recommendations = [];

  // Recommend weak topics for practice
  for (const topic of weak.slice(0, 3)) {
    recommendations.push({
      type: 'practice',
      topicId: topic.topicId,
      topicName: topic.topicName,
      message: `Practice ${topic.topicName} - current accuracy is ${topic.accuracy}%`,
      priority: 'high'
    });
  }

  // Recommend next difficulty
  recommendations.push({
    type: 'difficulty',
    difficulty: nextDifficulty,
    message: `Try ${nextDifficulty} difficulty questions based on your recent performance`,
    priority: 'medium'
  });

  // If accuracy is low, recommend resources
  if (accuracy < 60) {
    recommendations.push({
      type: 'resource',
      message: 'Review learning resources before attempting the next quiz',
      priority: 'high'
    });
  }

  return {
    nextDifficulty,
    recentAccuracy: accuracy,
    weakTopics: weak,
    strongTopics: strong,
    recommendations,
    totalAttempts: topicPerformance.reduce((sum, t) => sum + t.totalAttempts, 0)
  };
}

// Select questions for quiz based on adaptive algorithm
async function selectAdaptiveQuestions(topicId, difficulty, count = 10, excludeIds = []) {
  const where = {
    topicId,
    difficulty,
    status: 'approved'
  };

  if (excludeIds.length > 0) {
    where.id = { [Op.notIn]: excludeIds };
  }

  const questions = await Question.findAll({
    where,
    order: fn('random'),
    limit: count
  });

  // If not enough questions at target difficulty, fill with others
  if (questions.length < count) {
    const additional = await Question.findAll({
      where: {
        topicId,
        status: 'approved',
        id: { [Op.notIn]: [...excludeIds, ...questions.map(q => q.id)] }
      },
      order: fn('random'),
      limit: count - questions.length
    });
    return [...questions, ...additional];
  }

  return questions;
}

module.exports = {
  getRecentResponses,
  calculateAccuracy,
  determineNextDifficulty,
  getTopicPerformance,
  identifyWeakAndStrongTopics,
  generateRecommendations,
  selectAdaptiveQuestions
};
