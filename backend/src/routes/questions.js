const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/', auth, questionController.getAllQuestions);
router.get('/:id', auth, questionController.getQuestionById);
router.post('/', auth, adminOnly, questionController.createQuestion);
router.put('/:id', auth, adminOnly, questionController.updateQuestion);
router.delete('/:id', auth, adminOnly, questionController.deleteQuestion);
router.put('/:id/approve', auth, adminOnly, questionController.approveQuestion);
router.put('/:id/reject', auth, adminOnly, questionController.rejectQuestion);

module.exports = router;
