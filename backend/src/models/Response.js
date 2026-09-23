const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Response = sequelize.define('Response', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  quizAttemptId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'quiz_attempts', key: 'id' }
  },
  questionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'questions', key: 'id' }
  },
  selectedAnswer: {
    type: DataTypes.ENUM('A', 'B', 'C', 'D'),
    allowNull: false
  },
  isCorrect: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  timeTaken: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Time in seconds for this question'
  }
}, {
  tableName: 'responses',
  timestamps: true,
  indexes: [
    { fields: ['quizAttemptId'] },
    { fields: ['questionId'] }
  ]
});

module.exports = Response;
