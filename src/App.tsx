// src/App.tsx
import React from "react";
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
          <RouterProvider router={router} />
        </ProductProvider>
      </CartProvider>
    </SiteContentProvider>
  );
};

export default App;
