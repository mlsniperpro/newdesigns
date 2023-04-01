import React from "react";
import Head from "next/head";
import PlanSelection from "@/components/PlanSelection";
import { useEffect } from "react";
//import { useRouter } from "next/router";
import Router from "next/router";
import { useState } from "react";
import Dashboard from "../components/dashboard";
import PayPal from "@/components/payment";
import Loader from "@/components/Loader";
import { auth, db } from "../config/firebase";
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

function Index() {
  const [subScribed, setSubScribed] = useState("Loading");
  const subScribedF = async () => {
    if (!auth?.currentUser?.uid) {
      Router.push("/login");
      return;
    }

    const data = await getDocs(collection(db, "subscribers"));
    
    const subscribers = data.docs.map((doc) => doc.data());
    //If any document userId same as auth.currentUser.uid obtain obtain all of them and get the the one with maximum count value attribute
    const subscriptions = subscribers.filter(
      (subscriber) => subscriber.userId === auth?.currentUser?.uid
    );
    //
    const latest_subscription = subscriptions.reduce(
      (a, b) => (a.subscriptionEndDate > b.subscriptionEndDate ? a : b),
      { subscriptionEndDate: 0 }
    );
    const wordsGenerated = await getDocs(collection(db, "wordsgenerated"));

    const usersWords = wordsGenerated.docs.map((doc) => doc.data());
    const currentUserWords = usersWords.filter(
      (word) => word.userId === auth?.currentUser?.uid
    );
    //console.log(currentUserWords[0].count);
    //console.log(auth.currentUser.uid);
    //console.log(subscriberData)
    if (Date.now() < latest_subscription.subscriptionEndDate) {
      setSubScribed("subscribed");
      return;
    } else if (currentUserWords[0]?.count < 1000) {
      setSubScribed("subscribed");
      return;
    } else if (!currentUserWords[0]?.count) {
      setSubScribed("subscribed");
      return;
    }
    setSubScribed("not subscribed");
  };
  
  useEffect(() => {
    try {
      if (auth) {
        subScribedF();
      }
    } catch (error) {
      console.log(error);
    }
  }, []);
  

  return (
    <div>
      <Head>
        <title>Vionko Marketing Tool</title>
      </Head>
      <div className="bg-[#1A232E] flex flex-col items-center justify-center min-h-screen py-2">
        <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
          {
            auth? (
              subScribed === "subscribed" ? (
                <Dashboard />
              ) : subScribed === "Loading" ? (
                <Loader />
              ) : (
                <PlanSelection />
              )
            ) :
            <Loader />
          }
        </main>
      </div>
    </div>
  );
}

export default Index;
