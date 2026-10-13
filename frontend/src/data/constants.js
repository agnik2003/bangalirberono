const getApiBase = () => {
  const envUrl = (import.meta.env.VITE_API_URL || '').trim().replace(/\/+$/, '');
  if (!envUrl) return 'http://localhost:5000/api';
  return envUrl.endsWith('/api') ? envUrl : `${envUrl}/api`;
};

export const API = getApiBase();

export const authFetch = (url, options = {}) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
  const headers = { ...(options.headers || {}) };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return fetch(url, {
    ...options,
    headers,
    credentials: 'include'
  });
};
// ============================================================
// BANGALIR BERANO — Site Data / Constants
// All editable content is centralized here.
// ============================================================

export const BRAND = {
  name: 'BANGALIR BERANO',
  fullName: 'Bangalir Berano Tours & Travels',
  phone: '+91 98300 33647',
  phoneRaw: '919830033647',
  phoneTel: 'tel:+919830033647',
  whatsapp: 'https://wa.me/918918106326',
  email: 'info@bangalirberano.com', // placeholder — replace with actual
  rating: '4.8',
  reviews: '220+',
  address: '42, B G G Sarani, Radha Neel Nibas, Bhadrakali, Hooghly, WB - 712232.\nLand Mark : Near Bhadrakali Youth Core Club.',
  youtube: 'https://www.youtube.com/c/BANGALIRBERANO',
  facebook: 'https://www.facebook.com/officialbangalirberano/',
};

// ---- Navigation ----
export const NAV_LINKS = [
  { label: 'Home',         href: '#home' },
  { label: 'Destinations', href: '/destinations' },
  { label: 'Experiences',  href: '/experiences' },
  { label: 'About Us',     href: '#about' },
  { label: 'Reviews',      href: '/reviews' },
  { label: 'Contact',      href: '/contact' },
];

// ---- Stats — ONLY verified data + safe placeholders ----
export const STATS = [
  { value: '4.8★', label: 'Google Rating',   verified: true },
  { value: '220+', label: 'Happy Reviews',    verified: true },
  { value: '1000+', label: 'Travellers',      verified: false, note: 'Editable placeholder' },
  { value: '50+',  label: 'Destinations',     verified: false, note: 'Editable placeholder' },
];

// ---- Destinations ----
export const DESTINATIONS = [];


// ---- Experience types ----
export const EXPERIENCES = [
  {
    id: 1,
    title: 'Family Holidays',
    description: 'Relaxed itineraries, verified hotels, and comfortable vehicles planned so elders and children enjoy every moment.',
    image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=700&q=80',
    icon: '👨‍👩‍👧‍👦',
  },
  {
    id: 2,
    title: 'Couple Escapes',
    description: 'Peaceful hill stays, scenic viewpoints, and quiet moments designed for two.',
    image: '/exp_couple_1791035903408.jpg',
    icon: '💑',
  },
  {
    id: 3,
    title: 'Group Tours',
    description: 'Lively group departures where fellow travel lovers explore, dine, and make lifelong friends together.',
    image: '/exp_group_1791035917348.jpg',
    icon: '👥',
  },
  {
    id: 4,
    title: 'Adventure Trips',
    description: 'High-altitude mountain passes, scenic treks, and raw landscapes for travellers who love the thrill of the road.',
    image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=700&q=80',
    icon: '🏔️',
  },
  {
    id: 5,
    title: 'Weekend Escapes',
    description: 'Quick 2 to 3 day getaways to unwind and recharge without taking long leaves from work.',
    image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=700&q=80',
    icon: '🌅',
  },
  {
    id: 6,
    title: 'Custom Tours',
    description: 'Have a specific date or special place in mind? Tell us where you want to go and we will tailor it for you.',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=700&q=80',
    icon: '✨',
  },
];

// ---- Why Choose Us ----
export const WHY_US = [
  {
    id: 1,
    title: 'Thoughtful Planning',
    description: 'We plan trips at a relaxed pace so elders, kids, and families can travel comfortably without feeling rushed.',
    icon: 'Map',
  },
  {
    id: 2,
    title: 'Real Ground Insights',
    description: 'Direct route insights, honest weather advice, and verified stopovers gathered from years of traveling.',
    icon: 'Compass',
  },
  {
    id: 3,
    title: 'Always A Call Away',
    description: 'From your first booking enquiry until you return home safely, our team is always on call to support you.',
    icon: 'HeadphonesIcon',
  },
  {
    id: 4,
    title: 'Family-Like Warmth',
    description: 'Traveling with Bangalir Berano feels like exploring with an extended family of warm, friendly travellers.',
    icon: 'Camera',
  },
  {
    id: 5,
    title: 'Group Tour Departures',
    description: 'Scheduled holiday departures planned around Puja vacations, summer holidays, and festive long weekends.',
    icon: 'Users',
  },
  {
    id: 6,
    title: 'Verified Hotels',
    description: 'Clean, hygienic rooms with good amenities, hot water, and scenic views so you rest peacefully every night.',
    icon: 'Building',
  },
  {
    id: 7,
    title: 'Reliable Vehicles',
    description: 'Comfortable cars and tempo travellers driven by seasoned hill drivers who prioritize passenger safety.',
    icon: 'Car',
  },
  {
    id: 8,
    title: 'Complete Sightseeing',
    description: 'Covering all marquee viewpoints and peaceful local gems without cutting corners or hidden extras.',
    icon: 'MapPin',
  },
  {
    id: 9,
    title: 'Homely Meals on Tour',
    description: 'Timely, hygienic, and comforting meals prepared so you never have to worry about finding good food on the way.',
    icon: 'Utensils',
  },
  {
    id: 10,
    title: 'Caring Tour Managers',
    description: 'Friendly on-ground coordinators who manage hotel check-ins, tickets, and group logistics smoothly.',
    icon: 'UserCheck',
  },
  {
    id: 11,
    title: 'Train Ticket Support',
    description: 'Sleeper and AC train ticket assistance included on our major scheduled group departure packages.',
    icon: 'Train',
  },
  {
    id: 12,
    title: 'Direct WhatsApp Booking',
    description: 'Send your questions or passenger details directly to Utpal da and our team on WhatsApp in minutes.',
    icon: 'MessageCircle',
  },
];

// ---- Journey Steps ----
export const JOURNEY_STEPS = [
  {
    number: '01',
    title: 'Choose Your Destination',
    description: 'Browse our scheduled tours or tell us where you and your family would like to travel next.',
  },
  {
    number: '02',
    title: 'Discuss & Plan',
    description: 'We share the complete itinerary, dates, hotel arrangements, and clear inclusions with you.',
  },
  {
    number: '03',
    title: 'Confirm & Pack Your Bags',
    description: 'Reserve your seats with a simple advance booking. We look after all ground arrangements.',
  },
  {
    number: '04',
    title: 'Travel & Enjoy',
    description: 'Board your train or vehicle and make beautiful memories with friendly co-travellers.',
  },
];

// ---- Testimonials ----
export const TESTIMONIALS = [
  {
    id: 1,
    name: 'Anirban Chatterjee',
    location: 'Kolkata, West Bengal',
    rating: 5,
    text: 'A truly memorable trip with Bangalir Berano. The hotel arrangements, food quality, and vehicle timing were handled with great care. Highly recommended for family vacations.',
    avatar: 'A',
  },
  {
    id: 2,
    name: 'Debashis Mitra',
    location: 'Howrah, West Bengal',
    rating: 5,
    text: 'We travelled with our parents and children, and the whole tour was so peaceful. The team took personal care of senior citizens. Looking forward to booking again.',
    avatar: 'D',
  },
  {
    id: 3,
    name: 'Rupa Sengupta',
    location: 'Burdwan, West Bengal',
    rating: 5,
    text: 'Our Sikkim tour was wonderfully organized. The support from Utpal da and the team was exceptional from start to finish. Completely trustworthy.',
    avatar: 'R',
  },
  {
    id: 4,
    name: 'Sourav Das',
    location: 'Siliguri, West Bengal',
    rating: 5,
    text: 'Had an amazing time on our tour. Clean hotels, delicious meals, and very polite drivers. Bangalir Berano made the whole trip completely stress-free.',
    avatar: 'S',
  },
  {
    id: 5,
    name: 'Amit Roy',
    location: 'Kolkata, West Bengal',
    rating: 5,
    text: 'One of the best tour experiences we have had. The scenic spots, relaxed schedule, and friendly atmosphere felt like traveling with family.',
    avatar: 'A',
  },
];

// ---- Travel type options for enquiry form ----
export const TRAVEL_TYPES = [
  'Family Trip',
  'Couple Trip',
  'Group Tour',
  'Adventure',
  'Weekend Trip',
  'Custom Trip',
];

// ---- FAQs ----
export const FAQS = [
  {
    id: 1,
    question: 'How do I book a tour?',
    answer: 'Simply click "Book Now" or "Book via WhatsApp" on any tour card. You can also call us directly at +91 98300 33647 or WhatsApp us at +91 89181 06326 to reserve your seats.',
  },
  {
    id: 2,
    question: 'Are train tickets included in the packages?',
    answer: 'Yes, for most of our published group tours, Sleeper (SL) train tickets are already included in the package cost. If you prefer 3AC or flight options, we can gladly arrange that on request.',
  },
  {
    id: 3,
    question: 'What kind of food and meals are provided?',
    answer: 'On our group tours, we provide complete daily meals including morning tea, breakfast, lunch, evening tea with snacks, and dinner. Meals are freshly cooked, hygienic, and suited for Bengali tastes.',
  },
  {
    id: 4,
    question: 'Where is Bangalir Berano located?',
    answer: BRAND.address,
  },
];

