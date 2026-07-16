import type { Category, Product, Restaurant } from "../types";

export const seedRestaurants: Restaurant[] = [
  {
    id: "rst_chez_kaisse",
    name: "Chez Kaisse",
    pinCode: "1234",
    address: "Dakar, Senegal",
    phone: "77 000 00 00",
    currency: "FCFA",
    receiptFooterNote: "Merci de votre visite !",
    branding: { accentColor: "#3D5AFB", logoUrl: null },
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "rst_ndogou_express",
    name: "Ndogou Express",
    pinCode: "5678",
    address: "Sacre-Coeur, Dakar",
    phone: "78 111 11 11",
    currency: "FCFA",
    receiptFooterNote: "A bientot !",
    branding: { accentColor: "#E8752E", logoUrl: null },
    createdAt: "2026-01-02T00:00:00.000Z",
  },
];

export const seedCategories: Category[] = [
  { id: "cat_burgers", restaurantId: "rst_chez_kaisse", name: "Burgers", sortOrder: 0 },
  { id: "cat_boissons", restaurantId: "rst_chez_kaisse", name: "Boissons", sortOrder: 1 },
  { id: "cat_accompagnements", restaurantId: "rst_chez_kaisse", name: "Accompagnements", sortOrder: 2 },
  { id: "cat_desserts", restaurantId: "rst_chez_kaisse", name: "Desserts", sortOrder: 3 },

  { id: "cat_ne_plats", restaurantId: "rst_ndogou_express", name: "Plats", sortOrder: 0 },
  { id: "cat_ne_boissons", restaurantId: "rst_ndogou_express", name: "Boissons", sortOrder: 1 },
];

export const seedProducts: Product[] = [
  { id: "prd_classic", restaurantId: "rst_chez_kaisse", name: "Classic Burger", price: 2500, categoryId: "cat_burgers", imageUrl: null, isActive: true },
  { id: "prd_cheese", restaurantId: "rst_chez_kaisse", name: "Cheese Burger", price: 2800, categoryId: "cat_burgers", imageUrl: null, isActive: true },
  { id: "prd_double", restaurantId: "rst_chez_kaisse", name: "Double Beef", price: 3500, categoryId: "cat_burgers", imageUrl: null, isActive: true },
  { id: "prd_chicken", restaurantId: "rst_chez_kaisse", name: "Chicken Burger", price: 2700, categoryId: "cat_burgers", imageUrl: null, isActive: true },
  { id: "prd_fish", restaurantId: "rst_chez_kaisse", name: "Fish Burger", price: 2900, categoryId: "cat_burgers", imageUrl: null, isActive: true },

  { id: "prd_coca", restaurantId: "rst_chez_kaisse", name: "Coca-Cola 33cl", price: 700, categoryId: "cat_boissons", imageUrl: null, isActive: true },
  { id: "prd_fanta", restaurantId: "rst_chez_kaisse", name: "Fanta 33cl", price: 700, categoryId: "cat_boissons", imageUrl: null, isActive: true },
  { id: "prd_eau", restaurantId: "rst_chez_kaisse", name: "Eau minerale", price: 500, categoryId: "cat_boissons", imageUrl: null, isActive: true },
  { id: "prd_jus_bissap", restaurantId: "rst_chez_kaisse", name: "Jus Bissap", price: 1000, categoryId: "cat_boissons", imageUrl: null, isActive: true },
  { id: "prd_jus_bouye", restaurantId: "rst_chez_kaisse", name: "Jus Bouye", price: 1000, categoryId: "cat_boissons", imageUrl: null, isActive: true },

  { id: "prd_frites_p", restaurantId: "rst_chez_kaisse", name: "Frites (Petit)", price: 1000, categoryId: "cat_accompagnements", imageUrl: null, isActive: true },
  { id: "prd_frites_g", restaurantId: "rst_chez_kaisse", name: "Frites (Grand)", price: 1500, categoryId: "cat_accompagnements", imageUrl: null, isActive: true },
  { id: "prd_onion_rings", restaurantId: "rst_chez_kaisse", name: "Onion Rings", price: 1500, categoryId: "cat_accompagnements", imageUrl: null, isActive: true },
  { id: "prd_nuggets", restaurantId: "rst_chez_kaisse", name: "Nuggets x6", price: 2000, categoryId: "cat_accompagnements", imageUrl: null, isActive: true },

  { id: "prd_glace", restaurantId: "rst_chez_kaisse", name: "Glace (2 boules)", price: 1200, categoryId: "cat_desserts", imageUrl: null, isActive: true },
  { id: "prd_donut", restaurantId: "rst_chez_kaisse", name: "Donut", price: 800, categoryId: "cat_desserts", imageUrl: null, isActive: true },
  { id: "prd_brownie", restaurantId: "rst_chez_kaisse", name: "Brownie", price: 1000, categoryId: "cat_desserts", imageUrl: null, isActive: true },

  { id: "prd_ne_thieb", restaurantId: "rst_ndogou_express", name: "Thieboudienne", price: 2000, categoryId: "cat_ne_plats", imageUrl: null, isActive: true },
  { id: "prd_ne_yassa", restaurantId: "rst_ndogou_express", name: "Poulet Yassa", price: 2200, categoryId: "cat_ne_plats", imageUrl: null, isActive: true },
  { id: "prd_ne_mafe", restaurantId: "rst_ndogou_express", name: "Mafe", price: 2000, categoryId: "cat_ne_plats", imageUrl: null, isActive: true },
  { id: "prd_ne_bissap", restaurantId: "rst_ndogou_express", name: "Bissap", price: 500, categoryId: "cat_ne_boissons", imageUrl: null, isActive: true },
  { id: "prd_ne_gingembre", restaurantId: "rst_ndogou_express", name: "Jus Gingembre", price: 500, categoryId: "cat_ne_boissons", imageUrl: null, isActive: true },
];
