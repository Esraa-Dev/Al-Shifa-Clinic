import Stripe from "stripe";
import { ApiError } from "./ApiError";

let stripeInstance: Stripe | null = null;

export const getStripeInstance = (): Stripe => {
  if (stripeInstance) return stripeInstance;

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new ApiError("Stripe configuration is missing on the server", 500);
  }

  stripeInstance = new Stripe(secretKey);

  return stripeInstance;
};
