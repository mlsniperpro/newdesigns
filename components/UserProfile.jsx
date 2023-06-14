import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import Image from "next/image";
import Avatar from "react-avatar";
import { auth, db } from "../config/firebase";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [userAuth, loadingAuth] = useAuthState(auth);
  const [loading, setLoading] = useState(true);
  const [currentSubscription, setCurrentSubscription] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
      try {
        if (userAuth) {
          const q = query(
            collection(db, "users"),
            where("userId", "==", userAuth.uid)
          );
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            const userData = doc.data();
            if (!("stripeLink" in userData) || !("stripeId" in userData)) {
              // process the user data as needed
              setUser(userData); // this will overwrite the user state for each matching document
            }
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!userAuth) return;

    const stripeProducts = {
      prod_Njtrgy9W8UwGW7: "Monthly",
      prod_NjtvxM9XlsH2c6: "Yearly",
    };
    const subscriptionsRef = collection(
      db,
      "users",
      auth.currentUser?.uid,
      "subscriptions"
    );
    const q = query(
      subscriptionsRef,
      where("status", "in", ["trialing", "active"])
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const doc = snapshot.docs[0];
        if (doc) {
          const subscription = {
            userId: auth.currentUser?.uid,
            subscriptionEndDate: doc.data().current_period_end.seconds * 1000,
            subscriptionStartDate:
              doc.data().current_period_start.seconds * 1000,
            plan: stripeProducts[doc.data().items[0]["plan"]["product"]],
          };
          setCurrentSubscription(subscription);
        }
      },

      (error) => {
        console.error("Snapshot listener error:", error);
      }
    );

    setTimeout(unsubscribe, 10000);

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [userAuth]);

  useEffect(() => {``
    if (!userAuth) return;
    const checkPayPalSubscribers = async () => {
      const subscribersSnapshot = await getDocs(collection(db, "subscribers"));
      const subscribers = subscribersSnapshot.docs.map((doc) => doc.data());
      const userSubscriptions = subscribers.filter(
        (subscriber) => subscriber.userId === auth.currentUser?.uid
      );
      const latestSubscription = userSubscriptions.reduce(
        (a, b) => (a.subscriptionEndDate > b.subscriptionEndDate ? a : b),
        {}
      );


      if (latestSubscription.subscriptionEndDate > Date.now()) {
        setCurrentSubscription(latestSubscription);
      }
    };

    checkPayPalSubscribers();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4">
      <div className="flex-shrink-0">
        {user?.photo ? (
          <Image
            src={user.photo}
            alt="User Avatar"
            width={50}
            height={50}
            priority
          />
        ) : (
          <Avatar name={user?.name || "User"} size="50" round={true} />
        )}
      </div>
      <div>
        <div className="text-xl font-medium text-black">{user?.name}</div>
        <p className="text-gray-500">{user?.email}</p>
        {user?.phoneNumber && (
          <p className="text-gray-500">{user?.phoneNumber}</p>
        )}
        <p className="text-gray-500">Signed up with: {user?.authProvider}</p>
        {user && user.dateSignedUp && (
          <p className="text-gray-500">
            Joined on: {new Date(user.dateSignedUp).toLocaleDateString()}
          </p>
        )}
        {currentSubscription && (
          <p className="text-gray-500">
            Subscription: {currentSubscription.plan}
          </p>
        )}
        {currentSubscription && (
          <p className="text-gray-500">
            Subscription ends on:{" "}
            {new Date(currentSubscription.subscriptionEndDate).toLocaleDateString()}
          </p>
        )
        }
        {
          currentSubscription && (
            <p className="text-gray-500">
              Subscription started on:{" "}
              {new Date(currentSubscription.subscriptionStartDate).toLocaleDateString()}
            </p>
          )
        }

      </div>
    </div>
  );
}
