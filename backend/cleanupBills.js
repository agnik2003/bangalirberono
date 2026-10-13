const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '.env') });

const Bill = require('./models/Bill');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  console.log('Connected to DB');
  const bills = await Bill.find().sort({ createdAt: -1 }); // Keep newest
  const seenBookings = new Set();
  
  for (const bill of bills) {
    if (bill.bookingId) {
      if (seenBookings.has(bill.bookingId.toString())) {
        console.log(`Deleting duplicate bill: ${bill.billNumber}`);
        await Bill.findByIdAndDelete(bill._id);
      } else {
        seenBookings.add(bill.bookingId.toString());
      }
    }
  }
  
  console.log('Cleanup complete');
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
