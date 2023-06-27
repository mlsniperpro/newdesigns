import { auth, db } from "../config/firebase";
import ChatBody from "@/components/ChatBody";
import ChatInput from "@/components/ChatInput";
import usePremiumStatus from "@/stripe/usePremiumStatus";
//If API_KEY is none then load the API_KEY from the database
import HomeIcon from "@mui/icons-material/Home";
import LanguageIcon from "@mui/icons-material/Language";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import Link from "next/link";
import Router from "next/router";
import { useState } from "react";
import { useEffect } from "react";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { ReactMarkdown } from "react-markdown";
import { useMutation } from "react-query";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

function Tutor() {
  const [user, userLoading] = useAuthState(auth);
  const [loading, setLoading] = useState(true);
  const [subscribed, setSubscribed] = useState(true);
  const [language, setLanguage] = useState("spanish");
  const [chat, setChat] = useState([]);
  const [limit, setLimit] = useState(20000);
  const userIsPremium = usePremiumStatus(user);
  const retrieveWordLimit = async () => {
    try {
      const limitDoc = await getDocs(collection(db, "wordlimit"));
      const limit = limitDoc.docs[0].data().limit;
      setLimit(limit);
    } catch (error) {
      console.log("Error retrieving prices: ", error);
    }
  };

  React.useEffect(() => {
    retrieveWordLimit();
  }, [loading]);
  useEffect(() => {
    const checkSubscription = async () => {
      try {
        if (!user && !userLoading) {
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
          auth.currentUser.uid === "fcJAePkUVwV7fBR3uiGh5iyt2Tf1"
        ) {
          setSubscribed(true);
        } else if (userIsPremium) {
          setSubscribed(true);
        } else {
          setSubscribed(false);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    checkSubscription();
  }, [limit, user]);
  useEffect(() => {
    if (!subscribed && !loading && !userIsPremium && !userLoading && user) {
      Router.push("/");
    }
  }, [loading]);

  const fetchResponse = async (chat) => {
    try {
      //If the chat is more than 3 values, remove the first one
      let lastFive = chat.slice(Math.max(chat.length - 40, 0));
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + API_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: lastFive,
          }),
        }
      );
      const data = await response.json();

      const updateUserWordCount = async () => {
        try {
          //Get the document from wordsgenerated collection where userId attribute is equal to the current user's uid and update it by adding 30 to curent count attribute in the same document
          const docRef = await getDocs(collection(db, "wordsgenerated"));
          const wordsGenerated = docRef.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          //Check if the any document in wordsgenerated collection has userId attribute equal to the current user's uid if so update the count attribute by adding 30 to it or else create a new document with userId attribute equal to the current user's uid and count attribute equal to 30
          if (
            wordsGenerated.some((word) => word.userId === auth.currentUser.uid)
          ) {
            const docRef = await getDocs(collection(db, "wordsgenerated"));
            const wordsGenerated = docRef.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            const userDoc = wordsGenerated.find(
              (word) => word.userId === auth.currentUser.uid
            );
            await updateDoc(doc(db, "wordsgenerated", userDoc.id), {
              count: userDoc.count + data.choices[0].message.content.length,
            });
          } else {
            await setDoc(doc(db, "wordsgenerated", auth.currentUser.uid), {
              userId: auth.currentUser.uid,
              count: data.choices[0].message.content.length,
            });
          }
        } catch (error) {
          console.log(error);
        }
      };
      updateUserWordCount();

      return data;
    } catch (error) {
      console.log(error);
    }
  };
  function changeLanguage() {
    if (language === "en") {
      setLanguage("spanish");
    } else if (language === "spanish") {
      setLanguage("en");
    } else {
      setLanguage("spanish");
    }
  }

  const mutation = useMutation({
    mutationFn: () => {
      return fetchResponse(chat);
    },
    onSuccess: (data) =>
      setChat((prev) => [
        ...prev,
        { role: "assistant", content: data.choices[0].message.content },
      ]),
  });

  const sendMessage = async (message) => {
    await Promise.resolve(setChat((prev) => [...prev, message]));
    mutation.mutate();
  };

  return (
    <div
      className="bg-[#1A232E] h-screen py-6 relative sm:px-16 px-12 text-white overflow-hidden flex flex-col justify-between  align-middle w-screen"
      style={{ background: "rgb(40, 48, 129)" }}
    >
      {/* gradients */}
      <div className="gradient-01 z-0 absolute"></div>
      <div className="gradient-02 z-0 absolute"></div>

      {/* header */}
      <div className="uppercase font-bold  text-2xl text-center mb-3">
        <h1 style={{ fontFamily: "Monospace", fontSize: "30px" }}>
          {language === "en"
            ? "Chat Interface"
            : "Interfaz de Chat"}
        </h1>
        {/* <p>DEMO del TUTOR VK </p> */}
      </div>
      <div>
        <br></br>
        <br></br>
        <Link href="/">
          <button
            className="block uppercase mx-auto shadow bg-indigo-800 hover:bg-indigo-700 focus:shadow-outline focus:outline-none text-white text-xs py-3 px-10 rounded"
            style={{
              background: "white",
              color: "rgb(40, 48, 129)",
              width: "200px",
              fontFamily: "Monospace",
              fontSize: "18px",
            }}
          >
            <HomeIcon /> {language === "en" ? "Home" : "Inicio"}
          </button>
        </Link>
        <button
          onClick={changeLanguage}
          className="block mt-6 uppercase mx-auto shadow bg-indigo-800 hover:bg-indigo-700 focus:shadow-outline focus:outline-none text-white text-xs py-3 px-10 rounded"
          style={{
            background: "white",
            color: "rgb(40, 48, 129)",
            width: "300px",
            fontFamily: "Monospace",
            fontSize: "18px",
            marginBottom: "10px",
          }}
        >
          <LanguageIcon style={{ marginRight: "10px" }} />
          {language === "en" ? "Switch to Spanish" : "Cambiar a Inglés"}
        </button>
      </div>

      {/* body */}
      <div
        className="h-[90%] overflow-auto w-full max-w-4xl min-w-[20rem] py-8 px-4 self-center
      scrollbar-thumb-slate-400 scrollbar-thin scrollbar-track-gray-tranparent scrollbar-thumb-rounded-md
      "
        style={{ border: "1px solid #fff" }}
      >
        <ChatBody chat={chat.slice(1)} />
      </div>

      {/* input */}
      <div
        className="w-full max-w-4xl min-w-[20rem] self-center"
        style={{ border: "1px solid #fff" }}
      >
        <ChatInput
          sendMessage={sendMessage}
          loading={mutation.isLoading}
          style={{
            border: "1px solid white",
            fontFamily: "Monospace",
            fontSize: "20px",
          }}
        />
      </div>
    </div>
  );
}

export default Tutor;
