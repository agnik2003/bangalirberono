const Enquiry = require('../models/Enquiry');
const Booking = require('../models/Booking');
const { trackCustomerInteraction } = require('./customerController');

exports.createEnquiry = async (req, res) => {
  try {
    const newEnquiry = new Enquiry(req.body);
    await newEnquiry.save();
    
    await trackCustomerInteraction({
      name: newEnquiry.name,
      phone: newEnquiry.phone,
      email: newEnquiry.email,
      type: 'Enquiry',
      details: `Enquired about ${newEnquiry.destination || newEnquiry.travelType || 'Tour'}`,
      newStatus: 'Enquired'
    });

    res.status(201).json({ success: true, message: 'Enquiry saved' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: enquiries });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.approveEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) return res.status(404).json({ success: false, message: 'Not found' });
    
    const newBooking = new Booking({
      name: enquiry.name,
      phone: enquiry.phone,
      destination: enquiry.destination || enquiry.travelType || 'Custom Journey',
      date: enquiry.date || 'Flexible',
      travellers: enquiry.travellers || 1,
      message: enquiry.message
    });
    await newBooking.save();
    
    await trackCustomerInteraction({
      name: enquiry.name,
      phone: enquiry.phone,
      email: enquiry.email,
      type: 'Booking',
      details: `Approved booking for ${newBooking.destination}`,
      newStatus: 'Upcoming Trip'
    });

    await Enquiry.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Moved to Bookings' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteEnquiry = async (req, res) => {
  try {
    await Enquiry.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Enquiry deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
