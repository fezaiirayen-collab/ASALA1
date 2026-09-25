// src/layouts/MainLayout.tsx
import React from "react";
import { Outlet, ScrollRestoration } from "react-router-dom";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchOverlay from "@/components/SearchOverlay";
import CartDrawer from "@/components/CartDrawer";
import QuickViewModal from "@/components/QuickViewModal";
import SizeGuideModal from "@/components/SizeGuideModal";

const MainLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white text-black selection:bg-black selection:text-white">
      <ScrollRestoration />

      {/* Top announcement bar */}
      <TopBar />

      {/* Main sticky header */}
      <Header />

      {/* Page content */}
      <main className="flex-1 bg-white">
        <Outlet />
      </main>

      {/* 5-column editorial footer */}
      <Footer />

      {/* Global interactive drawers & modals */}
      <SearchOverlay />
      <CartDrawer />
      <QuickViewModal />
      <SizeGuideModal />
    </div>
  );
};

export default MainLayout;
