import type { Category } from "./types";
import { mockDb } from "./mock/mockStorage";

export interface CategoryService {
  list(restaurantId: string): Promise<Category[]>;
  create(input: Omit<Category, "id">): Promise<Category>;
  update(id: string, patch: Partial<Omit<Category, "id">>): Promise<Category>;
  remove(id: string): Promise<void>;
}

export const mockCategoryService: CategoryService = {
  async list(restaurantId) {
    const cats = mockDb
      .getCategories()
      .filter((c) => c.restaurantId === restaurantId)
      .sort((a, b) => a.sortOrder - b.sortOrder);
    return mockDb.delay(cats);
  },

  async create(input) {
    const category: Category = { id: mockDb.uid("cat"), ...input };
    mockDb.setCategories([...mockDb.getCategories(), category]);
    return mockDb.delay(category);
  },

  async update(id, patch) {
    const categories = mockDb.getCategories();
    const idx = categories.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error("Categorie introuvable");
    const updated = { ...categories[idx], ...patch };
    const next = [...categories];
    next[idx] = updated;
    mockDb.setCategories(next);
    return mockDb.delay(updated);
  },

  async remove(id) {
    const inUse = mockDb.getProducts().some((p) => p.categoryId === id);
    if (inUse) {
      throw new Error("Impossible de supprimer : des produits utilisent cette categorie.");
    }
    mockDb.setCategories(mockDb.getCategories().filter((c) => c.id !== id));
    return mockDb.delay(undefined);
  },
};
