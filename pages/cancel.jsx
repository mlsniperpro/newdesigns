import { useEffect, useState } from "react";



import Link from "next/link";



import { auth, db } from "../config/firebase";



import { collection, doc, getDoc, getDocs, getFirestore, onSnapshot, query, where } from "firebase/firestore";


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

          setSubscriptions([latestSubscription]);
        }
      } catch (error) {
        console.error("Error fetching subscriptions: ", error);
      }
    };

    fetchSubscriptions();
  }, []);

  useEffect(() => {
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
      setSubscriptions(newSubscriptions);
    });

    return () => unsubscribe();
  }, [auth.currentUser?.uid]);

  const handlePayPalCancel = async () => {
    const url =
      "https://us-central1-vioniko-82fcb.cloudfunctions.net/cancelUserSubscriptions";
    try {
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
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gradient-to-r from-blue-500 to-blue-700">
      <div className="flex flex-col items-center bg-white p-6 my-4 w-full sm:w-3/4 lg:w-1/2 xl:w-3/8 xxl:w-1/4 rounded-xl shadow-md space-y-4">
        <div className="text-center space-y-2">
          <Link href="/">
            <h2 className="text-2xl font-semibold text-blue-700 cursor-pointer">Home</h2>
          </Link>
          {subscriptions.map((subscription) => (
            <div
              key={subscription.id || subscription.subscriptionId}
              className="flex justify-between items-center w-full border-b-2 border-gray-200 py-4"
            >
              <p className="text-lg font-medium text-gray-700">
                {stripeProducts[
                  subscription.data?.items[0]?.plan?.product
                ] || "Yearly"}{" "}
                - {subscription.data?.status || subscription.status}
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
  );
};

export default CancelSubscription;