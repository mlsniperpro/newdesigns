import { useState, useEffect } from "react";
import Link from "next/link";
import {
  getFirestore,
  doc,
  collection,
  where,
  query,
  getDocs,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
import { db, auth } from "../config/firebase";

const CancelSubscription = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [status, setStatus] = useState("");

  const subs = {
    sub_1N8YqBIYCytGzqWhCYFRWvdP: "Monthly",
  };

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const subscribersSnapshot = await getDocs(
          collection(db, "subscribers")
        );
        const subscribers = subscribersSnapshot.docs.map((doc) => doc.data());
        const userSubscriptions = subscribers.filter(
          (subscriber) => subscriber.userId === auth.currentUser.uid
        );

        if (userSubscriptions.length > 0) {
          const latestSubscription = userSubscriptions.reduce((a, b) =>
            a.subscriptionEndDate > b.subscriptionEndDate ? a : b
          );
          const endDate = new Date(latestSubscription.subscriptionEndDate);

          if (endDate > new Date()) {
            latestSubscription.status = "Active";
          } else {
            latestSubscription.status = "Inactive";
          }

          setSubscriptions((prevSubscriptions) => [
            ...prevSubscriptions,
            latestSubscription,
          ]);
        }
      } catch (error) {
        console.error("Error fetching subscriptions: ", error);
      }
    };

    fetchSubscriptions();

    if (!auth.currentUser?.uid) {
      return;
    }

    const q = query(
      collection(doc(db, "users", auth.currentUser?.uid), "subscriptions"),
      where("status", "in", ["trialing", "active"])
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newSubscriptions = snapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
      }));
      setSubscriptions((prevSubscriptions) => [
        ...prevSubscriptions,
        ...newSubscriptions,
      ]);
    });

    return () => unsubscribe();
  }, [auth.currentUser?.uid]);

  const handlePayPalCancel = async () => {
    const url =
      "https://us-central1-vioniko-82fcb.cloudfunctions.net/cancelUserSubscriptions";
    try {
      const user_id = auth.currentUser.uid;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id, reason: "I am not satisfied" }),
      });
      if (!response.ok) {
        throw new Error(`Failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error(`An error occurred: ${error.message}`);
    }
  };

  const handleStripeCancel = async (sub_id) => {
    try {
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
    } catch (error) {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    }
  };

  const handleCancelSubscription = async (subscriptionId) => {
    try {
      setStatus(`Cancelling subscription with id ${subscriptionId}`);
      await handleStripeCancel(subscriptionId);
      await handlePayPalCancel();

      setSubscriptions(
        subscriptions.filter(
          (subscription) => subscription.id !== subscriptionId
        )
      );
      setStatus(`Subscription with id ${subscriptionId} has been cancelled.`);
    } catch (err) {
      setStatus(`Error cancelling subscription: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
          <div className="max-w-md mx-auto">
            <div className="flex items-center space-x-5">
              <div className="block pl-2 font-semibold text-xl self-start text-gray-700">
                <Link href="/">
                  <h2 className="leading-relaxed">Home</h2>
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                {subscriptions.map((subscription) => (
                  <div
                    key={subscription.id || subscription.subscriptionId}
                    className="flex justify-between items-center"
                  >
                    <p>
                      {subs[subscription.id] || "Yearly"} -{" "}
                      {subscription.data?.status || subscription.status}
                    </p>
                    <button
                      onClick={() => handleCancelSubscription(subscription.id)}
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
        </div>
      </div>
    </div>
  );
};

export default CancelSubscription;
