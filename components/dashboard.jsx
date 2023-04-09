import React, { useEffect } from "react";
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
  const [admin, setAdmin] = React.useState(true);
  const router = useRouter();
  const [language, setLanguage] = React.useState("spanish");
  const [mode, setMode] = React.useState("guided");

  function checkIfAdmin(){
    if (
    auth.currentUser?.uid === "M8LwxAfm26SimGbDs4LDwf1HuCb2" ||
    auth.currentUser?.uid === "ow0JkUWdI9f7CTxi93JdyqarLZF3"
  ) {
    setAdmin(true);
    return;
  }
}
useEffect(() => {
  checkIfAdmin()
}, [])

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
function onlyAdmins() {
  if (
    auth.currentUser?.uid === "M8LwxAfm26SimGbDs4LDwf1HuCb2" ||
    auth.currentUser?.uid === "ow0JkUWdI9f7CTxi93JdyqarLZF3"
  ) {
    setAdmin(true);
    return;
  } else {
    alert("Admins only!");
    Router.push("/login");
  }
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
            {admin ? (
              <li>
                <Link
                  href="/awardSubscriptions"
                  onClick={onlyAdmins}
                  className="hover:bg-gray-500 hover:bg-opacity-10 hover:text-blue-600 flex items-center text-gray-700 py-1.5 px-4 rounded space-x-2 cursor-pointer"
                >
                  <span>Award Subscriptions</span>
                </Link>
              </li>
            ) : null}
            {admin ? (
              <li>
                <Link
                  href="/users"
                  onClick={onlyAdmins}
                  className="hover:bg-gray-500 hover:bg-opacity-10 hover:text-blue-600 flex items-center text-gray-700 py-1.5 px-4 rounded space-x-2 cursor-pointer"
                >
                  <span>Manage Users</span>
                </Link>
              </li>
            ) : null}

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
