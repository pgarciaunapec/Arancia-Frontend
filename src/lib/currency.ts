const dopFormatter = new Intl.NumberFormat("es-DO", {
  style: "currency",
  currency: "DOP",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const formatCurrencyDOP = (amount: number): string =>
  dopFormatter.format(Number.isFinite(amount) ? amount : 0);
