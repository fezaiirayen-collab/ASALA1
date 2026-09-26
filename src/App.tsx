// src/App.tsx
import React, { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import router from "@/router";
import { CartProvider } from "@/context/CartContext";
import { ProductProvider } from "@/context/ProductContext";
import { SiteContentProvider } from "@/context/SiteContentContext";

const App: React.FC = () => {
  return (
    <SiteContentProvider>
      <CartProvider>
        <ProductProvider>
          <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-white text-[11px] uppercase tracking-[0.14em] text-stone">Chargement…</div>}>
            <RouterProvider router={router} />
          </Suspense>
        </ProductProvider>
      </CartProvider>
    </SiteContentProvider>
  );
};

export default App;
