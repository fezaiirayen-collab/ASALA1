import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, UserRound, Heart, ShoppingBag, Menu } from "lucide-react";
import Logo from "./Logo";
import MobileMenu from "./MobileMenu";
import { useCart } from "@/context/CartContext";
import { useProducts } from "@/context/ProductContext";
import { categoryNavigationLabel, slugifyCategory } from "@/lib/categories";

const fixedNavLinks = [
  { label: "Nouveautés", href: "/nouveautes" },
  { label: "Collection", href: "/collection" },
];

const Header: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { cartCount, favorites, openCart, openSearch } = useCart();
  const { categories, products } = useProducts();
  const location = useLocation();

  const visibleCategories = categories.filter((category) => {
    if (category.slug.toLowerCase() !== "promotions") return true;
    return products.some((product) => product.category.toLowerCase() === "promotions");
  });

  const navLinks = [
    ...fixedNavLinks,
    ...visibleCategories.map((category) => ({
      label: categoryNavigationLabel(category.name),
      href: `/${category.slug || slugifyCategory(category.name)}`,
    })),
  ];

  const favCount = favorites.length;

  const isActive = (path: string) => {
    if (path === "/collection" && location.pathname === "/collection" && !location.search) {
      return true;
    }
    return location.pathname === path;
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-black/10">
        <div className="asala-container flex items-center justify-between h-16 sm:h-20 lg:h-[90px]">
          {/* Mobile menu trigger + Logo */}
          <div className="flex items-center gap-1.5 sm:gap-3 lg:hidden shrink-0">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 -ml-2 text-black hover:opacity-60 transition-opacity min-w-[38px] min-h-[38px] flex items-center justify-center cursor-pointer"
              aria-label="Ouvrir le menu de navigation"
            >
              <Menu size={22} strokeWidth={1.5} />
            </button>
            <Logo size="sm" />
          </div>

          {/* Desktop Logo with hairline separator */}
          <div className="hidden lg:flex items-center gap-8 shrink-0">
            <Logo size="md" />
            <div className="h-9 w-px bg-black/15" />
          </div>

          {/* Desktop Central Navigation */}
          <nav className="hidden lg:flex items-center justify-center gap-6 xl:gap-8 flex-1 px-4">
            {navLinks.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`text-[11px] xl:text-[12px] uppercase tracking-[0.14em] whitespace-nowrap transition-colors relative py-2 ${
                    active
                      ? "text-black font-semibold"
                      : "text-black/80 hover:text-black font-normal"
                  }`}
                >
                  {item.label}
                  {active && (
                    <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-black" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Hairline separator before actions (desktop) */}
          <div className="hidden lg:block h-9 w-px bg-black/15 shrink-0 mr-6" />

          {/* Right Action Icons */}
          <div className="flex items-center gap-1 sm:gap-3 lg:gap-6 shrink-0">
            {/* Search Button with clean trigger */}
            <button
              onClick={openSearch}
              className="p-1.5 sm:p-2 flex items-center gap-2 group cursor-pointer text-black hover:opacity-60 transition-opacity min-w-[36px] min-h-[36px] justify-center"
              aria-label="Rechercher sur la boutique"
            >
              <Search size={18} strokeWidth={1.5} className="sm:w-[19px] sm:h-[19px]" />
              <span className="hidden xl:inline text-[11px] uppercase tracking-[0.12em] border-b border-black/30 pb-0.5 text-stone group-hover:border-black group-hover:text-black transition-colors">
                Rechercher
              </span>
            </button>

            {/* User Account */}
            <Link
              to="/compte"
              aria-label="Mon compte"
              className="p-1.5 sm:p-2 text-black hover:opacity-60 transition-opacity min-w-[36px] min-h-[36px] flex items-center justify-center cursor-pointer"
            >
              <UserRound size={18} strokeWidth={1.5} className="sm:w-[19px] sm:h-[19px]" />
            </Link>

            {/* Favorites */}
            <Link
              to="/favoris"
              aria-label={`Mes favoris (${favCount})`}
              className="relative p-1.5 sm:p-2 text-black hover:opacity-60 transition-opacity min-w-[36px] min-h-[36px] flex items-center justify-center cursor-pointer"
            >
              <Heart
                size={18}
                strokeWidth={1.5}
                className={`sm:w-[19px] sm:h-[19px] ${favCount > 0 ? "fill-black" : ""}`}
              />
              {favCount > 0 && (
                <span className="absolute 0 top-0.5 right-0.5 sm:-top-1 sm:-right-1 min-w-[14px] h-[14px] sm:min-w-[15px] sm:h-[15px] px-0.5 sm:px-1 bg-black text-white text-[8px] sm:text-[9px] font-medium leading-[14px] sm:leading-[15px] text-center">
                  {favCount}
                </span>
              )}
            </Link>

            {/* Cart Drawer Trigger */}
            <button
              onClick={openCart}
              aria-label={`Mon panier (${cartCount})`}
              className="relative p-1.5 sm:p-2 text-black hover:opacity-60 transition-opacity min-w-[36px] min-h-[36px] flex items-center justify-center cursor-pointer"
            >
              <ShoppingBag size={18} strokeWidth={1.5} className="sm:w-[19px] sm:h-[19px]" />
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 sm:-top-1 sm:-right-1 min-w-[14px] h-[14px] sm:min-w-[15px] sm:h-[15px] px-0.5 sm:px-1 bg-black text-white text-[8px] sm:text-[9px] font-medium leading-[14px] sm:leading-[15px] text-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileMenu
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        links={navLinks}
      />
    </>
  );
};

export default Header;
