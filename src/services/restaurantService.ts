import type { Restaurant } from "./types";
import { mockDb } from "./mock/mockStorage";

export interface RestaurantService {
  list(): Promise<Restaurant[]>;
  get(id: string): Promise<Restaurant | null>;
  create(input: Omit<Restaurant, "id" | "createdAt">): Promise<Restaurant>;
  update(id: string, patch: Partial<Omit<Restaurant, "id">>): Promise<Restaurant>;
  remove(id: string): Promise<void>;
  verifyPin(id: string, pin: string): Promise<boolean>;
  verifyOwnerPassword(password: string): Promise<boolean>;
}

export const mockRestaurantService: RestaurantService = {
  async list() {
    return mockDb.delay([...mockDb.getRestaurants()]);
  },

  async get(id) {
    const found = mockDb.getRestaurants().find((r) => r.id === id) ?? null;
    return mockDb.delay(found);
  },

  async create(input) {
    const restaurant: Restaurant = {
      id: mockDb.uid("rst"),
      createdAt: new Date().toISOString(),
      ...input,
    };
    mockDb.setRestaurants([...mockDb.getRestaurants(), restaurant]);
    return mockDb.delay(restaurant);
  },

  async update(id, patch) {
    const restaurants = mockDb.getRestaurants();
    const idx = restaurants.findIndex((r) => r.id === id);
    if (idx === -1) throw new Error("Fastfood introuvable");
    const updated = { ...restaurants[idx], ...patch };
    const next = [...restaurants];
    next[idx] = updated;
    mockDb.setRestaurants(next);
    return mockDb.delay(updated);
  },

  async remove(id) {
    mockDb.setRestaurants(mockDb.getRestaurants().filter((r) => r.id !== id));
    return mockDb.delay(undefined);
  },

  async verifyPin(id, pin) {
    const restaurant = mockDb.getRestaurants().find((r) => r.id === id);
    return mockDb.delay(!!restaurant && restaurant.pinCode === pin);
  },

  async verifyOwnerPassword(password) {
    return mockDb.delay(password === mockDb.getOwnerPassword());
  },
};
