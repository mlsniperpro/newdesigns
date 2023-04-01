import { useEffect } from "react";
import { useRouter } from "next/router";
import { auth, db } from "../config/firebase";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";

const ButtonWrapper = ({ type }) => {
  const [{ options }, dispatch] = usePayPalScriptReducer();

  useEffect(() => {
    dispatch({
      type: "resetOptions",
      value: {
        ...options,
        intent: "subscription",
      },
    });
  }, [type]);

  return (
    <PayPalButtons
      createSubscription={(data, actions) => {
        return actions.subscription
          .create({
            plan_id: "P-3RX065706M3469222L5IFM4I",
          })
          .then((orderId) => {
            // Your code here after create the order
            console.log(orderId)
            console.log("The order ID is " + orderId);
            return orderId;
          });
      }}
      style={{
        label: "subscribe",
      }}
    />
  );
};

export default function PayPal() {
  return (
    <PayPalScriptProvider
      options={{
        "client-id": "test",
        components: "buttons",
        intent: "subscription",
        vault: true,
      }}
    >
      <ButtonWrapper type="subscription" />
    </PayPalScriptProvider>
  );
}


const addSubscriber = async () => {
  try {
    const docRef = await addDoc(collection(db, "subscribers"), {
      userId: auth.currentUser.uid,
    });

    console.log("Document written with ID: ", docRef.id);
    Router.push("/dashboard");
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};
addSubscriber();