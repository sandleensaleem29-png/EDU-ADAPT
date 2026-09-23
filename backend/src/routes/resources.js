const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/', auth, resourceController.getAllResources);
router.get('/:id', auth, resourceController.getResourceById);
router.post('/', auth, adminOnly, resourceController.createResource);
router.put('/:id', auth, adminOnly, resourceController.updateResource);
router.delete('/:id', auth, adminOnly, resourceController.deleteResource);

module.exports = router;
