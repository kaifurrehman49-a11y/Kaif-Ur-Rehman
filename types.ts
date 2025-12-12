export enum AppView {
  HOME = 'HOME',
  ROOMMATES = 'ROOMMATES',
  MARKETPLACE = 'MARKETPLACE',
  MEALS = 'MEALS',
  SERVICES = 'SERVICES'
}

export interface User {
  id: string;
  name: string;
  email: string; // Added for auth
  password?: string; // Added for auth (stored locally for prototype)
  university: string;
  degree: string;
  year: string;
  bio: string;
  habits: string[];
  avatar: string;
  lookingForRoommate: boolean;
}

export interface MarketItem {
  id: string;
  sellerId: string;
  sellerName: string;
  title: string;
  description: string;
  price: number;
  category: 'Books' | 'Electronics' | 'Furniture' | 'Clothing' | 'Other';
  image: string;
  location: string;
  postedAt: string; // Changed to string for serialization
}

export interface MealShare {
  id: string;
  hostId: string; // Added to link to user
  hostName: string;
  dish: string;
  description: string;
  pricePerPerson: number;
  slotsTotal: number;
  slotsTaken: number;
  attendees: string[]; // Array of User IDs
  time: string;
  location: string;
}

export interface ServiceProvider {
  id: string;
  name: string;
  type: 'Laundry' | 'Food' | 'Stationery' | 'Repair' | 'Transport';
  rating: number;
  location: string;
  contact: string;
  description: string;
  isOpen: boolean;
}

export interface GeminiResponse {
  text: string;
}
