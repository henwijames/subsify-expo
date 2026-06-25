import dayjs from "dayjs";

/**
 * Formats a numeric value into a currency format.
 * Defaults to standard UAE dirhams (AED) with exactly two decimal places.
 *
 * @param value The numeric value to format
 * @param currency The ISO currency code (defaults to 'AED')
 * @returns Formatted currency string
 */
export function formatCurrency(
  value: number,
  currency: string = "AED",
): string {
  try {
    return new Intl.NumberFormat("en-AE", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch (error) {
    // Fallback formatting if Intl.NumberFormat fails or invalid currency code is provided
    const numericValue = typeof value === "number" && !isNaN(value) ? value : 0;
    return `${currency} ${numericValue.toFixed(2)}`;
  }
}

export const formatSubscriptionDateTime = (value?: string): string => {
  if (!value) return "Not provided";
  const parsedDate = dayjs(value);
  return parsedDate.isValid()
    ? parsedDate.format("MM/DD/YYYY")
    : "Not provided";
};

export const formatStatusLabel = (value?: string): string => {
  if (!value) return "Unknown";
  return value.charAt(0).toUpperCase() + value.slice(1);
};
