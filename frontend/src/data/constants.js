// ============================================================
// BANGALIR BERANO — Site Data / Constants
// All editable content is centralized here.
// ============================================================

export const BRAND = {
  name: 'BANGALIR BERANO',
  fullName: 'Bangalir Berano Tours & Travels',
  phone: '+91 891 810 6326',
  phoneRaw: '918918106326',
  phoneTel: 'tel:+918918106326',
  whatsapp: 'https://wa.me/918918106326',
  email: 'info@bangalirberano.com', // placeholder — replace with actual
  rating: '4.8',
  reviews: '220+',
  address: 'B.G.G, 42, Sukanta Sarani, Bhadrakali, Uttarpara, Debaipukur, West Bengal 712232',
  youtube: 'https://www.youtube.com/c/BANGALIRBERANO',
  facebook: 'https://www.facebook.com/officialbangalirberano/',
};

// ---- Navigation ----
export const NAV_LINKS = [
  { label: 'Home',         href: '#home' },
  { label: 'Destinations', href: '#destinations' },
  { label: 'Experiences',  href: '#experiences' },
  { label: 'About Us',     href: '#about' },
  { label: 'Reviews',      href: '#reviews' },
  { label: 'Contact',      href: '#contact' },
];

// ---- Stats — ONLY verified data + safe placeholders ----
export const STATS = [
  { value: '4.8★', label: 'Google Rating',   verified: true },
  { value: '220+', label: 'Happy Reviews',    verified: true },
  { value: '1000+', label: 'Travellers',      verified: false, note: 'Editable placeholder' },
  { value: '50+',  label: 'Destinations',     verified: false, note: 'Editable placeholder' },
];

// ---- Destinations ----
export const DESTINATIONS = [
  {
    id: 1,
    name: 'Darjeeling',
    region: 'West Bengal',
    description: 'The Queen of the Hills — misty mountains, tea gardens and Himalayan sunrises.',
    image: 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=800&q=80',
    tag: 'Mountain Escape',
  },
  {
    id: 2,
    name: 'Sikkim',
    region: 'Northeast India',
    description: 'Ancient monasteries, pristine lakes and the grandeur of Kanchenjunga.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    tag: 'Himalayan Beauty',
  },
  {
    id: 3,
    name: 'Bhutan',
    region: 'Land of the Thunder Dragon',
    description: 'A kingdom of happiness — fortresses, prayer flags and breathtaking valleys.',
    image: '/bhutan_tigers_nest_1791035346447.jpg', // Bhutan Monastery
    tag: 'Kingdom Escape',
  },
  {
    id: 4,
    name: 'North Bengal',
    region: 'Dooars & Terai',
    description: 'Lush tea estates, jungle safaris and the peaceful Dooars landscape.',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
    tag: 'Nature Retreat',
  },
  {
    id: 5,
    name: 'Northeast India',
    region: 'Meghalaya, Assam & More',
    description: 'Living root bridges, waterfalls, tribal culture and untouched wilderness.',
    image: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=800&q=80',
    tag: 'Adventure Trail',
  },
  {
    id: 6,
    name: 'Kashmir',
    region: 'Jammu & Kashmir',
    description: 'Dal Lake, Gulmarg meadows and the valley of eternal beauty.',
    image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?w=800&q=80', // Dal Lake Kashmir
    tag: 'Paradise Valley',
  },
];

// ---- Experience types ----
export const EXPERIENCES = [
  {
    id: 1,
    title: 'Family Holidays',
    description: 'Comfortable and memorable journeys for families.',
    image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=700&q=80',
    icon: '👨‍👩‍👧‍👦',
  },
  {
    id: 2,
    title: 'Couple Escapes',
    description: 'Beautiful destinations and experiences for two.',
    image: '/exp_couple_1791035903408.jpg',
    icon: '💑',
  },
  {
    id: 3,
    title: 'Group Tours',
    description: 'Travel together, explore together.',
    image: '/exp_group_1791035917348.jpg',
    icon: '👥',
  },
  {
    id: 4,
    title: 'Adventure Trips',
    description: 'For travellers looking for something beyond the ordinary.',
    image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=700&q=80',
    icon: '🏔️',
  },
  {
    id: 5,
    title: 'Weekend Escapes',
    description: 'Short trips, big memories.',
    image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=700&q=80',
    icon: '🌅',
  },
  {
    id: 6,
    title: 'Custom Tours',
    description: 'Tell us where you want to go — we\'ll help plan it.',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=700&q=80',
    icon: '✨',
  },
];

// ---- Why Choose Us ----
export const WHY_US = [
  {
    id: 1,
    title: 'Thoughtful Planning',
    description: 'Every journey is planned around the traveller — your preferences, pace and priorities.',
    icon: 'Map',
  },
  {
    id: 2,
    title: 'Local Understanding',
    description: 'Travel experiences built around destinations, routes and practical details that matter.',
    icon: 'Compass',
  },
  {
    id: 3,
    title: 'Personal Assistance',
    description: 'Get support before and during your journey — someone who knows your plan.',
    icon: 'HeadphonesIcon',
  },
  {
    id: 4,
    title: 'Memorable Experiences',
    description: 'Because a trip should become a story worth remembering long after you\'re back.',
    icon: 'Camera',
  },
];

// ---- Journey Steps ----
export const JOURNEY_STEPS = [
  {
    number: '01',
    title: 'Tell Us Your Plan',
    description: 'Share where you want to go and what kind of trip you have in mind.',
  },
  {
    number: '02',
    title: 'We Plan',
    description: 'We help structure the journey around your requirements and travel style.',
  },
  {
    number: '03',
    title: 'You Get Ready',
    description: 'Confirm your travel details and get ready to explore.',
  },
  {
    number: '04',
    title: 'Start Your Journey',
    description: 'Travel, explore and make memories that last a lifetime.',
  },
];

// ---- Testimonials (PLACEHOLDER — replace with actual Google reviews) ----
export const TESTIMONIALS = [
  {
    id: 1,
    name: 'Traveller from Kolkata',
    location: 'Google Review',
    rating: 5,
    text: 'An absolutely wonderful experience. Everything was planned beautifully — from the accommodation to the sightseeing. Highly recommended for anyone planning a trip to Darjeeling.',
    avatar: 'T',
  },
  {
    id: 2,
    name: 'Family Traveller',
    location: 'Google Review',
    rating: 5,
    text: 'We travelled as a family and the entire trip was very well organized. The attention to detail was impressive. Will definitely book again for our next trip.',
    avatar: 'F',
  },
  {
    id: 3,
    name: 'Couple from West Bengal',
    location: 'Google Review',
    rating: 5,
    text: 'Our Sikkim trip was beyond expectations. The support throughout the journey was excellent. A very trustworthy and professional team.',
    avatar: 'C',
  },
  {
    id: 4,
    name: 'Group of Friends',
    location: 'Google Review',
    rating: 5,
    text: 'We had an amazing time on our Northeast tour. Well planned, good hotels and a responsive team. Bangalir Berano made it stress-free and enjoyable.',
    avatar: 'G',
  },
  {
    id: 5,
    name: 'Traveller',
    location: 'Google Review',
    rating: 5,
    text: 'One of the best travel experiences I have had. The route, the places, the timing — everything was thoughtfully put together. Truly memorable.',
    avatar: 'R',
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
