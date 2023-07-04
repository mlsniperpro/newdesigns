import Link from "next/link";
import Router from "next/router";
import { auth, db } from "../config/firebase";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import Head from "next/head";

export default function ThankYou() {
  const [user, userLoading] = useAuthState(auth);
  useEffect(() => {
    if (!window.localStorage.getItem("refreshed")) {
      const timer = setTimeout(() => {
        window.localStorage.setItem("refreshed", "true");
        window.location.reload(); // Refresh the page
      }, 2000); // 2000 milliseconds = 2 seconds
    }

    // No cleanup function needed
  }, []);

  useEffect(() => {
    let isMounted = true;

    if (!user && !userLoading && isMounted) {
      Router.push("/login");
      return;
    }

    if (user && isMounted) {
      console.log("The user details are : ", user.email);
      if (typeof window !== "undefined" && window.rewardful) {
        console.log("The window is : ", window.rewardful);
        window.rewardful("ready", function () {
          if (isMounted) {
            console.log("Use is referred now converting");
            window.rewardful("convert", {
              email: user.email,
            });
          }
        });
      }
    }

    return () => {
      isMounted = false;
    };
  }, [user, userLoading]);

  const [language, setLanguage] = useState("es");

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "es" : "en");
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <Head>
        <title>Thank You Page</title>
      </Head>
      <div className="relative py-3 sm:max-w-xl mx-auto text-center">
        <button
          className="absolute top-4 right-4 bg-blue-500 hover:bg-blue-700 text-white text-sm font-semibold py-1 px-2 rounded"
          onClick={toggleLanguage}
        >
          {language === "en" ? "Cambiar a Español" : "Change to English"}
        </button>
        <span className="text-2xl font-light text-gray-800">
          {language === "en" ? "Thank You!" : "¡Gracias!"}
        </span>
        <div className="mt-4 bg-white shadow-md rounded-lg text-lg text-gray-700 overflow-hidden">
          <div className="py-8 px-8">
            <p className="leading-normal">
              {/*Display the message both in English or Spanish*/}
              {language === "en"
                ? "Thank you for subscribing to Vioniko premium. Dedicated to helping you grow your business."
                : "Gracias por suscribirte a Vioniko premium. Dedicado a ayudarte a hacer crecer tu negocio."}
            </p>
            <div className="mt-6 pt-3">
              <Link href="/">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded">
                  Go Back Home
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
