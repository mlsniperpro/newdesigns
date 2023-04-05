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
  const [language, setLanguage] = React.useState("spanish");
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
                  language === "english"
                    ? setLanguage("spanish")
                    : setLanguage("english");
                }}
                className="hover:bg-gray-500 hover:bg-opacity-30 hover:text-blue-600 flex items-center justify-between py-1.5 px-4 rounded cursor-pointer"
              >
                <span className="flex items-center space-x-2">
                  <span>{language === "english" ? "English" : "Spanish"}</span>
                </span>
              </a>
            </li>
            <li></li>
            <li>
              <a
                onClick={() => {
                  setMode("guided");
                }}
                className="hover:bg-gray-500 hover:bg-opacity-30 hover:text-blue-600 flex items-center justify-between py-1.5 px-4 rounded cursor-pointer"
              >
                <span className="flex items-center space-x-2">
                  <span>{language === "english" ? "Guided" : "Guiado"}</span>
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
                <span>{language === "english" ? "Freestyle" : "Libre"}</span>
              </a>
            </li>
            <li>
              <a
                onClick={() => {
                  setMode("keyword");
                }}
                className="hover:bg-gray-500 hover:bg-opacity-10 hover:text-blue-600 flex items-center text-gray-700 py-1.5 px-4 rounded space-x-2 cursor-pointer"
              >
                <span>
                  {language === "english" ? "Keyword" : "Palabra clave"}
                </span>
              </a>
            </li>
            <li>
              <Link
                href="/tutor"
                className="hover:bg-gray-500 hover:bg-opacity-10 hover:text-blue-600 flex items-center text-gray-700 py-1.5 px-4 rounded space-x-2 cursor-pointer"
              >
                <span>{language === "english" ? "Tutor" : "Tutor"}</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin"
                className="hover:bg-gray-500 hover:bg-opacity-10 hover:text-blue-600 flex items-center text-gray-700 py-1.5 px-4 rounded space-x-2 cursor-pointer"
              >
                <span>{language === "english" ? "Admin" : "Admin"}</span>
              </Link>
            </li>

            <li>
              <a
                onClick={signout}
                className="hover:bg-gray-500 hover:bg-opacity-10 hover:text-blue-600 flex items-center text-gray-700 py-1.5 px-4 rounded space-x-2 cursor-pointer"
              >
                <span>
                  {language === "english" ? "Log Out" : "Cerrar sesión"}
                </span>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div>
        {mode === "guided" ? (
          <Guided language={language} />
        ) : mode === "freestyle" ? (
          <Freestyle language={language} />
        ) : mode === "keyword" ? (
          <Keyword language={language} />
        ) : mode === "tutor" ? (
          router.push("/tutor")
        ) : (
          <Guided language={language} />
        )}
      </div>
    </div>
  );
}

export default Dashboard;
