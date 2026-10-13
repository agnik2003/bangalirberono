const Customer = require('../models/Customer');

exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json({ success: true, data: customers });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error fetching customers' });
  }
};

exports.createCustomer = async (req, res) => {
  try {
    const { name, phone, email, age, gender, locationFrom, heads, postpaidNumber, downTrainFlight, room, packageName, status, details } = req.body;
    
    // Check if customer with same name + phone exists
    let customer = await Customer.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') }, 
      phone 
    });

    if (customer) {
      // Just add interaction
      if (details) {
        customer.interactions.push({ type: 'Manual', details });
      }
      if (status) customer.status = status;
      if (age) customer.age = age;
      if (gender) customer.gender = gender;
      if (locationFrom) customer.locationFrom = locationFrom;
      if (heads) customer.heads = heads;
      if (postpaidNumber) customer.postpaidNumber = postpaidNumber;
      if (downTrainFlight) customer.downTrainFlight = downTrainFlight;
      if (room) customer.room = room;
      if (packageName) customer.packageName = packageName;

      await customer.save();
      return res.json({ success: true, data: customer });
    }

    customer = new Customer({
      name,
      phone,
      email,
      age,
      gender,
      locationFrom,
      heads,
      postpaidNumber,
      downTrainFlight,
      room,
      packageName,
      status: status || 'Enquired',
      interactions: details ? [{ type: 'Manual', details }] : []
    });
    
    await customer.save();
    res.status(201).json({ success: true, data: customer });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error creating customer' });
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!customer) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: customer });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Internal Helper for other controllers
exports.trackCustomerInteraction = async ({ name, phone, email, type, details, newStatus }) => {
  if (!name || !phone) return null;
  try {
    let customer = await Customer.findOne({ 
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') }, 
      phone: phone.trim() 
    });

    if (!customer) {
      customer = new Customer({
        name: name.trim(),
        phone: phone.trim(),
        email: email?.trim(),
        status: newStatus || 'Enquired',
        interactions: [{ type, details }]
      });
    } else {
      if (email && !customer.email) customer.email = email.trim();
      if (newStatus) {
        // Upgrade status logic: Enquired -> Upcoming Trip -> Completed Trip
        const hierarchy = { 'Enquired': 1, 'Upcoming Trip': 2, 'Completed Trip': 3 };
        const currRank = hierarchy[customer.status] || 0;
        const newRank = hierarchy[newStatus] || 0;
        if (newRank > currRank) {
          customer.status = newStatus;
        }
      }
      customer.interactions.push({ type, details });
    }
    
    await customer.save();
    return customer;
  } catch (err) {
    console.error('Customer tracking error:', err);
    return null;
  }
};
