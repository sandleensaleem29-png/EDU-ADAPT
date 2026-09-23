const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Question = sequelize.define('Question', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  topicId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'topics', key: 'id' }
  },
  questionText: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: { notEmpty: true }
  },
  optionA: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  optionB: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  optionC: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  optionD: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  correctAnswer: {
    type: DataTypes.ENUM('A', 'B', 'C', 'D'),
    allowNull: false
  },
  difficulty: {
    type: DataTypes.ENUM('easy', 'medium', 'hard'),
    defaultValue: 'medium',
    allowNull: false
  },
  hint: {
    type: DataTypes.TEXT,
    defaultValue: null
  },
  explanation: {
    type: DataTypes.TEXT,
    defaultValue: null
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'approved'
  },
  isAIGenerated: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'users', key: 'id' }
  }
}, {
  tableName: 'questions',
  timestamps: true,
  indexes: [
    { fields: ['topicId'] },
    { fields: ['difficulty'] },
    { fields: ['status'] }
  ]
});

module.exports = Question;
