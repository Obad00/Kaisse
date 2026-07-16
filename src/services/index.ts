// ---------------------------------------------------------------------------
// Single point of truth for which implementation of each service is active.
//
// TODO(Supabase): once the backend is ready, create supabase/*.ts files
// implementing the same interfaces and swap the exports here. No component
// or hook anywhere in the app imports the mock/* files directly.
// ---------------------------------------------------------------------------

import { mockRestaurantService } from "./restaurantService";
import { mockProductService } from "./productService";
import { mockCategoryService } from "./categoryService";
import { mockOrderService } from "./orderService";

export const restaurantService = mockRestaurantService;
export const productService = mockProductService;
export const categoryService = mockCategoryService;
export const orderService = mockOrderService;

export type { Restaurant, Branding, Product, Category, Order, OrderItem, CartLine } from "./types";
