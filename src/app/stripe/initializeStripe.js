import { loadStripe } from "@stripe/stripe-js";

let stripePromise = null;

const initializeStripe = async () => {
  if (!stripePromise) {
    stripePromise = await loadStripe(
      process.env.NEXT_PUBLIC_RK
    );
  }
  return stripePromise;
};

export default initializeStripe;
