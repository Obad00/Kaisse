import { BrowserRouter, Routes, Route } from "react-router-dom";
import { POSLayout } from "@/components/layout/POSLayout";
import { RequireRestaurant } from "./RequireRestaurant";
import { POSPage } from "@/pages/POSPage";
import { HistoryPage } from "@/pages/HistoryPage";
import { RestaurantSelectPage } from "@/pages/RestaurantSelectPage";
import { AdminProductsPage } from "@/pages/admin/AdminProductsPage";
import { AdminCategoriesPage } from "@/pages/admin/AdminCategoriesPage";
import { AdminSettingsPage } from "@/pages/admin/AdminSettingsPage";
import { OwnerLoginPage } from "@/pages/owner/OwnerLoginPage";
import { OwnerDashboardPage } from "@/pages/owner/OwnerDashboardPage";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/select" element={<RestaurantSelectPage />} />

        <Route
          path="/owner"
          element={
            <OwnerLoginPage>
              <OwnerDashboardPage />
            </OwnerLoginPage>
          }
        />

        <Route
          path="/*"
          element={
            <RequireRestaurant>
              <POSLayout>
                <Routes>
                  <Route path="/" element={<POSPage />} />
                  <Route path="/history" element={<HistoryPage />} />
                  <Route path="/admin/products" element={<AdminProductsPage />} />
                  <Route path="/admin/categories" element={<AdminCategoriesPage />} />
                  <Route path="/admin/settings" element={<AdminSettingsPage />} />
                </Routes>
              </POSLayout>
            </RequireRestaurant>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
