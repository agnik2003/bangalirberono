const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const multer = require('multer');
const GalleryFolder = require('../models/GalleryFolder');
const GalleryImage = require('../models/GalleryImage');

// ── Upload directory ──────────────────────────────────────────────────────────
// Stored in the root 'gallery' folder alongside backend and frontend
const GALLERY_DIR = path.join(__dirname, '..', '..', 'gallery');
if (!fs.existsSync(GALLERY_DIR)) fs.mkdirSync(GALLERY_DIR, { recursive: true });

// ── Multer — store in memory so sharp can compress before writing ──────────────
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) cb(null, true);
  else cb(new Error('Only image files are allowed'), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB raw max before compression
});

// Middleware to export — single file, field name 'image'
const uploadMiddleware = upload.single('image');

// ── Helper: compress & save image ─────────────────────────────────────────────
async function saveCompressed(buffer, originalName) {
  const ext = path.extname(originalName).toLowerCase();
  const base = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `${base}_${Date.now()}.webp`;
  const dest = path.join(GALLERY_DIR, filename);

  // Compress: resize max 1600px wide, quality 80 webp — good balance quality/size
  await sharp(buffer)
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(dest);

  return filename;
}

// ═════════════════════════════════════════════════════════════════════════════
// FOLDER CRUD
// ═════════════════════════════════════════════════════════════════════════════

// GET /api/gallery/folders
exports.getFolders = async (req, res) => {
  try {
    const folders = await GalleryFolder.find().sort({ sortOrder: 1, createdAt: -1 });
    // Count images per folder
    const counts = await GalleryImage.aggregate([
      { $group: { _id: '$folder', count: { $sum: 1 } } }
    ]);
    const countMap = {};
    counts.forEach(c => { countMap[String(c._id)] = c.count; });
    const data = folders.map(f => ({ ...f.toObject(), imageCount: countMap[String(f._id)] || 0 }));
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// POST /api/gallery/folders
exports.createFolder = async (req, res) => {
  try {
    const { name, description, imageType } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ success: false, error: 'Folder name is required' });

    let coverImage = '';
    if (req.file) {
      const filename = await saveCompressed(req.file.buffer, req.file.originalname);
      coverImage = `/gallery/${filename}`;
    }

    const folder = await GalleryFolder.create({
      name: name.trim(),
      description: (description || '').trim(),
      imageType: (imageType || '').trim(),
      coverImage,
    });
    res.status(201).json({ success: true, data: folder });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// PUT /api/gallery/folders/:id
exports.updateFolder = async (req, res) => {
  try {
    const { name, description, imageType } = req.body;
    const update = {};
    if (name) update.name = name.trim();
    if (description !== undefined) update.description = description.trim();
    if (imageType !== undefined) update.imageType = imageType.trim();

    if (req.file) {
      const filename = await saveCompressed(req.file.buffer, req.file.originalname);
      update.coverImage = `/gallery/${filename}`;
      // Delete old cover image if exists
      const old = await GalleryFolder.findById(req.params.id);
      if (old && old.coverImage) {
        const oldPath = path.join(GALLERY_DIR, path.basename(old.coverImage));
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
    }

    const folder = await GalleryFolder.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!folder) return res.status(404).json({ success: false, error: 'Folder not found' });
    res.json({ success: true, data: folder });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// DELETE /api/gallery/folders/:id
exports.deleteFolder = async (req, res) => {
  try {
    const folder = await GalleryFolder.findById(req.params.id);
    if (!folder) return res.status(404).json({ success: false, error: 'Folder not found' });

    // Delete all images in folder
    const images = await GalleryImage.find({ folder: req.params.id });
    for (const img of images) {
      const filePath = path.join(GALLERY_DIR, path.basename(img.filename));
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    await GalleryImage.deleteMany({ folder: req.params.id });

    // Delete cover image
    if (folder.coverImage) {
      const coverPath = path.join(GALLERY_DIR, path.basename(folder.coverImage));
      if (fs.existsSync(coverPath)) fs.unlinkSync(coverPath);
    }

    await GalleryFolder.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ═════════════════════════════════════════════════════════════════════════════
// IMAGE CRUD
// ═════════════════════════════════════════════════════════════════════════════

// GET /api/gallery/images?folder=:folderId
exports.getImages = async (req, res) => {
  try {
    const filter = {};
    if (req.query.folder) filter.folder = req.query.folder;
    const images = await GalleryImage.find(filter).sort({ sortOrder: 1, createdAt: -1 });
    res.json({ success: true, data: images });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// POST /api/gallery/images   (multipart, field: image)
exports.uploadImage = async (req, res) => {
  try {
    const { folder, heading, caption } = req.body;
    if (!folder) return res.status(400).json({ success: false, error: 'folder id is required' });
    if (!req.file) return res.status(400).json({ success: false, error: 'No image uploaded' });

    const folderDoc = await GalleryFolder.findById(folder);
    if (!folderDoc) return res.status(404).json({ success: false, error: 'Folder not found' });

    // Check total image count (soft limit enforced server-side)
    const totalCount = await GalleryImage.countDocuments();
    if (totalCount >= 500) {
      return res.status(400).json({ success: false, error: 'Gallery limit reached. Maximum 500 images allowed.' });
    }

    const filename = await saveCompressed(req.file.buffer, req.file.originalname);
    const image = await GalleryImage.create({
      folder,
      url: `/gallery/${filename}`,
      filename,
      heading: (heading || '').trim(),
      caption: (caption || '').trim(),
    });

    // Auto-set folder cover if none
    if (!folderDoc.coverImage) {
      await GalleryFolder.findByIdAndUpdate(folder, { coverImage: `/gallery/${filename}` });
    }

    res.status(201).json({ success: true, data: image });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// PUT /api/gallery/images/:id  (update caption/heading only)
exports.updateImage = async (req, res) => {
  try {
    const { heading, caption } = req.body;
    const update = {};
    if (heading !== undefined) update.heading = heading.trim();
    if (caption !== undefined) update.caption = caption.trim();
    const image = await GalleryImage.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!image) return res.status(404).json({ success: false, error: 'Image not found' });
    res.json({ success: true, data: image });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// DELETE /api/gallery/images/:id
exports.deleteImage = async (req, res) => {
  try {
    const image = await GalleryImage.findById(req.params.id);
    if (!image) return res.status(404).json({ success: false, error: 'Image not found' });

    // Delete file from disk
    const filePath = path.join(GALLERY_DIR, path.basename(image.filename));
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await GalleryImage.findByIdAndDelete(req.params.id);

    // If this was the folder's cover, pick another or clear
    const folder = await GalleryFolder.findById(image.folder);
    if (folder && folder.coverImage && folder.coverImage.includes(path.basename(image.filename))) {
      const nextImg = await GalleryImage.findOne({ folder: image.folder });
      await GalleryFolder.findByIdAndUpdate(image.folder, { coverImage: nextImg ? nextImg.url : '' });
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.uploadMiddleware = uploadMiddleware;
