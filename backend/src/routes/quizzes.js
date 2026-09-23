const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/all', auth, adminOnly, quizController.getAllQuizzes);
router.get('/history', auth, quizController.getQuizHistory);
router.post('/start', auth, quizController.startQuiz);
router.post('/:id/submit', auth, quizController.submitQuiz);
router.get('/:id', auth, quizController.getQuizById);

module.exports = router;
