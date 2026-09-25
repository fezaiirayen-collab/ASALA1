import React from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import ProductImage from "@/components/ProductImage";
import Button, { ButtonLink } from "@/components/Button";

const FavoritesPage: React.FC = () => {
  const { favorites, toggleFavorite, addToCart } = useCart();

  return (
    <div className="bg-white min-h-screen">
      {/* Editorial Header */}
      <section className="border-b border-black/10 bg-[#faf9f6] py-10 lg:py-14 text-center">
        <div className="asala-container">
          <span className="text-[11px] uppercase tracking-[0.2em] text-stone font-medium block mb-2">
            Vos Coups de Cœur
          </span>
          <h1
            className="text-[34px] sm:text-[44px] font-normal uppercase tracking-tight text-black mb-2"
            style={{ fontFamily: '"Bodoni Moda", Georgia, serif' }}
          >
            MES FAVORIS
          </h1>
          <p className="text-[12px] text-stone">
            {favorites.length} création{favorites.length > 1 ? "s" : ""} mémorisée
            {favorites.length > 1 ? "s" : ""}
          </p>
        </div>
      </section>

      <div className="asala-container py-12 lg:py-16">
        {favorites.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20 border border-black/10 bg-[#faf9f6] max-w-lg mx-auto p-8 sm:p-12">
            <Heart size={44} strokeWidth={1} className="mx-auto text-stone mb-5" />
            <h2
              className="text-[26px] font-normal text-black uppercase mb-3"
              style={{ fontFamily: '"Bodoni Moda", Georgia, serif' }}
            >
              VOS FAVORIS
            </h2>
            <p className="text-[14px] text-stone mb-8 leading-relaxed font-normal">
              Vous n'avez encore ajouté aucune pièce à votre liste de favoris. Explorez nos caftans, jebbas et parures.
            </p>
            <ButtonLink to="/collection" variant="primary">
              Découvrir la collection
            </ButtonLink>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
            {favorites.map((product) => (
              <div key={product.id} className="group flex flex-col bg-white">
                {/* Image */}
                <div className="relative aspect-[3/4] overflow-hidden bg-[#f4f2ee] mb-3">
                  <Link to={`/product/${product.id}`} className="block w-full h-full">
                    <ProductImage
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                  </Link>

                  <button
                    onClick={() => toggleFavorite(product)}
                    className="absolute top-3 right-3 p-2 bg-white/90 text-black hover:bg-black hover:text-white transition-colors cursor-pointer"
                    aria-label="Retirer des favoris"
                  >
                    <Trash2 size={15} strokeWidth={1.5} />
                  </button>
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-stone block">
                      {product.category}
                    </span>
                    <Link
                      to={`/product/${product.id}`}
                      className="text-[13px] uppercase font-medium text-black hover:text-stone transition-colors block truncate mt-1"
                    >
                      {product.name}
                    </Link>
                    <span className="text-[13px] font-semibold text-black mt-1 block">
                      {product.price} TND
                    </span>
                  </div>

                  {/* Add to Cart button */}
                  <div className="mt-4 pt-3 border-t border-black/10">
                    <button
                      onClick={() => addToCart(product, 1)}
                      className="w-full asala-btn justify-center text-[10px] py-2.5"
                    >
                      <ShoppingBag size={13} strokeWidth={1.5} />
                      <span>Ajouter au panier</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
