import { addDoc, collection, onSnapshot } from "firebase/firestore";
import {db } from "../config/firebase";

export async function createCheckoutSession(uid, priceId) {
  //console.log("The uid is: " + uid);

  const docRef = await addDoc(
    collection(db, "users", uid, "checkout_sessions"),
    {
      price: priceId,
      success_url: "https://marketing.vioniko.net/thankyou",
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
      //console.log("I reached here and data is", data);
      //console.log("The url is: ", url);
      //console.log("The error is: ", error);
      if (url) {
        // We have a Stripe Checkout URL, let's redirect.
        window.location.assign(url);
      } else {
        console.warn("URL is undefined. Check your Cloud Function.");
      }
    }
  });

}


