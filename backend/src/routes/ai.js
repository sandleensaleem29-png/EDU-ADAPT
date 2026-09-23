const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { auth, adminOnly } = require('../middleware/auth');

router.post('/generate-questions', auth, adminOnly, aiController.generateQuestions);

module.exports = router;
