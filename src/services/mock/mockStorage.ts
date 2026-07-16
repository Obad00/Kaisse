// A tiny in-memory "database" for the MVP. It persists to localStorage so a
// tablet reload doesn't wipe out the day's products/orders, but the shape and
// access pattern here is exactly what will later be replaced by Supabase
// queries — nothing outside /services should ever touch this file directly.

import type { Category, Order, Product, Restaurant } from "../types";
import { seedCategories, seedProducts, seedRestaurants } from "./mockData";

const STORAGE_KEY = "kaisse:mock-db:v2";
const OWNER_PASSWORD = "kaisse-owner-2026";

interface Database {
  restaurants: Restaurant[];
  categories: Category[];
  products: Product[];
  orders: Order[];
  ownerPassword: string;
}

function loadFromDisk(): Database | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Database;
  } catch {
    return null;
  }
}

function seedDatabase(): Database {
  return {
    restaurants: seedRestaurants,
    categories: seedCategories,
    products: seedProducts,
    orders: [],
    ownerPassword: OWNER_PASSWORD,
  };
}

let db: Database = loadFromDisk() ?? seedDatabase();

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch {
    // storage full or unavailable — MVP proceeds with in-memory state only
  }
}

// Simulates network latency so loading states are exercised (and are trivial
// to keep once Supabase calls replace these functions).
function delay<T>(value: T, ms = 120): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function uid(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export const mockDb = {
  uid,
  delay,
  persist,

  getRestaurants(): Restaurant[] {
    return db.restaurants;
  },
  setRestaurants(next: Restaurant[]) {
    db.restaurants = next;
    persist();
  },

  getOwnerPassword(): string {
    return db.ownerPassword;
  },

  getCategories(): Category[] {
    return db.categories;
  },
  setCategories(next: Category[]) {
    db.categories = next;
    persist();
  },

  getProducts(): Product[] {
    return db.products;
  },
  setProducts(next: Product[]) {
    db.products = next;
    persist();
  },

  getOrders(): Order[] {
    return db.orders;
  },
  setOrders(next: Order[]) {
    db.orders = next;
    persist();
  },

  resetToSeed() {
    db = seedDatabase();
    persist();
  },
};
