// Stripe product and price IDs for MuscleLock Pro

export const STRIPE_CONFIG = {
  monthly: {
    product_id: "prod_UBOHmKo8ppnMLB",
    price_id: "price_1TD1V1BwmEF0HoQNJ3TBfjEn",
    price: 14.99,
    label: "Monthly",
  },
  yearly: {
    product_id: "prod_UBOIYNHNqFNp7n",
    price_id: "price_1TD1W1BwmEF0HoQN8itn7LYE",
    price: 99,
    monthly_equivalent: 8.25,
    label: "Yearly",
  },
  trial: {
    default_days: 3,
    referral_days: 7,
  },
} as const;

// All pro product IDs for subscription check
export const PRO_PRODUCT_IDS = [
  STRIPE_CONFIG.monthly.product_id,
  STRIPE_CONFIG.yearly.product_id,
];
