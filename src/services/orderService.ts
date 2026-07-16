import type { CartLine, Order, OrderItem } from "./types";
import { mockDb } from "./mock/mockStorage";

export interface OrderService {
  list(restaurantId: string): Promise<Order[]>;
  create(restaurantId: string, lines: CartLine[]): Promise<Order>;
  listByDay(restaurantId: string, isoDate: string): Promise<Order[]>;
}

function buildOrder(restaurantId: string, lines: CartLine[]): Order {
  const orderId = mockDb.uid("ord");
  const items: OrderItem[] = lines.map((line) => ({
    id: mockDb.uid("item"),
    orderId,
    productId: line.productId,
    productName: line.productName,
    quantity: line.quantity,
    unitPrice: line.unitPrice,
  }));
  const total = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

  return {
    id: orderId,
    restaurantId,
    createdAt: new Date().toISOString(),
    items,
    total,
    status: "completed",
  };
}

export const mockOrderService: OrderService = {
  async list(restaurantId) {
    const orders = mockDb
      .getOrders()
      .filter((o) => o.restaurantId === restaurantId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return mockDb.delay(orders);
  },

  async create(restaurantId, lines) {
    if (lines.length === 0) throw new Error("Le panier est vide");
    const order = buildOrder(restaurantId, lines);
    mockDb.setOrders([...mockDb.getOrders(), order]);
    return mockDb.delay(order);
  },

  async listByDay(restaurantId, isoDate) {
    const all = await this.list(restaurantId);
    return all.filter((o) => o.createdAt.slice(0, 10) === isoDate);
  },
};
