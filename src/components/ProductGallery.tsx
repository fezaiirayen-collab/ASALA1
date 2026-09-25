import React, { useState } from "react";
import ProductImage from "@/components/ProductImage";

interface Props {
  images: string[];
  name: string;
  isNew?: boolean;
}

const ProductGallery: React.FC<Props> = ({ images, name, isNew }) => {
  const [active, setActive] = useState(0);
  const currentImage = images[active] || images[0] || "/hero-model.jpg";

  return (
    <div className="flex min-w-0 w-full flex-col-reverse gap-4 sm:flex-row sm:gap-5">
      {/* Vertical thumbnails on the left */}
      {images.length > 1 && (
        <div className="flex shrink-0 select-none gap-3 overflow-x-auto no-scrollbar sm:w-20 sm:flex-col sm:gap-3">
          {images.map((image, index) => {
            const isSelected = active === index;
            return (
              <button
                key={`${image}-${index}`}
                onClick={() => setActive(index)}
                aria-label={`Afficher la photographie ${index + 1}`}
                className={`aspect-[3/4] w-16 shrink-0 cursor-pointer overflow-hidden border transition-all sm:w-full ${
                  isSelected
                    ? "border-black opacity-100"
                    : "border-black/15 opacity-55 hover:opacity-100"
                }`}
              >
                <ProductImage
                  src={image}
                  alt={`${name} miniature ${index + 1}`}
                  className="!h-full !w-full object-cover object-center"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Main large image */}
      <div className="relative min-w-0 w-full flex-1 aspect-[3/4] overflow-hidden bg-[#f4f2ee] select-none sm:max-w-[520px]">
        <ProductImage
          src={currentImage}
          alt={name}
          loading="eager"
          className="!h-full !w-full object-cover object-center transition-all duration-300"
        />
        {isNew && (
          <span className="absolute top-4 left-4 bg-black text-white px-3 py-1.5 text-[9px] uppercase tracking-[0.16em] font-medium select-none">
            Nouveau
          </span>
        )}
      </div>
    </div>
  );
};

export default ProductGallery;
