import { Product } from "@/types";

// Le catalogue est géré dans Supabase. Aucun produit de démonstration local
// n'est chargé lorsque la base de données n'est pas disponible.
export const products: Product[] = [];
