import type { Product } from "./types";
import { mockDb } from "./mock/mockStorage";

export interface ProductService {
  list(restaurantId: string): Promise<Product[]>;
  create(input: Omit<Product, "id">): Promise<Product>;
  update(id: string, patch: Partial<Omit<Product, "id">>): Promise<Product>;
  remove(id: string): Promise<void>;
}

export const mockProductService: ProductService = {
  async list(restaurantId) {
    return mockDb.delay(mockDb.getProducts().filter((p) => p.restaurantId === restaurantId));
  },

  async create(input) {
    const product: Product = { id: mockDb.uid("prd"), ...input };
    mockDb.setProducts([...mockDb.getProducts(), product]);
    return mockDb.delay(product);
  },

  async update(id, patch) {
    const products = mockDb.getProducts();
    const idx = products.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error("Produit introuvable");
    const updated = { ...products[idx], ...patch };
    const next = [...products];
    next[idx] = updated;
    mockDb.setProducts(next);
    return mockDb.delay(updated);
  },

  async remove(id) {
    mockDb.setProducts(mockDb.getProducts().filter((p) => p.id !== id));
    return mockDb.delay(undefined);
  },
};
