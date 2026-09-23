const Resource = require('../models/Resource');
const Topic = require('../models/Topic');
const { Op } = require('sequelize');

// GET /api/resources
exports.getAllResources = async (req, res) => {
  try {
    const { topicId, difficulty, type } = req.query;
    const where = { isActive: true };

    if (topicId) where.topicId = topicId;
    if (difficulty) where.difficulty = difficulty;
    if (type) where.type = type;

    const resources = await Resource.findAll({
      where,
      include: [{ model: Topic, as: 'topic', attributes: ['id', 'name'] }],
      order: [['createdAt', 'DESC']]
    });

    res.json({ resources });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/resources/:id
exports.getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findByPk(req.params.id, {
      include: [{ model: Topic, as: 'topic' }]
    });

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    res.json({ resource });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// POST /api/resources (admin)
exports.createResource = async (req, res) => {
  try {
    const { topicId, title, description, url, type, difficulty } = req.body;

    if (!topicId || !title || !url) {
      return res.status(400).json({ message: 'Topic, title and URL are required' });
    }

    const topic = await Topic.findByPk(topicId);
    if (!topic) {
      return res.status(400).json({ message: 'Invalid topic' });
    }

    const resource = await Resource.create({
      topicId,
      title,
      description,
      url,
      type: type || 'article',
      difficulty: difficulty || 'medium'
    });

    res.status(201).json({ message: 'Resource created', resource });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// PUT /api/resources/:id (admin)
exports.updateResource = async (req, res) => {
  try {
    const resource = await Resource.findByPk(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    const { topicId, title, description, url, type, difficulty, isActive } = req.body;

    if (topicId) resource.topicId = topicId;
    if (title) resource.title = title;
    if (description !== undefined) resource.description = description;
    if (url) resource.url = url;
    if (type) resource.type = type;
    if (difficulty) resource.difficulty = difficulty;
    if (isActive !== undefined) resource.isActive = isActive;

    await resource.save();
    res.json({ message: 'Resource updated', resource });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// DELETE /api/resources/:id (admin)
exports.deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findByPk(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    await resource.destroy();
    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
