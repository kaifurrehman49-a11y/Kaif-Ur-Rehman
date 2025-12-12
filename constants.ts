import { MarketItem, MealShare, ServiceProvider, User } from "./types";

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Ayesha Khan',
    university: 'LUMS',
    degree: 'Psychology',
    year: 'Junior',
    bio: 'Loves reading and herbal tea. Looking for a quiet and clean roommate.',
    habits: ['Early riser', 'Non-smoker', 'Quiet'],
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ayesha&hair=long01',
    lookingForRoommate: true,
    email: 'ayesha@example.com',
    password: 'password'
  },
  {
    id: 'u2',
    name: 'Fatima Ahmed',
    university: 'NCA',
    degree: 'Architecture',
    year: 'Senior',
    bio: 'Creative mess but organized chaos. Love painting and music.',
    habits: ['Night owl', 'Social', 'Artistic'],
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima&hair=long02',
    lookingForRoommate: true,
    email: 'fatima@example.com',
    password: 'password'
  },
  {
    id: 'u3',
    name: 'Bisma Sheikh',
    university: 'Punjab University',
    degree: 'Economics',
    year: 'Sophomore',
    bio: 'Foodie and fashion lover. Always up for a shopping trip.',
    habits: ['Social', 'Shopaholic', 'Organized'],
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bisma&hair=long03',
    lookingForRoommate: true,
    email: 'bisma@example.com',
    password: 'password'
  },
  {
    id: 'u4',
    name: 'Zainab Raza',
    university: 'Kinnaird College',
    degree: 'English Lit',
    year: 'Freshman',
    bio: 'New in Lahore. Looking for a safe and friendly sisterhood.',
    habits: ['Quiet', 'Reader', 'Tea lover'],
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zainab&hair=hijab01',
    lookingForRoommate: true,
    email: 'zainab@example.com',
    password: 'password'
  }
];

export const MOCK_ITEMS: MarketItem[] = [
  {
    id: 'i1',
    sellerId: 'u2',
    sellerName: 'Fatima Ahmed',
    title: 'Architecture Drafting Table',
    description: 'Slightly used drafting table, perfect for architecture students. Pink trim.',
    price: 5000,
    category: 'Furniture',
    image: 'https://picsum.photos/seed/drafting/300/200',
    location: 'Johar Town',
    postedAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'i2',
    sellerId: 'u1',
    sellerName: 'Ayesha Khan',
    title: 'Psychology 101 Textbook',
    description: 'Original edition, no markings. Helpful notes included.',
    price: 1500,
    category: 'Books',
    image: 'https://picsum.photos/seed/psychbook/300/200',
    location: 'DHA Phase 5',
    postedAt: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: 'i3',
    sellerId: 'u3',
    sellerName: 'Bisma Sheikh',
    title: 'Hair Straightener (Remington)',
    description: 'Used twice, excellent condition. Moving out sale.',
    price: 3000,
    category: 'Electronics',
    image: 'https://picsum.photos/seed/straightener/300/200',
    location: 'Old Campus',
    postedAt: new Date(Date.now() - 43200000).toISOString()
  }
];

export const MOCK_MEALS: MealShare[] = [
  {
    id: 'm1',
    hostId: 'u4',
    hostName: 'Chef Hina',
    dish: 'Chicken Biryani Special',
    description: 'Cooking a large pot of homemade biryani. Girls night in!',
    pricePerPerson: 350,
    slotsTotal: 5,
    slotsTaken: 2,
    attendees: [],
    time: '8:00 PM Today',
    location: 'Girls Hostel A, Room 102'
  },
  {
    id: 'm2',
    hostId: 'u2',
    hostName: 'Sarah & Friends',
    dish: 'Pizza Party Group Order',
    description: 'Ordering from Cheezious. Splitting delivery and bulk discount.',
    pricePerPerson: 500,
    slotsTotal: 4,
    slotsTaken: 1,
    attendees: [],
    time: '7:30 PM Today',
    location: 'Common Room'
  }
];

export const MOCK_SERVICES: ServiceProvider[] = [
  {
    id: 's1',
    name: 'Sparkle Laundry (Ladies Only)',
    type: 'Laundry',
    rating: 4.8,
    location: 'Main Market, Johar Town',
    contact: '0300-1234567',
    description: 'Female staff. Pick and drop available for girls hostels.',
    isOpen: true
  },
  {
    id: 's2',
    name: 'Pink Stationers',
    type: 'Stationery',
    rating: 4.5,
    location: 'Near KC Gate',
    contact: '0321-7654321',
    description: 'Printing, binding, and art supplies.',
    isOpen: true
  },
  {
    id: 's3',
    name: 'Mama\'s Kitchen Tiffin',
    type: 'Food',
    rating: 4.9,
    location: 'Wapda Town',
    contact: '0333-9876543',
    description: 'Home-cooked hygienic food. Female run kitchen.',
    isOpen: false
  }
];
