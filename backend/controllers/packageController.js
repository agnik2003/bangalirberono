const Package = require('../models/Package');
const multer = require('multer');
const sharp = require('sharp');

// ── Multer memory storage (file never touches disk) ───────────────────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB raw upload limit
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif/;
    const ok = allowed.test(file.mimetype);
    ok ? cb(null, true) : cb(new Error('Only image files (JPG, PNG, WEBP) are allowed'));
  }
});

exports.upload = upload;

// ── Helper: compress & convert buffer → base64 data URL ──────────────────────
const toBase64DataUrl = async (buffer, mimetype) => {
  try {
    // Resize to max 1200px wide, compress to JPEG 80% quality → keeps size small in DB
    const compressed = await sharp(buffer)
      .resize({ width: 1200, withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toBuffer();
    return `data:image/jpeg;base64,${compressed.toString('base64')}`;
  } catch {
    // Fallback: store as-is if sharp fails
    return `data:${mimetype};base64,${buffer.toString('base64')}`;
  }
};

// ── Helper: parse newline-string to array ─────────────────────────────────────
const parseList = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  try { const p = JSON.parse(val); if (Array.isArray(p)) return p; } catch {}
  return val.split('\n').map(s => s.trim()).filter(Boolean);
};

// ── Controllers ───────────────────────────────────────────────────────────────
exports.getPackages = async (req, res) => {
  try {
    const packages = await Package.find().sort({ sortOrder: 1, createdAt: -1 }).lean();
    res.status(200).json({ success: true, data: packages });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.reorderPackages = async (req, res) => {
  try {
    console.log('Reorder endpoint hit! Body:', req.body);
    const { orderedIds } = req.body; // array of _id strings in new order
    if (!Array.isArray(orderedIds)) return res.status(400).json({ success: false, error: 'orderedIds must be an array' });
    await Promise.all(orderedIds.map((id, idx) => Package.findByIdAndUpdate(id, { sortOrder: idx })));
    console.log('Reorder success!');
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Reorder error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.createPackage = async (req, res) => {
  try {
    const body = { ...req.body };

    // If a file was uploaded, convert it to base64 and store in DB
    if (req.file) {
      body.image = await toBase64DataUrl(req.file.buffer, req.file.mimetype);
    }

    body.highlights  = parseList(body.highlights);
    body.includes    = parseList(body.includes);
    body.excludes    = parseList(body.excludes);
    body.experiences = parseList(body.experiences);
    body.category    = parseList(body.category);
    
    if (body.startDate === '') body.startDate = null;
    if (body.endDate === '') body.endDate = null;

    const pkg = new Package(body);
    await pkg.save();
    res.status(201).json({ success: true, data: pkg });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updatePackage = async (req, res) => {
  try {
    const body = { ...req.body };

    // If a new file was uploaded, convert to base64 and overwrite image
    if (req.file) {
      body.image = await toBase64DataUrl(req.file.buffer, req.file.mimetype);
    }

    body.highlights  = parseList(body.highlights);
    body.includes    = parseList(body.includes);
    body.excludes    = parseList(body.excludes);
    body.experiences = parseList(body.experiences);
    body.category    = parseList(body.category);

    if (body.startDate === '') body.startDate = null;
    if (body.endDate === '') body.endDate = null;

    const updated = await Package.findByIdAndUpdate(
      req.params.id, body, { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ success: false, error: 'Package not found' });
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.deletePackage = async (req, res) => {
  try {
    const deleted = await Package.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, error: 'Package not found' });
    res.status(200).json({ success: true, message: 'Package deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
