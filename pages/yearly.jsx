import { useEffect } from "react";
import { useRouter } from "next/router";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { auth, db } from "../config/firebase";
import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";

const ButtonWrapper = ({ type }) => {
  const router = useRouter();
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
            plan_id: "P-8MS40752A79241224MQNAKFY",
          })
          .then((orderId) => {
            //You code here

            return orderId;
          });
      }}
      onApprove={(data, actions) => {
        return actions.subscription.get().then((details) => {
          const addSubscriber = async () => {
            try {
              const docRef = await addDoc(collection(db, "subscribers"), {
                userId: auth.currentUser.uid,
                email: auth.currentUser.email,
                subscriptionId: details.id,
                subscriptionStatus: details.status,
                subscriptionPlan: details.plan_id,
                //Start date in milliseconds since epoch and number data type
                subscriptionStartDate: Date.now(),
                //End date in milliseconds since epoch and number data type plus 12 months
                subscriptionEndDate: Date.now() + 31536000000,
                plan: "yearly",
              });
              console.log("Document written with ID: ", docRef.id);
            } catch (e) {
              console.error("Error adding document: ", e);
            }
          };
          addSubscriber();
          router.push("/");
        });
      }}
      style={{
        label: "subscribe",
      }}
    />
  );
};

export default function YearlylySubscription() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <PayPalScriptProvider
        options={{
          "client-id":
            "ASpt5aPvpjGZzACXTuwBTC4_8VVsPSJQGwLSzRNluEecY6bMm9i67e_MXCsHNqLqYtvAIM1fgPBo5D0a",
          components: "buttons",
          intent: "subscription",
          vault: true,
        }}
      >
        <ButtonWrapper type="subscription" />
      </PayPalScriptProvider>
    </div>
  );
}
