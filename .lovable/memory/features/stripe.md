Stripe subscription integration for MuscleLock Pro.

## Products
- Monthly: prod_UBOHmKo8ppnMLB / price_1TD1V1BwmEF0HoQNJ3TBfjEn ($14.99/mo)
- Yearly: prod_UBOIYNHNqFNp7n / price_1TD1W1BwmEF0HoQN8itn7LYE ($99/yr, ~$8.25/mo)

## Free Trials
- Default: 3-day free trial on both plans
- Referral signup: 7-day free trial (checked via profiles.referred_by)
- Returning customers (prior subscription): no trial

## Edge Functions
- create-checkout: Creates Stripe checkout session (accepts priceId), includes trial_period_days
- check-subscription: Verifies active subscription status
- customer-portal: Opens Stripe billing portal
- stripe-webhook: Handles Stripe webhook events

## Config
- src/config/stripe.ts: Price/product IDs + trial config
- AuthContext: isPro, subscriptionEnd, checkSubscription()
- Auto-checks subscription on login and every 60s
