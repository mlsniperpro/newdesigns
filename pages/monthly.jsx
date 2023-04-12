import { useEffect } from "react";
import { useRouter } from "next/router";
import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
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
// This values are the props in the UI
let amount = "9";
const currency = "USD";
const style = { layout: "vertical" };

const retrievePrices = async () => {
  const pricesDoc = await getDocs(collection(db, "Payment"));
  console.log("The prices retrieved are: ", pricesDoc);
  pricesDoc.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
    amount = doc.data().monthly;
  });
};

// Custom component to wrap the PayPalButtons and handle currency changes
const ButtonWrapper = ({ currency, showSpinner }) => {
  // usePayPalScriptReducer can be use only inside children of PayPalScriptProviders
  // This is the main reason to wrap the PayPalButtons in a new component
  const [{ options, isPending }, dispatch] = usePayPalScriptReducer();
  const router = useRouter();

  useEffect(() => {
    dispatch({
      type: "resetOptions",
      value: {
        ...options,
        currency: currency,
      },
    });
  }, [currency, showSpinner]);
  useEffect(() => {
    retrievePrices();
  }, []);

  return (
    <>
      {showSpinner && isPending && <div className="spinner" />}
      <PayPalButtons
        style={style}
        disabled={false}
        forceReRender={[amount, currency, style]}
        fundingSource={undefined}
        createOrder={(data, actions) => {
          return actions.order
            .create({
              purchase_units: [
                {
                  amount: {
                    currency_code: currency,
                    value: amount,
                  },
                },
              ],
            })
            .then((orderId) => {
              // Your code here after create the order
              return orderId;
            });
        }}
        onApprove={function (data, actions) {
          return actions.order.capture().then((details) => {
            console.log("The details are ", details);
            const addSubscriber = async () => {
              try {
                const docRef = await addDoc(collection(db, "subscribers"), {
                  userId: auth.currentUser.uid,
                  email: auth.currentUser.email,
                  subscriptionId: details.id,
                  subscriptionStatus: details.status,
                  //Start date in milliseconds since epoch and number data type
                  subscriptionStartDate: Date.now(),
                  //End date in milliseconds since epoch and number data type plus 30 days
                  subscriptionEndDate: Date.now() + 3196800000,
                  plan: "monthly",
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
      />
    </>
  );
};

export default function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <PayPalScriptProvider
        options={{
          "client-id":
            "ASpt5aPvpjGZzACXTuwBTC4_8VVsPSJQGwLSzRNluEecY6bMm9i67e_MXCsHNqLqYtvAIM1fgPBo5D0a",
          components: "buttons",
          currency: "USD",
        }}
      >
        <ButtonWrapper currency={currency} showSpinner={false} />
      </PayPalScriptProvider>
    </div>
  );
}
