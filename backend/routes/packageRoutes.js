const express = require('express');
const router = express.Router();
const packageController = require('../controllers/packageController');
const authMiddleware = require('../middleware/authMiddleware');

// Public: get all packages
router.get('/', packageController.getPackages);

// Protected: reorder packages (must be BEFORE /:id so 'reorder' isn't treated as an id)
router.put('/reorder/bulk', authMiddleware, packageController.reorderPackages);

// Protected: create, update, delete — admin only
router.post('/', authMiddleware, packageController.upload.single('image'), packageController.createPackage);
router.put('/:id', authMiddleware, packageController.upload.single('image'), packageController.updatePackage);
router.delete('/:id', authMiddleware, packageController.deletePackage);

module.exports = router;
