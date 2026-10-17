'use strict';
/**
 * Seeder: Manual Question Bank
 *
 * Inserts the questions from src/data/questionBank.js.
 *  - Topics are looked up by NAME (not hard-coded IDs), so it works on any database.
 *  - Adds the "subtopic" column to the questions table if it does not exist yet.
 *  - Skips questions that already exist (same topic + same text), so it is safe to run twice.
 *  - Every question is marked isAIGenerated = false and status = 'approved'
 *    (manual question bank = the core source and the fallback when AI is unavailable).
 *
 * Run:   npm run seed:questions
 * Undo:  npm run seed:questions:undo
 */
const bank = require('../data/questionBank');

const FIELDS = ['subtopic', 'difficulty', 'questionText', 'optionA', 'optionB', 'optionC', 'optionD', 'correctAnswer', 'hint', 'explanation'];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Make sure the subtopic column exists (the proposal tracks performance per subtopic)
    const table = await queryInterface.describeTable('questions');
    if (!table.subtopic) {
      await queryInterface.addColumn('questions', 'subtopic', { type: Sequelize.STRING(100), allowNull: true });
    }

    // 2. Map topic names -> ids
    const [topics] = await queryInterface.sequelize.query('SELECT id, name FROM topics');
    const topicIdByName = Object.fromEntries(topics.map(t => [t.name, t.id]));

    // 3. Existing questions, so we never insert duplicates
    const [existing] = await queryInterface.sequelize.query('SELECT "topicId", "questionText" FROM questions');
    const existingKeys = new Set(existing.map(q => `${q.topicId}|${q.questionText}`));

    const rows = [];
    for (const [topicName, questions] of Object.entries(bank)) {
      const topicId = topicIdByName[topicName];
      if (!topicId) {
        throw new Error(`Topic "${topicName}" not found. Run the main seeder first (npm run seed).`);
      }
      for (const q of questions) {
        const row = Object.fromEntries(FIELDS.map((f, i) => [f, q[i]]));
        if (existingKeys.has(`${topicId}|${row.questionText}`)) continue;
        rows.push({
          ...row,
          topicId,
          status: 'approved',
          isAIGenerated: false,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }

    if (rows.length > 0) {
      await queryInterface.bulkInsert('questions', rows);
    }
    console.log(`Question bank: inserted ${rows.length} new questions.`);
  },

  down: async (queryInterface, Sequelize) => {
    const texts = Object.values(bank).flat().map(q => q[2]);
    await queryInterface.bulkDelete('questions', { questionText: { [Sequelize.Op.in]: texts } });
  }
};
