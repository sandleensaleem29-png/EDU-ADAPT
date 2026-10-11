const { Op } = require("sequelize");
const sequelize = require("../config/database");
const QuizAttempt = require("../models/QuizAttempt");
const Question = require("../models/Question");
const Response = require("../models/Response");
const Topic = require("../models/Topic");

// ---------------------------------------------------------------------------
// Settings (these numbers come from the project proposal)
// ---------------------------------------------------------------------------
const QUESTIONS_PER_QUIZ = 10; // max questions in one session
const WINDOW_SIZE = 5; // sliding window: last 5 answers in the topic
const UP_THRESHOLD = 0.8; // accuracy above 80%  -> harder
const DOWN_THRESHOLD = 0.4; // accuracy below 40% -> easier
const LEVELS = ["easy", "medium", "hard"];

// If QuizAttempt.js uses a different word for a finished quiz, change it here.
const STATUS_IN_PROGRESS = "in_progress";
const STATUS_DONE = "completed";

// Fields the student must not see while the quiz is running
const HIDDEN_FIELDS = ["correctAnswer", "explanation"];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Sliding-window rule.
 * lastAnswers = array of true/false for the most recent answers (newest first).
 * Fewer than WINDOW_SIZE answers -> not enough evidence, keep the same level.
 */
function decideDifficulty(current, lastAnswers) {
  if (lastAnswers.length < WINDOW_SIZE) return current;

  const correct = lastAnswers.filter(Boolean).length;
  const accuracy = correct / lastAnswers.length;
  const index = LEVELS.indexOf(current);

  if (accuracy > UP_THRESHOLD && index < LEVELS.length - 1)
    return LEVELS[index + 1];
  if (accuracy < DOWN_THRESHOLD && index > 0) return LEVELS[index - 1];
  return current;
}

/**
 * Pick one random approved question for the topic that has not been used in
 * this attempt. Tries the wanted difficulty first, then the nearest levels,
 * so a small question bank never blocks the quiz.
 */
async function pickQuestion(topicId, difficulty, usedIds) {
  const wanted = LEVELS.indexOf(difficulty);
  const order = [...LEVELS].sort(
    (a, b) =>
      Math.abs(LEVELS.indexOf(a) - wanted) -
      Math.abs(LEVELS.indexOf(b) - wanted),
  );

  for (const level of order) {
    const where = { topicId, status: "approved", difficulty: level };
    if (usedIds.length > 0) where.id = { [Op.notIn]: usedIds };

    const question = await Question.findOne({
      where,
      attributes: { exclude: HIDDEN_FIELDS },
      order: sequelize.random(),
    });
    if (question) return question;
  }
  return null;
}

/** Last WINDOW_SIZE answers of this user in this topic (all attempts). */
async function getRecentAnswers(userId, topicId) {
  const attempts = await QuizAttempt.findAll({
    where: { userId, topicId },
    attributes: ["id"],
  });
  const attemptIds = attempts.map((a) => a.id);
  if (attemptIds.length === 0) return [];

  const responses = await Response.findAll({
    where: { quizAttemptId: { [Op.in]: attemptIds } },
    order: [
      ["createdAt", "DESC"],
      ["id", "DESC"],
    ],
    limit: WINDOW_SIZE,
  });
  return responses.map((r) => r.isCorrect);
}

/**
 * Full result of one attempt in the shape QuizResult.jsx reads:
 * the attempt fields plus a flat list of answers with the question details.
 */
async function buildResult(attempt) {
  const responses = await Response.findAll({
    where: { quizAttemptId: attempt.id },
    order: [["id", "ASC"]],
  });

  const questionIds = responses.map((r) => r.questionId);
  const questions = questionIds.length
    ? await Question.findAll({ where: { id: { [Op.in]: questionIds } } })
    : [];
  const questionById = Object.fromEntries(questions.map((q) => [q.id, q]));

  return {
    ...attempt.toJSON(),
    responses: responses.map((r) => {
      const q = questionById[r.questionId] || {};
      return {
        questionId: r.questionId,
        selectedAnswer: r.selectedAnswer,
        isCorrect: r.isCorrect,
        timeTaken: r.timeTaken,
        questionText: q.questionText,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        difficulty: q.difficulty,
      };
    }),
  };
}

// ---------------------------------------------------------------------------
// POST /api/quizzes/start      body: { topicId }
// Creates the attempt and returns the FIRST question only.
// ---------------------------------------------------------------------------
exports.startQuiz = async (req, res) => {
  try {
    const topicId = parseInt(req.body.topicId, 10);
    const userId = req.user.id;

    if (!topicId) {
      return res
        .status(400)
        .json({ success: false, message: "topicId is required." });
    }

    const available = await Question.count({
      where: { topicId, status: "approved" },
    });
    if (available === 0) {
      return res.status(404).json({
        success: false,
        message: "No questions available for this topic.",
      });
    }

    const totalQuestions = Math.min(QUESTIONS_PER_QUIZ, available);
    const difficulty = "medium";

    const attempt = await QuizAttempt.create({
      userId,
      topicId,
      difficulty,
      totalQuestions,
      correctAnswers: 0,
      score: 0,
      status: STATUS_IN_PROGRESS,
    });

    const question = await pickQuestion(topicId, difficulty, []);

    return res.status(201).json({
      success: true,
      quizAttempt: attempt,
      question,
      currentQuestionNumber: 1,
      totalQuestions,
      difficulty,
    });
  } catch (error) {
    console.error("Error starting quiz:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error starting quiz." });
  }
};

// ---------------------------------------------------------------------------
// POST /api/quizzes/:id/answer   body: { questionId, selectedAnswer, timeTaken }
// Saves one answer, applies the sliding-window rule, returns the next question
// (or the final result when the quiz is finished).
// ---------------------------------------------------------------------------
exports.answerQuestion = async (req, res) => {
  try {
    const attemptId = parseInt(req.params.id, 10);
    const questionId = parseInt(req.body.questionId, 10);
    const selectedAnswer = String(req.body.selectedAnswer || "").toUpperCase();
    const timeTaken = parseInt(req.body.timeTaken, 10) || 0;

    if (!questionId || !["A", "B", "C", "D"].includes(selectedAnswer)) {
      return res.status(400).json({
        success: false,
        message: "questionId and selectedAnswer (A, B, C or D) are required.",
      });
    }

    const attempt = await QuizAttempt.findByPk(attemptId);
    if (!attempt || attempt.userId !== req.user.id) {
      return res
        .status(404)
        .json({ success: false, message: "Quiz not found." });
    }
    if (attempt.status !== STATUS_IN_PROGRESS) {
      return res
        .status(400)
        .json({ success: false, message: "This quiz is already finished." });
    }

    const question = await Question.findByPk(questionId);
    if (!question || question.topicId !== attempt.topicId) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid question for this quiz." });
    }

    const previous = await Response.findAll({
      where: { quizAttemptId: attempt.id },
    });
    if (previous.some((r) => r.questionId === questionId)) {
      return res
        .status(400)
        .json({ success: false, message: "Question already answered." });
    }

    // 1. Save the answer
    const isCorrect = question.correctAnswer === selectedAnswer;
    await Response.create({
      quizAttemptId: attempt.id,
      questionId,
      selectedAnswer,
      isCorrect,
      timeTaken,
    });

    const answeredCount = previous.length + 1;
    const correctCount =
      previous.filter((r) => r.isCorrect).length + (isCorrect ? 1 : 0);
    const usedIds = [...previous.map((r) => r.questionId), questionId];

    // 2. Adaptive step: sliding window over the last 5 answers in this topic
    const recent = await getRecentAnswers(attempt.userId, attempt.topicId);
    const oldDifficulty = attempt.difficulty;
    const newDifficulty = decideDifficulty(oldDifficulty, recent);

    // 3. Next question, if the quiz is not over
    let nextQuestion = null;
    if (answeredCount < attempt.totalQuestions) {
      nextQuestion = await pickQuestion(
        attempt.topicId,
        newDifficulty,
        usedIds,
      );
    }
    const finished = !nextQuestion;

    // 4. Update the attempt
    const updates = { correctAnswers: correctCount, difficulty: newDifficulty };
    if (finished) {
      updates.status = STATUS_DONE;
      updates.totalQuestions = answeredCount;
      updates.score = Math.round((correctCount / answeredCount) * 100);
      updates.completedAt = new Date();
      updates.timeTaken =
        previous.reduce((sum, r) => sum + (r.timeTaken || 0), 0) + timeTaken;
    }
    await attempt.update(updates);

    return res.status(200).json({
      success: true,
      isCorrect,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      difficulty: newDifficulty,
      difficultyChanged: newDifficulty !== oldDifficulty,
      finished,
      nextQuestion,
      currentQuestionNumber: answeredCount + 1,
      totalQuestions: attempt.totalQuestions,
      result: finished ? await buildResult(attempt) : null,
    });
  } catch (error) {
    console.error("Error answering question:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error saving answer." });
  }
};

// ---------------------------------------------------------------------------
// GET /api/quizzes/history   -> finished quizzes of the logged-in student
// ---------------------------------------------------------------------------
exports.getQuizHistory = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(
      50,
      Math.max(1, parseInt(req.query.limit, 10) || 10),
    );

    const { count, rows: attempts } = await QuizAttempt.findAndCountAll({
      where: { userId: req.user.id, status: STATUS_DONE },
      order: [["completedAt", "DESC"]],
      limit,
      offset: (page - 1) * limit,
    });

    const topicIds = [...new Set(attempts.map((a) => a.topicId))];
    const topics = topicIds.length
      ? await Topic.findAll({ where: { id: { [Op.in]: topicIds } } })
      : [];
    const topicById = Object.fromEntries(topics.map((t) => [t.id, t]));

    const quizzes = attempts.map((a) => ({
      ...a.toJSON(),
      topic: topicById[a.topicId] || null,
    }));

    return res.status(200).json({
      success: true,
      attempts: quizzes,
      total: count,
      page,
      totalPages: Math.max(1, Math.ceil(count / limit)),
    });
  } catch (error) {
    console.error("Error loading quiz history:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error loading history." });
  }
};

// ---------------------------------------------------------------------------
// GET /api/quizzes/:id   -> one attempt with every answer (for the result page)
// ---------------------------------------------------------------------------
exports.getQuizById = async (req, res) => {
  try {
    const attempt = await QuizAttempt.findByPk(parseInt(req.params.id, 10));
    if (
      !attempt ||
      (attempt.userId !== req.user.id && req.user.role !== "admin")
    ) {
      return res
        .status(404)
        .json({ success: false, message: "Quiz not found." });
    }

    const topic = await Topic.findByPk(attempt.topicId);
    const result = { ...(await buildResult(attempt)), topic };

    return res.status(200).json({ success: true, quizAttempt: result, result });
  } catch (error) {
    console.error("Error loading quiz:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error loading quiz." });
  }
};
