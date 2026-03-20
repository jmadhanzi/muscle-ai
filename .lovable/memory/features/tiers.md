Free vs Pro feature tier definitions and paywall strategy for MuscleLock.

## Free Tier
- Muscle loss projection (from onboarding)
- Week 1 workout (Day 1 only)
- 3 injection day meals (basic)
- Protein target calculator
- AI Coach — 3 free messages
- Muscle Score (risk score with dramatic reveal)
- Basic injection day reminder
- 1 shareable milestone card

## Pro Tier (Locked)
- Full 10-week progressive workout program
- Unlimited AI Coach
- Full meal library (47 meals)
- Advanced analytics & body composition tracker
- Community challenges
- Custom supplement stack recommendations
- Weekly video check-ins (AI-generated)
- Injection day protocol (full)
- All 12 shareable milestone cards

## Config Location
- Central config: src/config/features.ts
- AI Coach message limit: 3 (AI_COACH_FREE_LIMIT)
- Stripe for payments (to be enabled)
