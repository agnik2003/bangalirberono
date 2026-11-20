const mongoose = require('mongoose');

const galleryImageSchema = new mongoose.Schema({
  folder: { type: mongoose.Schema.Types.ObjectId, ref: 'GalleryFolder', required: true },
  url: { type: String, required: true },      // served path like /gallery/filename.jpg
  filename: { type: String, required: true },
  caption: { type: String, trim: true, default: '' },
  heading: { type: String, trim: true, default: '' },
  sortOrder: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('GalleryImage', galleryImageSchema);
