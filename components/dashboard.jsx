import React, { useEffect } from "react";
import Link from "next/link";
import Freestyle from "@/components/Freestyle";
import Guided from "@/components/Guided";
import Keyword from "@/components/Keyword";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import { useRouter } from "next/router";
import LanguageIcon from '@mui/icons-material/Language';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LineStyleIcon from '@mui/icons-material/LineStyle';
import BatchPredictionIcon from '@mui/icons-material/BatchPrediction';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import UploadIcon from '@mui/icons-material/Upload';
import LogoutIcon from '@mui/icons-material/Logout';


function Dashboard(props) {
  const {onValueChange} = props;
  const [admin, setAdmin] = React.useState(false);
  const router = useRouter();
  const [language, setLanguage] = React.useState("spanish");
  const [mode, setMode] = React.useState("guided");
  const handleUpgrade = () => {
    onValueChange(true);
  };
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
      //console.log("Sign-out successful.");
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
      <div className="w-64 px-4" style={{ background: "rgb(40, 48, 129)" }}>
        <div className="px-2 pt-4 pb-8 ">
          <ul className="space-y-0">
            <li
              style={{
                color: "white",
                fontWeight: "bold",
                fontFamily: "Circular std bold,sans-serif",
                fontSize: "13px",
              }}
            >
              <a
                onClick={() => {
                  language === "english"
                    ? setLanguage("spanish")
                    : setLanguage("english");
                }}
                className="hover:bg-gray-500 hover:bg-opacity-30 hover:text-white-600 flex items-center justify-between py-1.5 px-4 rounded cursor-pointer"
              >
                <span className="flex items-center space-x-2">
                  <LanguageIcon />
                  <span>{language === "english" ? "Español" : "English"}</span>
                </span>
              </a>
            </li>
            <li
              style={{
                color: "white",
                fontWeight: "bold",
                fontFamily: "Monospace",
                fontSize: "13px",
              }}
            >
              <a
                onClick={() => {
                  handleUpgrade();
                }}
                className="hover:bg-gray-500 hover:bg-opacity-30 hover:text-white-600 flex items-center justify-between py-1.5 px-4 rounded cursor-pointer"
              >
                <span className="flex items-center space-x-2">
                  <UploadIcon />
                  <span
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      fontFamily: "Monospace",
                      fontSize: "13px",
                    }}
                  >
                    {language === "english" ? "Upgrade" : "Actualizar"}
                  </span>
                </span>
              </a>
            </li>
            <li
              style={{
                color: "white",
                fontWeight: "bold",
                fontFamily: "Monospace",
                fontSize: "13px",
              }}
            >
              <a
                onClick={() => {
                  setMode("guided");
                }}
                className="hover:bg-gray-500 hover:bg-opacity-30 hover:text-white-600 flex items-center justify-between py-1.5 px-4 rounded cursor-pointer"
              >
                <span className="flex items-center space-x-2">
                  <MenuBookIcon />
                  <span
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      fontFamily: "Monospace",
                      fontSize: "13px",
                    }}
                  >
                    {language === "english" ? "Guided" : "Guiado"}
                  </span>
                </span>
              </a>
            </li>

            <li>
              <a
                onClick={() => {
                  setMode("freestyle");
                }}
                style={{
                  color: "white",
                  fontWeight: "bold",
                  fontFamily: "Monospace",
                  fontSize: "13px",
                }}
                className="hover:bg-gray-500  hover:bg-opacity-30 hover:text-white-600 flex items-center text-gray-700 py-1.5 px-4 rounded space-x-2 cursor-pointer"
              >
                <LineStyleIcon />{" "}
                <span
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    fontFamily: "Monospace",
                    fontSize: "13px",
                  }}
                >
                  {language === "english" ? "Freestyle" : "Libre"}
                </span>
              </a>
            </li>
            <li>
              <a
                style={{
                  color: "white",
                  fontWeight: "bold",
                  fontFamily: "Monospace",
                  fontSize: "13px",
                }}
                onClick={() => {
                  setMode("keyword");
                }}
                className="hover:bg-gray-500 hover:bg-opacity-10 hover:text-white-600 flex items-center text-gray-700 py-1.5 px-4 rounded space-x-2 cursor-pointer"
              >
                <span style={{ fontFamily: "Monospace", fontSize: "13px" }}>
                  <BatchPredictionIcon />{" "}
                  {language === "english" ? "Keyword" : "Palabra clave"}
                </span>
              </a>
            </li>
            <li>
              <Link
                href="/tutor"
                style={{
                  color: "white",
                  fontWeight: "bold",
                  fontFamily: "Monospace",
                  fontSize: "13px",
                }}
                className="hover:bg-gray-500 hover:bg-opacity-10 hover:text-white-600 flex items-center text-gray-700 py-1.5 px-4 rounded space-x-2 cursor-pointer"
              >
                <AccessibilityNewIcon />{" "}
                <span
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    fontFamily: "Monospace",
                    fontSize: "13px",
                  }}
                >
                  {language === "english" ? "Tutor" : "Tutor"}
                </span>
              </Link>
            </li>
            {admin ? (
              <li
                style={{
                  color: "white",
                  fontWeight: "bold",
                  fontFamily: "Monospace",
                  fontSize: "13px",
                }}
              >
                <Link
                  href="/awardSubscriptions"
                  onClick={onlyAdmins}
                  className="hover:bg-gray-500 hover:bg-opacity-10 hover:text-white-600 flex items-center text-gray-700 py-1.5 px-4 rounded space-x-2 cursor-pointer"
                >
                  <span
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      fontFamily: "Monospace",
                      fontSize: "13px",
                    }}
                  >
                    Award Subscriptions
                  </span>
                </Link>
              </li>
            ) : null}
            {admin ? (
              <li
                style={{
                  color: "white",
                  fontWeight: "bold",
                  fontFamily: "Monospace",
                  fontSize: "13px",
                }}
              >
                <Link
                  href="/users"
                  onClick={onlyAdmins}
                  className="hover:bg-gray-500 hover:bg-opacity-10 hover:text-white-600 flex items-center text-gray-700 py-1.5 px-4 rounded space-x-2 cursor-pointer"
                >
                  <span
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      fontFamily: "Monospace",
                      fontSize: "13px",
                    }}
                  >
                    Manage Users
                  </span>
                </Link>
              </li>
            ) : null}
            {admin ? (
              <li
                style={{
                  color: "white",
                  fontWeight: "bold",
                  fontFamily: "Monospace",
                  fontSize: "13px",
                }}
              >
                <Link
                  href="/priceUpdates"
                  onClick={onlyAdmins}
                  className="hover:bg-gray-500 hover:bg-opacity-10 hover:text-white-600 flex items-center text-gray-700 py-1.5 px-4 rounded space-x-2 cursor-pointer"
                >
                  <span
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      fontFamily: "Monospace",
                      fontSize: "13px",
                    }}
                  >
                    Price Updates
                  </span>
                </Link>
              </li>
            ) : null}
            {admin ? (
              <li
                style={{
                  color: "white",
                  fontWeight: "bold",
                  fontFamily: "Monospace",
                  fontSize: "13px",
                }}
              >
                <Link
                  href="/wordlimit"
                  onClick={onlyAdmins}
                  className="hover:bg-gray-500 hover:bg-opacity-10 hover:text-white-600 flex items-center text-gray-700 py-1.5 px-4 rounded space-x-2 cursor-pointer"
                >
                  <span
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      fontFamily: "Monospace",
                      fontSize: "13px",
                    }}
                  >
                    Word Limit
                  </span>
                </Link>
              </li>
            ) : null}

            <li>
              <a
                style={{
                  color: "white",
                  fontWeight: "bold",
                  fontFamily: "Circular std bold,sans-serif",
                  fontSize: "13px",
                }}
                onClick={signout}
                className="hover:bg-gray-500 hover:bg-opacity-10 hover:text-white-600 flex items-center text-gray-700 py-1.5 px-4 rounded space-x-2 cursor-pointer"
              >
                <span
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    fontFamily: "Monospace",
                    fontSize: "13px",
                  }}
                >
                  <LogoutIcon />{" "}
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
