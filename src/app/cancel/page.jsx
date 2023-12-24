"use client";
import { useEffect, useState } from "react";

import Link from "next/link";

import { auth, db } from "../config/firebase";

import {
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

const CancelSubscription = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [status, setStatus] = useState("");
  const stripeProducts = {
    prod_Njtrgy9W8UwGW7: "Monthly",
    prod_NjtvxM9XlsH2c6: "Yearly",
  };

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const q = query(
          collection(db, "subscribers"),
          where("userId", "==", auth.currentUser.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
          const userSubscriptions = snapshot.docs.map((doc) => {
            const data = doc.data();
            const endDate = new Date(data.subscriptionEndDate);
            data.status = endDate > new Date() ? "Active" : "Inactive";
            return data;
          });
          setSubscriptions(userSubscriptions);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching subscriptions: ", error);
      }
    };

    if (auth.currentUser?.uid) {
      fetchSubscriptions();
    }
  }, [auth.currentUser?.uid]);

  const updateSubscriptionStatusInFirebase = async (subscriptionId, status) => {
    const subscriptionRef = doc(db, "subscribers", subscriptionId);
    await updateDoc(subscriptionRef, { status });
  };

  const handlePayPalCancel = async () => {
    const url =
      "https://us-central1-vioniko-82fcb.cloudfunctions.net/cancelUserSubscriptions";
    const user_id = auth.currentUser?.uid;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: user_id, reason: "I am not satisfied" }),
    });
    if (!response.ok) {
      throw new Error(`Failed with status: ${response.status}`);
    }
  };

  const handleStripeCancel = async (sub_id) => {
    const response = await fetch(
      "https://us-central1-vioniko-82fcb.cloudfunctions.net/cancelStripeSubscription",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscriptionId: sub_id,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
  };

  const handleCancelSubscription = async (subscriptionId) => {
    let stripeError = null;
    let paypalError = null;

    setStatus(`Cancelling subscription with id ${subscriptionId}`);

    try {
      await handleStripeCancel(subscriptionId);
    } catch (err) {
      stripeError = err;
      setStatus(`Error cancelling Stripe subscription: ${err.message}`);
    }

    try {
      await handlePayPalCancel();
    } catch (err) {
      paypalError = err;
      setStatus(`Error cancelling PayPal subscription: ${err.message}`);
    }

    if (!stripeError && !paypalError) {
      try {
        await updateSubscriptionStatusInFirebase(subscriptionId, "Cancelled");
        setSubscriptions(
          subscriptions.filter(
            (subscription) => subscription.id !== subscriptionId
          )
        );
        setStatus(`Subscription with id ${subscriptionId} has been cancelled.`);
      } catch (err) {
        setStatus(
          `Error updating subscription status in Firebase: ${err.message}`
        );
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gradient-to-r from-blue-500 to-blue-700">
      <div className="flex flex-col items-center bg-white p-6 my-4 w-full sm:w-3/4 lg:w-1/2 xl:w-3/8 xxl:w-1/4 rounded-xl shadow-md space-y-4">
        <div className="text-center space-y-2">
          <Link href="/">
            <h2 className="text-2xl font-semibold text-blue-700 cursor-pointer">
              Home
            </h2>
          </Link>
          {subscriptions.map((subscription) => (
            <div
              key={subscription.id || subscription.subscriptionId}
              className="flex justify-between items-center w-full border-b-2 border-gray-200 py-4"
            >
              <p className="text-lg font-medium text-gray-700">
                {stripeProducts[subscription.data?.items[0]?.plan?.product] ||
                  "Yearly"}{" "}
                - {subscription.data?.status || subscription.status}
              </p>
              <button
                onClick={() =>
                  handleCancelSubscription(
                    subscription.id || subscription.subscriptionId
                  )
                }
                className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded"
              >
                Cancel
              </button>
            </div>
          ))}
          {status && <p className="mt-4 text-green-500">{status}</p>}
        </div>
      </div>
    </div>
  );
};

export default CancelSubscription;
