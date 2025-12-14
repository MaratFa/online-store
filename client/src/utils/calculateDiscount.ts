
export function calculateDiscount(originalPrice: number, discountPrice: number): number {
  if (originalPrice <= 0 || discountPrice < 0) {
    return 0;
  }

  if (discountPrice >= originalPrice) {
    return 0;
  }

  return Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
}

export function applyDiscount(originalPrice: number, discountPercentage: number): number {
  if (originalPrice <= 0 || discountPercentage < 0 || discountPercentage > 100) {
    return originalPrice;
  }

  return Math.round((originalPrice * (100 - discountPercentage)) / 100 * 100) / 100;
}
