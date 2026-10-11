const { User, QuizAttempt, Topic, Response, Question } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

// GET /api/users (admin)
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', role = '' } = req.query;
    const where = {};

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }
    if (role) where.role = role;

    const users = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });

    res.json({
      users: users.rows,
      total: users.count,
      totalPages: Math.ceil(users.count / parseInt(limit)),
      currentPage: parseInt(page)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/users/:id (admin)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
      include: [{
        model: QuizAttempt,
        as: 'quizAttempts',
        include: [{ model: Topic, as: 'topic', attributes: ['id', 'name'] }],
        order: [['createdAt', 'DESC']],
        limit: 10
      }]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// PUT /api/users/:id (admin)
exports.updateUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;

    await user.save();
    res.json({ message: 'User updated', user: user.toJSON() });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// DELETE /api/users/:id (admin)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/users/stats/dashboard (admin)
exports.getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await User.count({ where: { role: 'student' } });
    const totalQuizzes = await QuizAttempt.count({ where: { status: 'completed' } });
    const totalQuestions = await Question.count({ where: { status: 'approved' } });
    const totalTopics = await Topic.count();

    const recentAttempts = await QuizAttempt.findAll({
      where: { status: 'completed' },
      include: [
        { model: User, as: 'user', attributes: ['id', 'name'] },
        { model: Topic, as: 'topic', attributes: ['id', 'name'] }
      ],
      order: [['completedAt', 'DESC']],
      limit: 10
    });

    const avgScore = await QuizAttempt.findOne({
      where: { status: 'completed' },
      attributes: [[sequelize.fn('AVG', sequelize.col('score')), 'avgScore']]
    });

    res.json({
      totalStudents,
      totalQuizzes,
      totalQuestions,
      totalTopics,
      avgScore: Math.round(avgScore?.dataValues?.avgScore || 0),
      recentAttempts
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/users/stats/student (student)
exports.getStudentStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const completedAttempts = await QuizAttempt.findAll({
      where: { userId, status: 'completed' },
      attributes: ['id']
    });

    const attemptIds = completedAttempts.map(a => a.id);

    const totalAttempts = completedAttempts.length;

    const avgScore = await QuizAttempt.findOne({
      where: { userId, status: 'completed' },
      attributes: [[sequelize.fn('AVG', sequelize.col('score')), 'avgScore']]
    });

    let totalCorrect = 0;
    let totalAnswered = 0;

    if (attemptIds.length > 0) {
      totalCorrect = await Response.count({
        where: {
          isCorrect: true,
          quizAttemptId: { [Op.in]: attemptIds }
        }
      });

      totalAnswered = await Response.count({
        where: {
          quizAttemptId: { [Op.in]: attemptIds }
        }
      });
    }

    res.json({
      totalAttempts,
      avgScore: Math.round(avgScore?.dataValues?.avgScore || 0),
      totalCorrect,
      totalAnswered,
      accuracy: totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
