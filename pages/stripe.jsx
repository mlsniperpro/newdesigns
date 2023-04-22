import React from "react";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../config/firebase";
import { createCheckoutSession } from "@/stripe/createCheckoutSession";
import usePremiumStatus from "@/stripe/usePremiumStatus";

export default function Home() {
  const [user, userLoading] = useAuthState(auth);
  console.log("User is:", user);
  
  return (
    <div>
      {console.log("Checking the usePremiumStatus hook:", usePremiumStatus(user))}
      {!user && userLoading && <h1>Loading...</h1>}
      {user && !userLoading && (
        <div>
          <h1>Hello, {user.displayName}</h1>
          <button
            onClick={() =>
              createCheckoutSession(user.uid, "prod_NjtvxM9XlsH2c6")
            }
          >
            Upgrade to premium!
          </button>
        </div>
      )}
    </div>
  );
}
