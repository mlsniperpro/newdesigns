import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import Router from "next/router";
import Link from "next/link";
import {
  collection,
  getDocs,
  updateDoc,
  setDoc,
  doc,
} from "firebase/firestore";
import { db, auth } from "../config/firebase";
import axios from "axios";

function Priceupdates() {
  const [price, setPrice] = useState(10.0);
  const [plan, setPlan] = useState("monthly");

  async function updatePricingSchemes() {
    const planId =
      plan === "monthly"
        ? "P-5DY729820D282010XMQNAIRI"
        : "P-8MS40752A79241224MQNAKFY"; // Replace with your plan ID
    const newPrice = price; // Replace with your new price
    const firebaseFunctionUrl =
    "https://us-central1-vioniko-82fcb.cloudfunctions.net/updatePricingSchemes"; // Replace <your-project-id> with your Firebase project ID

    // Log the request data for debugging
   

    try {
      const response = await axios.post(firebaseFunctionUrl, {
        planId,
        newPrice,
      });

    } catch (error) {
      // Check if the error response from the server exists
      if (error.response) {
        console.error(
          `Failed to update pricing schemes: ${error.response.data}`
        );
      } else {
        console.error(`Failed to update pricing schemes: ${error}`);
      }
    }
  }

  const createPrice = async (productId, currency, unitAmount) => {
    try {
      const response = await axios.post(
        "https://us-central1-vioniko-82fcb.cloudfunctions.net/api/create-price",
        {
          product_id: productId,
          currency: currency,
          unit_amount: unitAmount,
        }
      );

      return response.data.price;
    } catch (error) {
      console.error("Error creating price:", error);
      throw error;
    }
  };

  const handlePlanChange = (event) => {
    setPlan(event.target.value);
  };
  const handleInptChange = (event) => {
    setPrice(parseFloat(event.target.value));
  };

  const handlePriceChange = (event) => {
    setPrice(parseFloat(event.target.textContent.slice(1)));
  };
  const priceUpdater = async () => {
    if (!price || !plan) {
      alert("Please enter a price and select a plan");
      return;
    }
    try {
      const paymentDocs = await getDocs(collection(db, "Payment"));

      if (!paymentDocs.empty) {
        const paymentDocRef = paymentDocs.docs[0].ref; // Get the first document in the Payment collection
        await updateDoc(paymentDocRef, {
          [plan]: price, // update the "plan" field with the new price
        });
        updatePricingSchemes();
        if (plan === "monthly") {
          const monthlyPrice = await createPrice(
            "prod_Njtrgy9W8UwGW7",
            "usd",
            price * 100
          );
        } else if (plan === "yearly") {
          const yearlyPrice = await createPrice(
            "prod_NjtvxM9XlsH2c6",
            "usd",
            price * 100
          );
        }
      } else {
        await setDoc(doc(db, "Payment", "payment"), {
          // remove the .doc() call
          [plan]: price, // create a new document with the "plan" field set to the new price
        });
      }
    } catch (error) {
      console.log(error);
    }
    alert("Price updated successfully");
  };

  useEffect(() => {
    const onlyAdmins = () => {
      if (!auth.currentUser?.uid) {
        Router.push("/login");
        return;
      }
      if (
        auth.currentUser?.uid === "M8LwxAfm26SimGbDs4LDwf1HuCb2" ||
        auth.currentUser?.uid === "fcJAePkUVwV7fBR3uiGh5iyt2Tf1"
      ) {
        return;
      } else {
        alert("Admins only!");
        Router.push("/login");
      }
    };
    onlyAdmins();
  }, []);

  return (
    <div>
      <div className="font-manrope flex h-screen w-full items-center justify-center">
        <div className="mx-auto box-border w-[365px] border bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="text-[#64748B]">
              <Link href="/">Home</Link>
            </span>
            <div className="cursor-pointer border rounded-[4px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-[#64748B]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>
          <div className="mt-6">
            <div className="font-semibold">
              How much would you want to set the new subscription plan?
            </div>
            <div>
              <input
                className="mt-1 w-full rounded-[4px] border border-[#A0ABBB] p-2"
                defaultValue={price}
                type="text"
                placeholder={price}
                onChange={handleInptChange}
              />
            </div>
            <div className="flex justify-between">
              <div
                className={`mt-[14px] cursor-pointer truncate rounded-[4px] border ${
                  price === 10
                    ? "border-green-700 text-white bg-green-700"
                    : "border-[#E7EAEE] text-[#191D23]"
                }`}
                onClick={handlePriceChange}
              >
                $10.00
              </div>
              <div
                className={`mt-[14px] cursor-pointer truncate rounded-[4px] border ${
                  price === 50
                    ? "border-green-700 text-white bg-green-700"
                    : "border-[#E7EAEE] text-[#191D23]"
                }`}
                onClick={handlePriceChange}
              >
                $50.00
              </div>
              <div
                className={`mt-[14px] cursor-pointer truncate rounded-[4px] border ${
                  price === 100
                    ? "border-green-700 text-white bg-green-700"
                    : "border-[#E7EAEE] text-[#191D23]"
                }`}
                onClick={handlePriceChange}
              >
                $100.00
              </div>
              <div
                className={`mt-[14px] cursor-pointer truncate rounded-[4px] border ${
                  price === 200
                    ? "border-green-700 text-white bg-green-700"
                    : "border-[#E7EAEE] text-[#191D23]"
                }`}
                onClick={handlePriceChange}
              >
                $200.00
              </div>
            </div>
          </div>
          <div className="mt-6">
            <div className="font-semibold">From</div>
            <div className="mt-2">
              <div className="flex w-full items-center justify-between bg-neutral-100 p-3 rounded-[4px]">
                <div className="flex items-center gap-x-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-[#299D37]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="font-semibold">Subscription Plan</span>
                </div>
                <div className="flex items-center gap-x-2">
                  <div className="relative">
                    <select
                      className="appearance-none bg-transparent text-[#64748B] cursor-pointer"
                      value={plan}
                      onChange={handlePlanChange}
                    >
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 absolute right-0 top-[calc(50%-0.5rem)] pointer-events-none"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <div
              onClick={priceUpdater}
              className="w-full cursor-pointer rounded-[4px] bg-green-700 px-3 py-[6px] text-center font-semibold text-white"
            >
              Change To USD {price}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Priceupdates;
