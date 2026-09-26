const externalAssetPattern = /^(?:[a-z][a-z\d+.-]*:)?\/\//i;

// Les visuels intégrés au site sont servis en WebP sur GitHub Pages.
// Les anciennes valeurs enregistrées dans Supabase (en .png) restent compatibles.
const optimizedLocalAssets: Record<string, string> = {
  "accessoires-banner.png": "accessoires-banner.webp",
  "caftans-banner.png": "caftans-banner.webp",
  "collection-banner.png": "collection-banner.webp",
  "home-jebbas.png": "home-jebbas.webp",
  "jebbas-banner.png": "jebbas-banner.webp",
  "nouveautes-banner.png": "nouveautes-banner.webp",
  "occasion-jebba-banner.png": "occasion-jebba-banner.webp",
  "robes-banner.png": "robes-banner.webp",
  "hero-slide-01.png": "hero-slide-01.webp",
  "hero-slide-02.png": "hero-slide-02.webp",
  "hero-slide-03.png": "hero-slide-03.webp",
};

export const publicAsset = (path: string): string => {
  if (!path || externalAssetPattern.test(path) || /^(data|blob):/i.test(path)) {
    return path;
  }

  const normalizedPath = path.replace(/^\/+/, "");
  const assetName = normalizedPath.split("/").pop() || normalizedPath;
  const optimizedName = optimizedLocalAssets[assetName];
  const resolvedPath = optimizedName
    ? normalizedPath.slice(0, -assetName.length) + optimizedName
    : normalizedPath;

  return `${import.meta.env.BASE_URL}${resolvedPath}`;
};
