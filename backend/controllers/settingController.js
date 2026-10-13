const Setting = require('../models/Setting');

exports.getSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      // Create default if none exists
      settings = await Setting.create({
        name: 'BANGALIR BERANO',
        fullName: 'Bangalir Berano Tours & Travels',
        phone: '+91 98300 33647',
        phoneRaw: '919830033647',
        phoneTel: 'tel:+919830033647',
        whatsapp: 'https://wa.me/918918106326',
        email: 'contact@bangalirberano.com',
        rating: '4.8',
        reviews: '220+',
        address: '42, B G G Sarani, Radha Neel Nibas-II, Bhadrakali, Uttarpara, Hooghly, WB - 712232.\nLand Mark : Near Bhadrakali Youth Core Club.',
        youtube: 'https://www.youtube.com/c/BANGALIRBERANO',
        facebook: 'https://www.facebook.com/officialbangalirberano/'
      });
    } else if (settings.email === 'info@bangalirberano.com') {
      settings.email = 'contact@bangalirberano.com';
      await settings.save();
    }
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const settings = await Setting.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
