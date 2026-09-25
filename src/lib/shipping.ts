export const DEFAULT_SHIPPING_FEE = 7;

export const parseShippingFee = (value?: string) => {
  const amount = Number.parseFloat((value || "").replace(/\s/g, "").replace(",", "."));
  return Number.isFinite(amount) && amount >= 0 ? amount : DEFAULT_SHIPPING_FEE;
};

export const parseFreeShippingThreshold = (announcement?: string) => {
  const match = (announcement || "").match(/(?:à|a)\s*partir\s*de\s*([\d\s.,]+)/i);
  if (!match) return null;

  const threshold = Number.parseFloat(match[1].replace(/\s/g, "").replace(",", "."));
  return Number.isFinite(threshold) && threshold >= 0 ? threshold : null;
};

export const parseConfiguredFreeShippingThreshold = (value?: string) => {
  const threshold = Number.parseFloat((value || "").replace(/\s/g, "").replace(",", "."));
  return Number.isFinite(threshold) && threshold >= 0 ? threshold : null;
};

export const calculateShippingFee = ({
  subtotal,
  cartIsEmpty,
  announcement,
  shippingFee,
  freeShippingThreshold,
}: {
  subtotal: number;
  cartIsEmpty: boolean;
  announcement?: string;
  shippingFee?: string;
  freeShippingThreshold?: string;
}) => {
  if (cartIsEmpty) return 0;

  const threshold = parseConfiguredFreeShippingThreshold(freeShippingThreshold) ?? parseFreeShippingThreshold(announcement);
  if (threshold !== null && subtotal >= threshold) return 0;

  return parseShippingFee(shippingFee);
};
