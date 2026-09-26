// src/router.tsx
import React, { useEffect } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import HomePage from "@/pages/HomePage";
import CollectionPage from "@/pages/CollectionPage";
import CategoryPage from "@/pages/CategoryPage";
import ProductPage from "@/pages/ProductPage";
import CartPage from "@/pages/CartPage";
import FavoritesPage from "@/pages/FavoritesPage";
import AccountPage from "@/pages/AccountPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import CheckoutPage from "@/pages/CheckoutPage";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import FaqPage from "@/pages/FaqPage";

const LocalAdminRedirect: React.FC = () => {
  useEffect(() => {
    if (import.meta.env.DEV) window.location.replace("http://localhost:5174/");
  }, []);

  if (!import.meta.env.DEV) return <Navigate to="/" replace />;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f2ee] text-[12px] uppercase tracking-[0.14em] text-stone">
      Ouverture du tableau de bordâ€¦
    </div>
  );
};

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <MainLayout />,
      children: [
      { index: true, element: <HomePage /> },
      { path: "collection", element: <CollectionPage /> },
      { path: "nouveautes", element: <CollectionPage /> },
      { path: "product/:id", element: <ProductPage /> },

      // Cart & Checkout
      { path: "panier", element: <CartPage /> },
      { path: "cart", element: <Navigate to="/panier" replace /> },
      { path: "checkout", element: <CheckoutPage /> },

      // Favorites
      { path: "favoris", element: <FavoritesPage /> },
      { path: "favorites", element: <Navigate to="/favoris" replace /> },

      // Account
      { path: "compte", element: <AccountPage /> },
      { path: "reset-password", element: <ResetPasswordPage /> },
      { path: "reinitialiser-mot-de-passe", element: <ResetPasswordPage /> },
      { path: "account", element: <Navigate to="/compte" replace /> },

      // Categories
      { path: "caftans", element: <CategoryPage category="Caftan" /> },
      { path: "robes", element: <CategoryPage category="Robe" /> },
      { path: "jebbas", element: <CategoryPage category="Jebba" /> },
      { path: "accessoires", element: <CategoryPage category="Accessoire" /> },
      { path: ":categorySlug", element: <CategoryPage /> },

      // Brand pages
      { path: "a-propos", element: <AboutPage /> },
      { path: "about", element: <Navigate to="/a-propos" replace /> },
      { path: "contact", element: <ContactPage /> },
      { path: "faq", element: <FaqPage /> },

      // Raccourci local vers le dashboard de gestion sÃ©parÃ©.
      { path: "vrai-admin", element: <LocalAdminRedirect /> },

      // Fallback
      { path: "*", element: <Navigate to="/" replace /> },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL.replace(/\/$/, "") || "/" },
);

export default router;

