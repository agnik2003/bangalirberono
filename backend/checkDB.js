const mongoose = require('mongoose');
require('dotenv').config();
const MONGO_URI = process.env.MONGODB_URI;
const PackageSchema = new mongoose.Schema({}, { strict: false });
const Package = mongoose.model('Package', PackageSchema, 'packages');

async function check() {
  await mongoose.connect(MONGO_URI);
  const packages = await Package.find().sort({ sortOrder: 1 });
  for (let p of packages) {
    console.log(`${p.name} - sortOrder: ${p.sortOrder} - id: ${p._id}`);
  }
  await mongoose.disconnect();
}
check().catch(e => { console.error(e); process.exit(1); });
