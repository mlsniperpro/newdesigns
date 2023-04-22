import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import getStripe from "./initializeStripe";

const productPriceMapping = {
  prod_Njtrgy9W8UwGW7: "price_1MyQ3IIYCytGzqWh2pWK4Rrc",

  prod_NjtvxM9XlsH2c6: "price_1MyQ7GIYCytGzqWhZOdLOpgs",
};

function getPriceId(productId) {
  return productPriceMapping[productId];
}

export async function createCheckoutSession(uid, productId) {
  console.log("The uid is: " + uid);
  const priceId = getPriceId(productId);

  const docRef = await addDoc(
    collection(db, "users", uid, "checkout_sessions"),
    {
      price: priceId,
      success_url: window.location.origin,
      cancel_url: window.location.origin,
    }
  );

  // Wait for the CheckoutSession to get attached by the extension
  onSnapshot(docRef, (snap) => {
    const data = snap.data();

    if (data) {
      const { error, url } = data;
      if (error) {
        // Show an error to your customer and
        // inspect your Cloud Function logs in the Firebase console.
        alert(`An error occurred: ${error.message}`);
      }
      console.log("I reached here and data is", data);
      console.log("The url is: ", url);
      console.log("The error is: ", error);
      if (url) {
        // We have a Stripe Checkout URL, let's redirect.
        window.location.assign(url);
      } else {
        console.warn("URL is undefined. Check your Cloud Function.");
      }
    }
  });

}
