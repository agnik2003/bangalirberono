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
      email: newBooking.email,
      type: 'Booking',
      details: `Direct booking for ${newBooking.destination}`,
      newStatus: 'Upcoming Trip'
    });

    res.status(201).json({ success: true, message: 'Booking saved', data: newBooking });
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

exports.updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    // Also update associated Bill if exists
    const Bill = require('../models/Bill');
    await Bill.updateMany(
      { bookingId: booking._id },
      {
        customerName: booking.name,
        customerPhone: booking.phone,
        customerEmail: booking.email || '',
        customerAddress: booking.location || '',
        packageName: booking.destination,
        travelDate: booking.date,
        travellers: booking.travellers
      }
    );

    await trackCustomerInteraction({
      name: booking.name,
      phone: booking.phone,
      email: booking.email,
      type: 'Booking',
      details: `Updated booking details for ${booking.destination}`
    });

    res.status(200).json({ success: true, message: 'Booking updated', data: booking });
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
