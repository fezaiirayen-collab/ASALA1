const externalAssetPattern = /^(?:[a-z][a-z\d+.-]*:)?\/\//i;

export const publicAsset = (path: string): string => {
  if (!path || externalAssetPattern.test(path) || /^(data|blob):/i.test(path)) {
    return path;
  }

  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;
};