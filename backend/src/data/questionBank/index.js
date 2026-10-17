/**
 * EduAdapt – Manual Question Bank (undergraduate CS level)
 *
 * Core source of questions, and the fallback when AI generation is unavailable.
 * Every question is inserted with isAIGenerated = false and status = 'approved'.
 * One file per topic. To add a new topic: create a file here and add one line below.
 * The key must match the topic name in the topics table exactly.
 *
 * Difficulty rule (Bloom's Taxonomy):
 *   easy   -> Remember: definitions, keywords, basic syntax
 *   medium -> Understand / Apply: predict the output of short code
 *   hard   -> Analyse: tricky behaviour, edge cases, design reasoning
 */
module.exports = {
  'JavaScript Basics': require('./javascript-basics'),
  'JavaScript Arrays': require('./javascript-arrays'),
  'JavaScript Functions': require('./javascript-functions'),
  'Database Basics': require('./database-basics'),
  'HTML & CSS': require('./html-and-css')
};
