export const slugifyCategory = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const pluralLabels: Record<string, string> = {
  caftan: "Caftans",
  jebba: "Jebbas",
  robe: "Robes",
  accessoire: "Accessoires",
};

export const categoryNavigationLabel = (name: string) => {
  const knownLabel = pluralLabels[name.trim().toLowerCase()];
  if (knownLabel) return knownLabel;
  return /s$/i.test(name.trim()) ? name.trim() : `${name.trim()}s`;
};
