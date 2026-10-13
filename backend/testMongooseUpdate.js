const mongoose = require('mongoose');
require('dotenv').config();
const MONGO_URI = process.env.MONGODB_URI;

const PackageSchema = new mongoose.Schema({}, { strict: false });
const Package = mongoose.model('Package', PackageSchema, 'packages');

async function testUpdate() {
  await mongoose.connect(MONGO_URI);
  const pkg = await Package.findOne();
  console.log('Before update sortOrder:', pkg.sortOrder);
  
  await Package.findByIdAndUpdate(pkg._id, { sortOrder: 99 });
  
  const pkgAfter = await Package.findById(pkg._id);
  console.log('After update sortOrder:', pkgAfter.sortOrder);
  
  // Revert
  await Package.findByIdAndUpdate(pkg._id, { sortOrder: pkg.sortOrder });
  await mongoose.disconnect();
}
testUpdate().catch(e => { console.error(e); process.exit(1); });
