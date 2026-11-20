const mongoose = require('mongoose');

const galleryFolderSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true, default: '' },
  coverImage: { type: String, default: '' },
  imageType: { type: String, trim: true, default: '' }, // e.g. "Gangtok Tour", "Beach", etc.
  sortOrder: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('GalleryFolder', galleryFolderSchema);
