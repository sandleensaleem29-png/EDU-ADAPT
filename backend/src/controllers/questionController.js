const Question = require('../models/Question');
const Topic = require('../models/Topic');
const { Op } = require('sequelize');

// GET /api/questions
exports.getAllQuestions = async (req, res) => {
  try {
    const { page = 1, limit = 10, topicId, difficulty, status, search = '' } = req.query;
    const where = {};

    if (topicId) where.topicId = topicId;
    if (difficulty) where.difficulty = difficulty;
    if (status) where.status = status;
    if (search) where.questionText = { [Op.iLike]: `%${search}%` };

    const questions = await Question.findAndCountAll({
      where,
      include: [{ model: Topic, as: 'topic', attributes: ['id', 'name'] }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });

    res.json({
      questions: questions.rows,
      total: questions.count,
      totalPages: Math.ceil(questions.count / parseInt(limit)),
      currentPage: parseInt(page)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/questions/:id
exports.getQuestionById = async (req, res) => {
  try {
    const question = await Question.findByPk(req.params.id, {
      include: [{ model: Topic, as: 'topic' }]
    });

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.json({ question });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// POST /api/questions (admin)
exports.createQuestion = async (req, res) => {
  try {
    const { topicId, questionText, optionA, optionB, optionC, optionD, correctAnswer, difficulty, hint, explanation } = req.body;

    if (!topicId || !questionText || !optionA || !optionB || !optionC || !optionD || !correctAnswer) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    const topic = await Topic.findByPk(topicId);
    if (!topic) {
      return res.status(400).json({ message: 'Invalid topic' });
    }

    const question = await Question.create({
      topicId,
      questionText,
      optionA,
      optionB,
      optionC,
      optionD,
      correctAnswer,
      difficulty: difficulty || 'medium',
      hint,
      explanation,
      createdBy: req.user.id,
      status: 'approved'
    });

    res.status(201).json({ message: 'Question created', question });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// PUT /api/questions/:id (admin)
exports.updateQuestion = async (req, res) => {
  try {
    const question = await Question.findByPk(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const { topicId, questionText, optionA, optionB, optionC, optionD, correctAnswer, difficulty, hint, explanation, status } = req.body;

    if (topicId) question.topicId = topicId;
    if (questionText) question.questionText = questionText;
    if (optionA) question.optionA = optionA;
    if (optionB) question.optionB = optionB;
    if (optionC) question.optionC = optionC;
    if (optionD) question.optionD = optionD;
    if (correctAnswer) question.correctAnswer = correctAnswer;
    if (difficulty) question.difficulty = difficulty;
    if (hint !== undefined) question.hint = hint;
    if (explanation !== undefined) question.explanation = explanation;
    if (status) question.status = status;

    await question.save();
    res.json({ message: 'Question updated', question });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// DELETE /api/questions/:id (admin)
exports.deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findByPk(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    await question.destroy();
    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// PUT /api/questions/:id/approve (admin)
exports.approveQuestion = async (req, res) => {
  try {
    const question = await Question.findByPk(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    question.status = 'approved';
    await question.save();
    res.json({ message: 'Question approved', question });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// PUT /api/questions/:id/reject (admin)
exports.rejectQuestion = async (req, res) => {
  try {
    const question = await Question.findByPk(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    question.status = 'rejected';
    await question.save();
    res.json({ message: 'Question rejected', question });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
