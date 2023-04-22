import React, { useEffect, useState } from "react";
import Head from "next/head";
import Router from "next/router";
import { collection, getDocs, where, query } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import Dashboard from "../components/dashboard";
import { useAuthState } from "react-firebase-hooks/auth";
import Loader from "@/components/Loader";
import PlanSelection from "@/components/PlanSelection";
import usePremiumStatus from "@/stripe/usePremiumStatus";

function Index() 
  const [user, loadingAuth] = useAuthState(auth);
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(20000);
  const retrieveWordLimit = async () => {
    try {
      const limitDoc = await getDocs(collection(db, "wordlimit"));
      console.log("The lits are : ", limitDoc);
      const limit = limitDoc.docs[0].data().limit;
      setLimit(limit);
      console.log("Limit retrived and updated successflly as : ", limit);
    } catch (error) {
      console.log("Error retrieving prices: ", error);
    }
  };
  const isUserPremium = usePremiumStatus(user);
  React.useEffect(() => {
    retrieveWordLimit();
  }, []);
  useEffect(() => {
    const checkSubscription = async () => {
      console.log("Now checking subscription")
      try {
        if (!user && !loadingAuth) {
          Router.push("/login");
          return;
        }

        const subscribersSnapshot = await getDocs(
          collection(db, "subscribers")
        );
        const subscribers = subscribersSnapshot.docs.map((doc) => doc.data());
        const userSubscriptions = subscribers.filter(
          (subscriber) => subscriber.userId === auth.currentUser.uid
        );
        const latestSubscription = userSubscriptions.reduce(
          (a, b) => (a.subscriptionEndDate > b.subscriptionEndDate ? a : b),
          {}
        );

        const wordsSnapshot = await getDocs(
          query(
            collection(db, "wordsgenerated"),
            where("userId", "==", auth.currentUser.uid)
          )
        );
        const wordsGenerated = wordsSnapshot.docs.map((doc) => doc.data());
        const currentUserWords = wordsGenerated[0] || { count: 0 };

        if (
          Date.now() < latestSubscription.subscriptionEndDate ||
          currentUserWords.count < limit ||
          auth.currentUser.uid === "M8LwxAfm26SimGbDs4LDwf1HuCb2" ||
          auth.currentUser.uid === "ow0JkUWdI9f7CTxi93JdyqarLZF3"
        ) {
          console.log(
            "The current user Id and the user is subscribed",
            auth.currentUser.uid,
            "based on ",
            currentUserWords.count < limit
          );
          setSubscribed(true);
        } else if(userIsPremium){
          setSubscribed(true);
        }
        else {
          console.log("The current user Id is not subscribed", auth.currentUser.uid)
          setSubscribed(false);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    checkSubscription();
  }, [limit,user]);
  
  return (
    
    <div>
      {console.log("The limit down here are : ", limit)}
      <Head>
        <title>Vionko Marketing AI</title>
      </Head>
      <div className="bg-[#1A232E] flex flex-col items-center justify-center min-h-screen py-2">
        <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
          {loading ? (
            <Loader />
          ) : subscribed ? (
            <Dashboard />
           
            
          ) : (
            <PlanSelection />
           
          )}
        </main>
      </div>
    </div>
  );
}

export default Index;
