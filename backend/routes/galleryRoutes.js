const express = require('express');
const router = express.Router();
const gc = require('../controllers/galleryController');
const authMiddleware = require('../middleware/authMiddleware');

// ── Folders (public GET, auth for mutations) ──────────────────────────────────
router.get('/folders', gc.getFolders);
router.post('/folders', authMiddleware, gc.uploadMiddleware, gc.createFolder);
router.put('/folders/:id', authMiddleware, gc.uploadMiddleware, gc.updateFolder);
router.delete('/folders/:id', authMiddleware, gc.deleteFolder);

// ── Images (public GET, auth for mutations) ───────────────────────────────────
router.get('/images', gc.getImages);
router.post('/images', authMiddleware, gc.uploadMiddleware, gc.uploadImage);
router.put('/images/:id', authMiddleware, gc.updateImage);
router.delete('/images/:id', authMiddleware, gc.deleteImage);

module.exports = router;
