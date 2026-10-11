const express = require('express');
const router = express.Router();
const topicController = require('../controllers/topicController');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/', auth, topicController.getAllTopics);
router.get('/:id', auth, topicController.getTopicById);
router.post('/', auth, adminOnly, topicController.createTopic);
router.put('/:id', auth, adminOnly, topicController.updateTopic);
router.delete('/:id', auth, adminOnly, topicController.deleteTopic);

module.exports = router;
