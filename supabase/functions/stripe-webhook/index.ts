import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const logStep = (step: string, details?: any) => {
  const d = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[STRIPE-WEBHOOK] ${step}${d}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (!stripeKey) {
    return new Response(JSON.stringify({ error: "Stripe not configured" }), { status: 500 });
  }

  const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    const body = await req.text();
    let event: Stripe.Event;

    if (webhookSecret) {
      const sig = req.headers.get("stripe-signature");
      if (!sig) throw new Error("Missing stripe-signature header");
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } else {
      // Fallback: parse without signature verification (dev mode)
      event = JSON.parse(body) as Stripe.Event;
    }

    logStep("Event received", { type: event.type, id: event.id });

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerEmail = session.customer_details?.email || session.customer_email;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;

        if (!customerEmail) {
          logStep("No email on checkout session");
          break;
        }

        logStep("Checkout completed", { email: customerEmail, customerId });

        // Look up user by email via auth
        const { data: users } = await supabase.auth.admin.listUsers();
        const user = users?.users?.find((u) => u.email === customerEmail);

        if (!user) {
          logStep("No matching user found for email", { email: customerEmail });
          break;
        }

        // Get subscription details for end date
        let subscriptionEnd: string | null = null;
        if (subscriptionId) {
          const sub = await stripe.subscriptions.retrieve(subscriptionId);
          subscriptionEnd = new Date(sub.current_period_end * 1000).toISOString();
        }

        await supabase
          .from("profiles")
          .update({
            subscription_status: "pro",
            stripe_customer_id: customerId,
            subscription_end_date: subscriptionEnd,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", user.id);

        logStep("Profile updated to pro", { userId: user.id });
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        logStep("Subscription deleted", { customerId });

        // Find profile by stripe_customer_id
        const { data: profile } = await supabase
          .from("profiles")
          .select("user_id")
          .eq("stripe_customer_id", customerId)
          .single();

        if (profile) {
          await supabase
            .from("profiles")
            .update({
              subscription_status: "free",
              subscription_end_date: null,
              updated_at: new Date().toISOString(),
            })
            .eq("user_id", profile.user_id);

          logStep("Profile downgraded to free", { userId: profile.user_id });
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const status = subscription.status;

        const { data: profile } = await supabase
          .from("profiles")
          .select("user_id")
          .eq("stripe_customer_id", customerId)
          .single();

        if (profile) {
          const isActive = status === "active" || status === "trialing";
          await supabase
            .from("profiles")
            .update({
              subscription_status: isActive ? "pro" : "free",
              subscription_end_date: isActive
                ? new Date(subscription.current_period_end * 1000).toISOString()
                : null,
              updated_at: new Date().toISOString(),
            })
            .eq("user_id", profile.user_id);

          logStep("Subscription updated", { userId: profile.user_id, status });
        }
        break;
      }

      default:
        logStep("Unhandled event type", { type: event.type });
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("stripe-webhook error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
