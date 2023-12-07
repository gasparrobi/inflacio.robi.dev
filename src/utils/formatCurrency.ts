export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("hu-HU", {
    style: "currency",
    currency: "HUF",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatCurrencyWithoutSymbol = (amount: number) => {
  return new Intl.NumberFormat("hu-HU", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};
