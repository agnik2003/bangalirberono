const mongoose = require('mongoose');
require('dotenv').config();
const MONGO_URI = process.env.MONGODB_URI;

const PackageSchema = new mongoose.Schema({}, { strict: false });
const Package = mongoose.model('Package', PackageSchema, 'packages');

async function testUpdate() {
  await mongoose.connect(MONGO_URI);
  
  const orderedIds = [
    '6ac370baed7b7adf120147d2', // Kerala
    '6ac7827a6cd00907275ead0a', // Andaman
    '6ac782f55c706fa8f137e6e4'  // Zanskar
  ];
  
  console.log("Updating DB...");
  await Promise.all(orderedIds.map((id, idx) => Package.findByIdAndUpdate(id, { sortOrder: idx })));
  console.log("Update done.");
  
  const packages = await Package.find().sort({ sortOrder: 1, createdAt: -1 });
  console.log("Returned order from DB query:");
  for (let p of packages) {
    console.log(`${p.name} - sortOrder: ${p.sortOrder}`);
  }
  await mongoose.disconnect();
}
testUpdate().catch(e => { console.error(e); process.exit(1); });
