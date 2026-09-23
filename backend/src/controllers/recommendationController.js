const { generateRecommendations, getTopicPerformance, getRecentResponses, calculateAccuracy } = require('../utils/adaptive');
const Resource = require('../models/Resource');
const Topic = require('../models/Topic');
const { Op } = require('sequelize');

// GET /api/recommendations
exports.getRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;
    const recommendations = await generateRecommendations(userId);

    // Get recommended resources for weak topics
    const weakTopicIds = recommendations.weakTopics.map(t => t.topicId);
    
    let recommendedResources = [];
    if (weakTopicIds.length > 0) {
      recommendedResources = await Resource.findAll({
        where: { topicId: { [Op.in]: weakTopicIds }, isActive: true },
        include: [{ model: Topic, as: 'topic', attributes: ['id', 'name'] }],
        limit: 10
      });
    }

    // If no weak topics, get general resources
    if (recommendedResources.length === 0) {
      recommendedResources = await Resource.findAll({
        where: { isActive: true },
        include: [{ model: Topic, as: 'topic', attributes: ['id', 'name'] }],
        limit: 5
      });
    }

    res.json({
      ...recommendations,
      recommendedResources
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/recommendations/performance
exports.getPerformance = async (req, res) => {
  try {
    const userId = req.user.id;
    const topicPerformance = await getTopicPerformance(userId);
    const recentResponses = await getRecentResponses(userId, 5);
    const recentAccuracy = calculateAccuracy(recentResponses);

    res.json({
      topicPerformance,
      recentAccuracy,
      recentResponsesCount: recentResponses.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
