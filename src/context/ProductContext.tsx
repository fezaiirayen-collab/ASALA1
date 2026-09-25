import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Product } from "@/types";
import { products as localProducts } from "@/data/products";
import { supabase } from "@/lib/supabase";
import { slugifyCategory } from "@/lib/categories";

type ProductRow = {
  id: string;
  name: string;
  category: string;
  price: number | string;
  original_price: number | string | null;
  images: string[] | null;
  color_images: Record<string, string[]> | null;
  description: string;
  details: string[] | null;
  fabric: string | null;
  care: string | null;
  sizes: string[] | null;
  colors: string[] | null;
  featured: boolean;
  is_new: boolean;
  in_stock: boolean;
  stock?: number;
};

type ProductContextValue = {
  products: Product[];
  categories: StoreCategory[];
  isLoading: boolean;
  error: string | null;
  isUsingDatabase: boolean;
  refreshProducts: () => Promise<void>;
};

export type StoreCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl?: string;
  sortOrder: number;
};

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number | null;
};

const ProductContext = createContext<ProductContextValue | undefined>(undefined);

const toProduct = (row: ProductRow): Product => ({
  id: row.id,
  name: row.name,
  category: row.category,
  price: Number(row.price),
  originalPrice: row.original_price == null ? undefined : Number(row.original_price),
  images: Array.isArray(row.images) ? row.images : [],
  colorImages: row.color_images && typeof row.color_images === "object" ? row.color_images : {},
  description: row.description || "",
  details: Array.isArray(row.details) ? row.details : [],
  fabric: row.fabric || undefined,
  care: row.care || undefined,
  sizes: Array.isArray(row.sizes) ? row.sizes : [],
  colors: Array.isArray(row.colors) ? row.colors : [],
  featured: Boolean(row.featured),
  new: Boolean(row.is_new),
  stock: Number(row.stock || 0),
  inStock: Boolean(row.in_stock ?? row.stock),
});

const toCategory = (row: CategoryRow): StoreCategory => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  description: row.description || "",
  imageUrl: row.image_url || undefined,
  sortOrder: Number(row.sort_order || 0),
});

const categoriesFromProducts = (items: Product[]): StoreCategory[] => {
  const unique = new Map<string, StoreCategory>();
  items.forEach((product, index) => {
    const name = product.category.trim();
    const slug = slugifyCategory(name);
    if (name && slug && !unique.has(slug)) {
      unique.set(slug, { id: slug, name, slug, description: "", sortOrder: index });
    }
  });
  return [...unique.values()];
};

// La page Promotions doit rester accessible même avant le premier produit soldé.
// La ligne correspondante est aussi créée par supabase/admin-dashboard.sql.
const withPromotionsCategory = (items: StoreCategory[]): StoreCategory[] => {
  if (items.some((category) => category.slug.toLowerCase() === "promotions")) return items;
  return [
    ...items,
    {
      id: "promotions",
      name: "Promotions",
      slug: "promotions",
      description: "Les articles actuellement en promotion.",
      sortOrder: 7,
    },
  ];
};

export const ProductProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(localProducts);
  const [categories, setCategories] = useState<StoreCategory[]>(() => withPromotionsCategory(categoriesFromProducts(localProducts)));
  const [isLoading, setIsLoading] = useState(Boolean(supabase));
  const [error, setError] = useState<string | null>(null);
  const [isUsingDatabase, setIsUsingDatabase] = useState(false);

  const refreshProducts = useCallback(async () => {
    if (!supabase) {
      setIsLoading(false);
      setError("Supabase n'est pas configuré.");
      return;
    }

    setIsLoading(true);
    const [productResult, categoryResult] = await Promise.all([
      supabase
        .from("catalog_products")
        .select("id,name,category,price,original_price,images,color_images,description,details,fabric,care,sizes,colors,featured,is_new,in_stock")
        .order("created_at", { ascending: false }),
      supabase
        .from("categories")
        .select("id,name,slug,description,image_url,sort_order")
        .eq("is_active", true)
        .order("sort_order", { ascending: true }),
    ]);

    const { data, error: queryError } = productResult;

    if (queryError) {
      setError("Le catalogue est temporairement indisponible.");
      setIsUsingDatabase(false);
    } else {
      const databaseProducts = (data || []).map((row) => toProduct(row as ProductRow));
      setProducts(databaseProducts);
      if (!categoryResult.error && categoryResult.data?.length) {
        setCategories(withPromotionsCategory((categoryResult.data as CategoryRow[]).map(toCategory)));
      } else {
        setCategories(withPromotionsCategory(categoriesFromProducts(databaseProducts)));
      }
      setError(null);
      setIsUsingDatabase(true);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    void refreshProducts();
  }, [refreshProducts]);

  useEffect(() => {
    const handleCategoryChange = () => void refreshProducts();
    window.addEventListener("asala:categories-updated", handleCategoryChange);
    return () => window.removeEventListener("asala:categories-updated", handleCategoryChange);
  }, [refreshProducts]);

  const value = useMemo(
    () => ({ products, categories, isLoading, error, isUsingDatabase, refreshProducts }),
    [products, categories, isLoading, error, isUsingDatabase, refreshProducts],
  );

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error("useProducts doit être utilisé dans ProductProvider");
  return context;
};
