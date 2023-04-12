import React, { useState, useEffect } from "react";
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

function WordLimit() {
  const [wordLimit, setWordLimit] = useState(20000);

  const handleInputChange = (event) => {
    const newLimit = parseFloat(event.target.value);
    if (!isNaN(newLimit)) {
      setWordLimit(newLimit);
    } else {
        alert("Please enter a valid number");
    }
  };
  
  const handleConfirmChange = async () => {
    try {
      const wordLimitDoc = await getDocs(collection(db, "wordlimit"));

      if (!wordLimitDoc.empty) {
        const wordLimitRef = wordLimitDoc.docs[0].ref;
        await updateDoc(wordLimitRef, { limit: wordLimit });
      } else {
        await setDoc(doc(db, "wordlimit", "limit"), { limit: wordLimit });
      }
      alert("Word limit updated successfully");
    } catch (error) {
      console.log(error);
      alert("Failed to update word limit");
    }
  };

/*
  useEffect(() => {
    const checkAdminStatus = () => {
      if (!auth.currentUser?.uid) {
        Router.push("/login");
        return;
      }
      const adminIds = [
        "M8LwxAfm26SimGbDs4LDwf1HuCb2",
        "ow0JkUWdI9f7CTxi93JdyqarLZF3",
      ];
      if (adminIds.includes(auth.currentUser?.uid)) {
        return;
      } else {
        alert("Admins only!");
        Router.push("/login");
      }
    };
    checkAdminStatus();
  }, []);
*/
  return (
    <div className="flex h-screen items-center justify-center bg-[#fbfbfb]">
      <div className="grid w-80 grid-rows-4 gap-1">
        <p className="font-semibold text-gray-700">
          💌 Enter the new word limit:
        </p>
        <input
          type="text"
          value={wordLimit}
          onChange={handleInputChange}
          className="h-10 w-full rounded border p-2 text-sm"
          placeholder="Enter the new word limit here"
        />
        <button
          onClick={handleConfirmChange}
          className="rounded bg-[#FD5E57] text-gray-50 hover:bg-gradient-to-r hover:from-[#FD5E57] hover:to-[#FC477E]"
        >
          Confirm Change
        </button>
        <p className="mt-4 flex items-center text-xs text-gray-500 hover:text-gray-700">
          <Link href="/">Go back home</Link>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="ml-1 h-3 w-3"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
            />
          </svg>
        </p>
      </div>
    </div>
  );
}

export default WordLimit;
