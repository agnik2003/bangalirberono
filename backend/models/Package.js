const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  route: { type: String, default: '' },
  category: { type: [String], default: [] },
  experiences: { type: [String], default: [] },
  status: { type: String, enum: ['Upcoming', 'Ongoing', 'Past'], default: 'Upcoming' },
  tag: { type: String, default: '' },
  date: { type: String, default: '' },         // Legacy/manual override
  startDate: { type: Date, default: null },
  endDate: { type: Date, default: null },
  duration: { type: String, default: '' },      // e.g. "9 Nights / 10 Days"
  image: { type: String, default: '' },
  description: { type: String, default: '' },

  // Pricing
  price: { type: String, required: true },      // e.g. "₹29,900/-"
  priceNote: { type: String, default: '' },     // e.g. "Double Bed Sharing"
  childRate1: { type: String, default: '' },    // e.g. "5–8 years: ₹22,900/-"
  childRate2: { type: String, default: '' },    // e.g. "Below 5 years: ₹11,900/-"
  advance: { type: String, default: '' },       // e.g. "₹10,000/- per person"

  // Lists
  highlights: { type: [String], default: [] },
  includes: { type: [String], default: [] },
  excludes: { type: [String], default: [] },

  // Notes
  notes: { type: String, default: '' },         // e.g. "Alcohol strictly prohibited..."

  seatsLeft: { type: Number, default: null },   // e.g. 5
  sortOrder: { type: Number, default: 0 },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Package', packageSchema);
