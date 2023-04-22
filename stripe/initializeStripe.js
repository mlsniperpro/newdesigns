import { loadStripe } from "@stripe/stripe-js";

let stripePromise = null;

const initializeStripe = async () => {
  if (!stripePromise) {
    stripePromise = await loadStripe(
      "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"
    );
  }
  return stripePromise;
};

export default initializeStripe;
