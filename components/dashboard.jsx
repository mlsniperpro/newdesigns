import React from "react";
import Image from "next/image";
import Link from "next/link";
import Freestyle from "@/components/Freestyle";
import Guided from "@/components/Guided";
import Keyword from "@/components/Keyword";
import Navbar from "@/components/Navbar";
import { signOut } from "firebase/auth";
//import Tutor from "@/components/Tutor";
import { auth } from "../config/firebase";
import { useRouter } from "next/router";
import Tutor from "@/pages/tutor";

function Dashboard() {
  const router = useRouter();
  const [mode, setMode] = React.useState("guided");

  const signout = async() => {
    await signOut(auth)
    .then(() => {
      // Sign-out successful.
      console.log("Sign-out successful.");
      router.push("/login")
    }).catch((error) => {
      // An error happened.
      console.log(error);
    });
  }


  return (
    <div className="w-full bg-white shadow-xl rounded-lg flex overflow-x-auto custom-scrollbar">
      <div className="w-64 px-4">
        <div className="px-2 pt-4 pb-8 border-r border-gray-300">
          <ul className="space-y-0">
            <li>
              <a
                onClick={() => {
                  setMode("guided");
                }}
                className="hover:bg-gray-500 hover:bg-opacity-30 hover:text-blue-600 flex items-center justify-between py-1.5 px-4 rounded cursor-pointer"
              >
                <span className="flex items-center space-x-2">
                  <span>Guided</span>
                </span>
              </a>
            </li>
            <li>
              <a
                onClick={() => {
                  setMode("freestyle");
                }}
                className="hover:bg-gray-500  hover:bg-opacity-30 hover:text-blue-600 flex items-center text-gray-700 py-1.5 px-4 rounded space-x-2 cursor-pointer"
              >
                <span>Free Style</span>
              </a>
            </li>
            <li>
              <a
                onClick={() => {
                  setMode("keyword");
                }}
                className="hover:bg-gray-500 hover:bg-opacity-10 hover:text-blue-600 flex items-center text-gray-700 py-1.5 px-4 rounded space-x-2 cursor-pointer"
              >
                <span>Keyword</span>
              </a>
            </li>
            <li >
              <Link href="/tutor" className="hover:bg-gray-500 hover:bg-opacity-10 hover:text-blue-600 flex items-center text-gray-700 py-1.5 px-4 rounded space-x-2 cursor-pointer">
                <span>Tutor</span>
              </Link>
            </li>

            <li>
              <a
                onClick={signout}
                className="hover:bg-gray-500 hover:bg-opacity-10 hover:text-blue-600 flex items-center text-gray-700 py-1.5 px-4 rounded space-x-2 cursor-pointer"
              >
                <span>Log Out</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div>
        {mode === "guided" ? (
          <Guided />
        ) : mode === "freestyle" ? (
          <Freestyle />
        ) : mode === "keyword" ? (
          <Keyword />
        ) : mode === "tutor" ? (
          router.push("/tutor")
        ) : (
          <Guided />
        )}
      </div>
    </div>
  );
}

export default Dashboard;
