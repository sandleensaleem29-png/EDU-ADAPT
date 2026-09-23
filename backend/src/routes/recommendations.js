const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController');
const { auth } = require('../middleware/auth');

router.get('/', auth, recommendationController.getRecommendations);
router.get('/performance', auth, recommendationController.getPerformance);

module.exports = router;
