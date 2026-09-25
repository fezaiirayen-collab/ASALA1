-- Ajoute les photos spécifiques à chaque couleur d'un produit.
-- Exemple de valeur JSONB :
-- {"Beige": ["https://.../beige-1.jpg"], "Rouge": ["https://.../rouge-1.jpg"]}

alter table public.products
  add column if not exists color_images jsonb not null default '{}'::jsonb;
