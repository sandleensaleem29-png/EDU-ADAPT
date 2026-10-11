const Topic = require('../models/Topic');
const Question = require('../models/Question');
const Resource = require('../models/Resource');
const sequelize = require('../config/database');

// GET /api/topics
exports.getAllTopics = async (req, res) => {
  try {
    const topics = await Topic.findAll({
      where: { isActive: true },
      include: [{
        model: Question,
        as: 'questions',
        required: false,
        attributes: ['id'],
        where: { status: 'approved' }
      }],
      order: [['name', 'ASC']]
    });

    res.json({ topics });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/topics/:id
exports.getTopicById = async (req, res) => {
  try {
    const topic = await Topic.findByPk(req.params.id, {
      include: [
        { model: Question, as: 'questions', where: { status: 'approved' }, required: false },
        { model: Resource, as: 'resources', where: { isActive: true }, required: false }
      ]
    });

    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    res.json({ topic });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// POST /api/topics (admin)
exports.createTopic = async (req, res) => {
  try {
    const { name, description, icon } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Topic name is required' });
    }

    const existing = await Topic.findOne({ where: { name } });
    if (existing) {
      return res.status(400).json({ message: 'Topic already exists' });
    }

    const topic = await Topic.create({ name, description, icon });
    res.status(201).json({ message: 'Topic created', topic });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// PUT /api/topics/:id (admin)
exports.updateTopic = async (req, res) => {
  try {
    const { name, description, icon, isActive } = req.body;
    const topic = await Topic.findByPk(req.params.id);

    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    if (name) topic.name = name;
    if (description !== undefined) topic.description = description;
    if (icon) topic.icon = icon;
    if (isActive !== undefined) topic.isActive = isActive;

    await topic.save();
    res.json({ message: 'Topic updated', topic });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// DELETE /api/topics/:id (admin)
exports.deleteTopic = async (req, res) => {
  try {
    const topic = await Topic.findByPk(req.params.id);

    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    await topic.destroy();
    res.json({ message: 'Topic deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
