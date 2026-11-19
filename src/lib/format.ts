export function formatPrice(price: number) {
  return `৳${price.toLocaleString("en-US")}`;
}

export function formatDate(value: string | Date) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}