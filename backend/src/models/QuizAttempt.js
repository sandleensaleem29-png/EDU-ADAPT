const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const QuizAttempt = sequelize.define('QuizAttempt', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  },
  topicId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'topics', key: 'id' }
  },
  difficulty: {
    type: DataTypes.ENUM('easy', 'medium', 'hard'),
    allowNull: false
  },
  totalQuestions: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  correctAnswers: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  score: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  timeTaken: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Time in seconds'
  },
  status: {
    type: DataTypes.ENUM('in_progress', 'completed', 'abandoned'),
    defaultValue: 'in_progress'
  },
  completedAt: {
    type: DataTypes.DATE,
    defaultValue: null
  }
}, {
  tableName: 'quiz_attempts',
  timestamps: true,
  indexes: [
    { fields: ['userId'] },
    { fields: ['topicId'] },
    { fields: ['status'] }
  ]
});

module.exports = QuizAttempt;
