// Utility to generate automated personalized WhatsApp booking links
export const generateWhatsAppBookingUrl = (dest) => {
  const agencyPhone = '918918106326';
  if (!dest) {
    return `https://wa.me/${agencyPhone}?text=${encodeURIComponent('Hello Bangalir Berano! I would like to enquire about your tour packages.')}`;
  }

  const lines = [
    'Hello Bangalir Berano! ',
    '',
    'I would like to enquire / book the following tour package:',
    '',
    ` *Package:* ${dest.name || 'Tour Package'}`
  ];

  if (dest.date) {
    lines.push(` *Date:* ${dest.date}`);
  }
  if (dest.duration) {
    lines.push(` *Duration:* ${dest.duration}`);
  }
  if (dest.price) {
    lines.push(` *Package Cost:* ${dest.price}${dest.priceNote ? ` (${dest.priceNote})` : ''}`);
  }
  if (dest.route) {
    lines.push(` *Route:* ${dest.route}`);
  }
  if (dest.seatsLeft != null && dest.seatsLeft !== '') {
    lines.push(` *Seats Available:* ${dest.seatsLeft}`);
  }

  lines.push('');
  lines.push('Please let me know about seat availability and booking details. Thank you!');

  return `https://wa.me/${agencyPhone}?text=${encodeURIComponent(lines.join('\n'))}`;
};
