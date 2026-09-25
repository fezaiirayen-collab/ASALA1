// src/components/ProductGrid.tsx
import React from "react";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types";

interface Props {
  products: Product[];
  columns?: 2 | 3 | 4;
}

const ProductGrid: React.FC<Props> = ({ products, columns = 4 }) => {
  const colClass =
    columns === 2
      ? "grid-cols-1 min-[360px]:grid-cols-2 md:grid-cols-2"
      : columns === 3
      ? "grid-cols-1 min-[360px]:grid-cols-2 md:grid-cols-3"
      : "grid-cols-1 min-[360px]:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";

  return (
    <div className={`grid ${colClass} gap-x-3.5 min-[360px]:gap-x-4 sm:gap-x-5 lg:gap-x-6 gap-y-8 sm:gap-y-10 lg:gap-y-14`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;