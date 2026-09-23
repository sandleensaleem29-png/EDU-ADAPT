const { QuizAttempt, Response, Question, Topic } = require('../models');
const { selectAdaptiveQuestions, determineNextDifficulty, getRecentResponses } = require('../utils/adaptive');
const sequelize = require('../config/database');

// POST /api/quizzes/start
exports.startQuiz = async (req, res) => {
  try {
    const { topicId, difficulty } = req.body;
    const userId = req.user.id;

    if (!topicId) {
      return res.status(400).json({ message: 'Topic is required' });
    }

    // Check for existing in-progress quiz
    const existingQuiz = await QuizAttempt.findOne({
      where: { userId, topicId, status: 'in_progress' }
    });

    if (existingQuiz) {
      return res.status(400).json({ message: 'You already have an in-progress quiz for this topic', quizAttempt: existingQuiz });
    }

    // Determine difficulty using adaptive algorithm if not provided
    let selectedDifficulty = difficulty;
    if (!selectedDifficulty) {
      const recentResponses = await getRecentResponses(userId, 5);
      selectedDifficulty = determineNextDifficulty(recentResponses);
    }

    // Select questions adaptively
    const questions = await selectAdaptiveQuestions(topicId, selectedDifficulty, 10);

    if (questions.length === 0) {
      return res.status(404).json({ message: 'No questions available for this topic and difficulty' });
    }

    // Create quiz attempt
    const quizAttempt = await QuizAttempt.create({
      userId,
      topicId,
      difficulty: selectedDifficulty,
      totalQuestions: questions.length,
      status: 'in_progress'
    });

    // Return questions without correct answers
    const safeQuestions = questions.map(q => ({
      id: q.id,
      questionText: q.questionText,
      optionA: q.optionA,
      optionB: q.optionB,
      optionC: q.optionC,
      optionD: q.optionD,
      difficulty: q.difficulty,
      hint: q.hint
    }));

    res.status(201).json({
      message: 'Quiz started',
      quizAttempt,
      questions: safeQuestions
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// POST /api/quizzes/:id/submit
exports.submitQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const { answers, timeTaken } = req.body;
    const userId = req.user.id;

    const quizAttempt = await QuizAttempt.findOne({
      where: { id, userId, status: 'in_progress' }
    });

    if (!quizAttempt) {
      return res.status(404).json({ message: 'Quiz attempt not found or already completed' });
    }

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: 'Answers array is required' });
    }

    let correctCount = 0;
    const responses = [];

    for (const answer of answers) {
      const question = await Question.findByPk(answer.questionId);
      if (!question) continue;

      const isCorrect = question.correctAnswer === answer.selectedAnswer;
      if (isCorrect) correctCount++;

      const response = await Response.create({
        quizAttemptId: quizAttempt.id,
        questionId: answer.questionId,
        selectedAnswer: answer.selectedAnswer,
        isCorrect,
        timeTaken: answer.timeTaken || 0
      });

      responses.push({
        questionId: question.id,
        questionText: question.questionText,
        selectedAnswer: answer.selectedAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        explanation: question.explanation,
        optionA: question.optionA,
        optionB: question.optionB,
        optionC: question.optionC,
        optionD: question.optionD
      });
    }

    const score = Math.round((correctCount / quizAttempt.totalQuestions) * 100);

    quizAttempt.correctAnswers = correctCount;
    quizAttempt.score = score;
    quizAttempt.timeTaken = timeTaken || 0;
    quizAttempt.status = 'completed';
    quizAttempt.completedAt = new Date();
    await quizAttempt.save();

    res.json({
      message: 'Quiz submitted successfully',
      result: {
        quizAttemptId: quizAttempt.id,
        totalQuestions: quizAttempt.totalQuestions,
        correctAnswers: correctCount,
        score,
        timeTaken: timeTaken || 0,
        responses
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/quizzes/history
exports.getQuizHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    const attempts = await QuizAttempt.findAndCountAll({
      where: { userId, status: 'completed' },
      include: [{ model: Topic, as: 'topic', attributes: ['id', 'name', 'icon'] }],
      order: [['completedAt', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });

    res.json({
      attempts: attempts.rows,
      total: attempts.count,
      totalPages: Math.ceil(attempts.count / parseInt(limit)),
      currentPage: parseInt(page)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/quizzes/:id
exports.getQuizById = async (req, res) => {
  try {
    const quizAttempt = await QuizAttempt.findByPk(req.params.id, {
      include: [
        { model: Topic, as: 'topic' },
        {
          model: Response,
          as: 'responses',
          include: [{ model: Question, as: 'question' }]
        }
      ]
    });

    if (!quizAttempt) {
      return res.status(404).json({ message: 'Quiz attempt not found' });
    }

    res.json({ quizAttempt });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/quizzes/all (admin)
exports.getAllQuizzes = async (req, res) => {
  try {
    const { page = 1, limit = 10, topicId, status } = req.query;
    const where = {};

    if (topicId) where.topicId = topicId;
    if (status) where.status = status;

    const attempts = await QuizAttempt.findAndCountAll({
      where,
      include: [
        { model: require('../models/User'), as: 'user', attributes: ['id', 'name', 'email'] },
        { model: Topic, as: 'topic', attributes: ['id', 'name'] }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });

    res.json({
      attempts: attempts.rows,
      total: attempts.count,
      totalPages: Math.ceil(attempts.count / parseInt(limit)),
      currentPage: parseInt(page)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
