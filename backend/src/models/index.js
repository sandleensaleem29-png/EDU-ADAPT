const sequelize = require('../config/database');
const User = require('./User');
const Topic = require('./Topic');
const Question = require('./Question');
const QuizAttempt = require('./QuizAttempt');
const Response = require('./Response');
const Resource = require('./Resource');

// Topic has many Questions
Topic.hasMany(Question, { foreignKey: 'topicId', as: 'questions' });
Question.belongsTo(Topic, { foreignKey: 'topicId', as: 'topic' });

// User has many QuizAttempts
User.hasMany(QuizAttempt, { foreignKey: 'userId', as: 'quizAttempts' });
QuizAttempt.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Topic has many QuizAttempts
Topic.hasMany(QuizAttempt, { foreignKey: 'topicId', as: 'quizAttempts' });
QuizAttempt.belongsTo(Topic, { foreignKey: 'topicId', as: 'topic' });

// QuizAttempt has many Responses
QuizAttempt.hasMany(Response, { foreignKey: 'quizAttemptId', as: 'responses' });
Response.belongsTo(QuizAttempt, { foreignKey: 'quizAttemptId', as: 'quizAttempt' });

// Question has many Responses
Question.hasMany(Response, { foreignKey: 'questionId', as: 'responses' });
Response.belongsTo(Question, { foreignKey: 'questionId', as: 'question' });

// Topic has many Resources
Topic.hasMany(Resource, { foreignKey: 'topicId', as: 'resources' });
Resource.belongsTo(Topic, { foreignKey: 'topicId', as: 'topic' });

// User has many Questions (creator)
User.hasMany(Question, { foreignKey: 'createdBy', as: 'createdQuestions' });
Question.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

module.exports = {
  sequelize,
  User,
  Topic,
  Question,
  QuizAttempt,
  Response,
  Resource
};
