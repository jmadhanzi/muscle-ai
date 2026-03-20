Stripe subscription integration for MuscleLock Pro.

## Products
- Monthly: prod_UBOHmKo8ppnMLB / price_1TD1V1BwmEF0HoQNJ3TBfjEn ($14.99/mo)
- Yearly: prod_UBOIYNHNqFNp7n / price_1TD1W1BwmEF0HoQN8itn7LYE ($99.99/yr)

## Edge Functions
- create-checkout: Creates Stripe checkout session (accepts priceId)
- check-subscription: Verifies active subscription status
- customer-portal: Opens Stripe billing portal

## Config
- src/config/stripe.ts: Price/product IDs
- AuthContext: isPro, subscriptionEnd, checkSubscription()
- Auto-checks subscription on login and every 60s
