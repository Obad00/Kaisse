// Domain types — mirror the future Supabase schema so swapping the mock
// implementations for real Supabase calls requires no shape changes.

export interface Branding {
  accentColor: string; // hex, used as the primary accent throughout the UI
  logoUrl?: string | null;
}

export interface Restaurant {
  id: string;
  name: string;
  pinCode: string; // 4-6 digit access code for this fastfood (MVP-only gate)
  address?: string;
  phone?: string;
  currency: string; // e.g. "FCFA"
  receiptFooterNote?: string;
  branding: Branding;
  createdAt: string;
}

export interface Category {
  id: string;
  restaurantId: string;
  name: string;
  sortOrder: number;
}

export interface Product {
  id: string;
  restaurantId: string;
  name: string;
  price: number; // FCFA, integer, no decimals
  categoryId: string;
  imageUrl?: string | null;
  isActive: boolean;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string; // snapshot at time of sale
  quantity: number;
  unitPrice: number; // snapshot at time of sale
}

export type OrderStatus = "completed" | "voided";

export interface Order {
  id: string;
  restaurantId: string;
  createdAt: string; // ISO timestamp
  items: OrderItem[];
  total: number;
  status: OrderStatus;
}

// ---- Cart (client-side only, never persisted as its own entity) ----
export interface CartLine {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
}
