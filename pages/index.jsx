import React, { useEffect, useState } from "react";
import Head from "next/head";
import Router from "next/router";
import {
  collection,
  getDocs,
  where,
  query,
  onSnapshot,
} from "firebase/firestore";
import { auth, db } from "../config/firebase";
import Dashboard from "../components/dashboard";
import { useAuthState } from "react-firebase-hooks/auth";
import Loader from "@/components/Loader";
import PlanSelection from "@/components/PlanSelection";
import usePremiumStatus from "@/stripe/usePremiumStatus";

function Index() {
  const [user, loadingAuth] = useAuthState(auth);
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(20000);
  const [upgrade, setUpgrade] = useState(false);
  const userIsPremium = usePremiumStatus(user);

  const handleValueChange = (newValue) => {
    setUpgrade(newValue);
  };

  const retrieveWordLimit = async () => {
    try {
      const limitDoc = await getDocs(collection(db, "wordlimit"));
      const limit = limitDoc.docs[0]?.data()?.limit;
      if (limit) {
        setLimit(limit);
      }
    } catch (error) {
      console.error("Error retrieving prices: ", error);
    }
  };
  useEffect(() => {
    const checkAuthStatusAndPrefetchHome = async () => {
      await Router.prefetch("/home");

      if (!auth?.currentUser?.uid) {
        Router.push("/home");
      }
    };

    checkAuthStatusAndPrefetchHome();
  }, [user, loadingAuth]);

  const checkSubscription = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const subscribersSnapshot = await getDocs(collection(db, "subscribers"));
      const subscribers = subscribersSnapshot.docs.map((doc) => doc.data());
      const userSubscriptions = subscribers.filter(
        (subscriber) => subscriber.userId === user.uid
      );
      const latestSubscription = userSubscriptions.reduce(
        (a, b) => (a.subscriptionEndDate > b.subscriptionEndDate ? a : b),
        {}
      );

      const wordsSnapshot = await getDocs(
        query(collection(db, "wordsgenerated"), where("userId", "==", user.uid))
      );
      const wordsGenerated = wordsSnapshot.docs.map((doc) => doc.data());
      const currentUserWords = wordsGenerated[0] || { count: 0 };

      if (
        Date.now() < latestSubscription.subscriptionEndDate ||
        currentUserWords.count < limit ||
        userIsPremium ||
        auth.currentUser.uid === "M8LwxAfm26SimGbDs4LDwf1HuCb2" ||
        auth.currentUser.uid === "fcJAePkUVwV7fBR3uiGh5iyt2Tf1"
      ) {
        setSubscribed(true);
      } else {
        setSubscribed(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSubscription();
  }, [limit, user, loadingAuth, userIsPremium]);

  return (
    <div>
      <Head>
        <title>Vionko Marketing AI</title>
      </Head>
      <div className="bg-[#1A232E] flex flex-col items-center justify-center min-h-screen py-2">
        <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
          {loading ? (
            <Loader />
          ) : subscribed && !upgrade ? (
            <Dashboard
              onValueChange={handleValueChange}
              />
          ) : (
            <PlanSelection />
          )}
        </main>
      </div>
    </div>
  );
}

export default Index;
