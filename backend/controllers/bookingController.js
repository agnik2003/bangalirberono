const Booking = require('../models/Booking');
const Enquiry = require('../models/Enquiry');
const { trackCustomerInteraction } = require('./customerController');

exports.createBooking = async (req, res) => {
  try {
    const newBooking = new Booking(req.body);
    await newBooking.save();

    await trackCustomerInteraction({
      name: newBooking.name,
      phone: newBooking.phone,
      type: 'Booking',
      details: `Direct booking for ${newBooking.destination}`,
      newStatus: 'Upcoming Trip'
    });

    res.status(201).json({ success: true, message: 'Booking saved' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Not found' });

    const newEnquiry = new Enquiry({
      name: booking.name,
      phone: booking.phone,
      destination: booking.destination,
      date: booking.date,
      travellers: booking.travellers,
      message: booking.message
    });
    await newEnquiry.save();

    await Booking.findByIdAndDelete(req.params.id);

    await trackCustomerInteraction({
      name: booking.name,
      phone: booking.phone,
      type: 'Manual',
      details: `Booking reverted to enquiry for ${booking.destination}`
    });

    res.status(200).json({ success: true, message: 'Booking reverted to Enquiry' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
