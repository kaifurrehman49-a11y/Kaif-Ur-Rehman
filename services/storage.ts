import { User, MarketItem, MealShare, ServiceProvider } from '../types';
import { MOCK_USERS, MOCK_ITEMS, MOCK_MEALS, MOCK_SERVICES } from '../constants';

// Keys for LocalStorage - Updated for "Girls" version to reset data
const KEYS = {
  USERS: 'hostelhub_girls_users_v1',
  ITEMS: 'hostelhub_girls_items_v1',
  MEALS: 'hostelhub_girls_meals_v1',
  SERVICES: 'hostelhub_girls_services_v1',
  CURRENT_USER_ID: 'hostelhub_girls_session_v1'
};

// Helper to delay response to simulate network
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

class StorageService {
  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;

    // Seed data if empty
    if (!localStorage.getItem(KEYS.USERS)) {
      // Use MOCK_USERS directly as they now contain auth info
      localStorage.setItem(KEYS.USERS, JSON.stringify(MOCK_USERS));
    }
    if (!localStorage.getItem(KEYS.ITEMS)) {
      const items = MOCK_ITEMS.map(i => ({...i}));
      localStorage.setItem(KEYS.ITEMS, JSON.stringify(items));
    }
    if (!localStorage.getItem(KEYS.MEALS)) {
      const meals = MOCK_MEALS.map(m => ({...m, attendees: []}));
      localStorage.setItem(KEYS.MEALS, JSON.stringify(meals));
    }
    if (!localStorage.getItem(KEYS.SERVICES)) {
      localStorage.setItem(KEYS.SERVICES, JSON.stringify(MOCK_SERVICES));
    }
  }

  // --- Auth ---

  async login(email: string, password: string): Promise<User> {
    await delay(800);
    const users: User[] = JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    
    if (user) {
      localStorage.setItem(KEYS.CURRENT_USER_ID, user.id);
      return user;
    }
    throw new Error('Invalid credentials');
  }

  async register(userData: Omit<User, 'id'>): Promise<User> {
    await delay(800);
    const users: User[] = JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
    
    if (users.find(u => u.email === userData.email)) {
      throw new Error('User already exists');
    }

    const newUser: User = { ...userData, id: `u${Date.now()}` };
    users.push(newUser);
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
    localStorage.setItem(KEYS.CURRENT_USER_ID, newUser.id);
    return newUser;
  }

  async getCurrentUser(): Promise<User | null> {
    const id = localStorage.getItem(KEYS.CURRENT_USER_ID);
    if (!id) return null;
    const users: User[] = JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
    return users.find(u => u.id === id) || null;
  }

  async logout(): Promise<void> {
    localStorage.removeItem(KEYS.CURRENT_USER_ID);
  }

  // --- Users ---
  
  async getUsers(): Promise<User[]> {
    await delay(200);
    return JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
  }

  // --- Marketplace ---

  async getItems(): Promise<MarketItem[]> {
    await delay(300);
    const items = JSON.parse(localStorage.getItem(KEYS.ITEMS) || '[]');
    return items.sort((a: MarketItem, b: MarketItem) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
  }

  async createItem(item: Omit<MarketItem, 'id' | 'postedAt'>): Promise<MarketItem> {
    await delay(500);
    const items: MarketItem[] = JSON.parse(localStorage.getItem(KEYS.ITEMS) || '[]');
    const newItem: MarketItem = {
      ...item,
      id: `i${Date.now()}`,
      postedAt: new Date().toISOString()
    };
    items.unshift(newItem);
    localStorage.setItem(KEYS.ITEMS, JSON.stringify(items));
    return newItem;
  }

  // --- Meals ---

  async getMeals(): Promise<MealShare[]> {
    await delay(300);
    return JSON.parse(localStorage.getItem(KEYS.MEALS) || '[]');
  }

  async createMeal(meal: Omit<MealShare, 'id' | 'slotsTaken' | 'attendees'>): Promise<MealShare> {
    await delay(500);
    const meals: MealShare[] = JSON.parse(localStorage.getItem(KEYS.MEALS) || '[]');
    const newMeal: MealShare = {
      ...meal,
      id: `m${Date.now()}`,
      slotsTaken: 1, // Host takes one slot
      attendees: [meal.hostId] 
    };
    meals.unshift(newMeal);
    localStorage.setItem(KEYS.MEALS, JSON.stringify(meals));
    return newMeal;
  }

  async joinMeal(mealId: string, userId: string): Promise<MealShare> {
    await delay(300);
    const meals: MealShare[] = JSON.parse(localStorage.getItem(KEYS.MEALS) || '[]');
    const index = meals.findIndex(m => m.id === mealId);
    
    if (index === -1) throw new Error('Meal not found');
    
    const meal = meals[index];
    if (meal.slotsTaken >= meal.slotsTotal) throw new Error('Meal is full');
    if (meal.attendees.includes(userId)) throw new Error('Already joined');

    meal.slotsTaken += 1;
    meal.attendees.push(userId);
    meals[index] = meal;
    
    localStorage.setItem(KEYS.MEALS, JSON.stringify(meals));
    return meal;
  }

  // --- Services ---

  async getServices(): Promise<ServiceProvider[]> {
    await delay(200);
    return JSON.parse(localStorage.getItem(KEYS.SERVICES) || '[]');
  }
}

export const db = new StorageService();
