import React from "react";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useState } from "react";
import { auth, db } from "../config/firebase";
import { useRouter } from "next/router";
import { collection, addDoc } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import LanguageIcon from "@mui/icons-material/Language";

function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [language, setLanguage] = useState("sp");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const onSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      const message =
        language === "sp"
          ? "Las contraseñas no coinciden"
          : "Passwords do not match";
      toast.error(message);
      return;
    }

    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await sendEmailVerification(user);

      const date = new Date();
      const dateSignedUp = `${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()}`;

      const docRef = await addDoc(collection(db, "users"), {
        userId: user.uid,
        email,
        firstName,
        lastName,
        name: `${firstName} ${lastName}`,
        phoneNumber,
        dateSignedUp,
      });

      const toastMessage =
        language === "sp"
          ? "Verifique su correo electrónico"
          : "Please verify your email";
      toast.success(toastMessage);

      console.log("Document written with ID: ", docRef.id);

      // Trigger Rewardful conversion event after user account is successfully created.
      setTimeout(async () => {
        if (window.Rewardful?.referral) {
          console.log("Rewardful referral", window.Rewardful.referral);
          window.rewardful("convert", { ["email"]: email });
        }

        router.push("/login");
      }, 5000);
    } catch (e) {
      let errorMessage;
      switch (e.code) {
        case "auth/email-already-in-use":
          errorMessage =
            language === "sp"
              ? "El correo electrónico ya está en uso."
              : "The email address is already in use.";
          break;
        case "auth/invalid-email":
          errorMessage =
            language === "sp"
              ? "El correo electrónico no es válido."
              : "The email address is not valid.";
          break;
        case "auth/operation-not-allowed":
          errorMessage =
            language === "sp"
              ? "La operación no está permitida."
              : "The operation is not allowed.";
          break;
        case "auth/weak-password":
          errorMessage =
            language === "sp"
              ? "La contraseña es demasiado débil."
              : "The password is too weak.";
          break;
        default:
          errorMessage =
            language === "sp" ? "Algo salió mal." : "Something went wrong.";
      }
      toast.error(errorMessage);
      console.error("Error: ", e);
    }
  };

  return (
    <section style={{ background: "white", fontFamily: "Monospace" }}>
      <ToastContainer />
      <div className="flex justify-center min-h-screen">
        {/* <div
          className="hidden bg-cover lg:block lg:w-2/5"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1494621930069-4fd4b2e24a11?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=715&q=80')",
          }}
        ></div> */}

        <div
          className="flex items-center w-full max-w-3xl p-8 mx-auto lg:px-12 lg:w-3/5"
          style={{
            border: "1px solid white",
            background: "rgb(40,48,129",
            borderRadius: "15px",
          }}
        >
          <div className="w-full">
            <h1
              className="text-2xl font-semibold tracking-wider text-gray-800 capitalize "
              style={{
                fontSize: "30px",
                fontFamily: "Monospace",
                color: "white",
              }}
            >
              {language === "sp"
                ? "→ Obtén tu cuenta gratis ahora."
                : " Get your free account now."}
            </h1>

            <p
              className="mt-4"
              style={{
                color: "white",
                fontFamily: "Monospace",
                fontSize: "20px",
              }}
            >
              {language === "sp"
                ? " Vamos a prepararlo todo para que pueda verificar su cuenta personal y comenzar a configurar su perfil."
                : " Let’s get you all set up so you can verify your personal account and begin setting up your profile."}
            </p>
            <br></br>
            <button
              onClick={() =>
                language === "sp" ? setLanguage("en") : setLanguage("sp")
              }
              style={{
                background: "white",
                color: "rgb(40,48,129)",
                height: "35px",
                width: "200px",
                borderRadius: "5px",
                fontFamily: "monospace",
                fontSize: "20px",
              }}
            >
              <LanguageIcon /> {language === "sp" ? "English" : "Spanish"}
            </button>

            <div className="mt-6">
              <h1
                style={{
                  color: "white",
                  fontFamily: "Monospace",
                  fontSize: "20px",
                }}
              >
                <AccountCircleIcon style={{ marginRight: "10px" }} />
                {language === "sp"
                  ? " Ya tienes una cuentas"
                  : " Already have an account"}
              </h1>

              <div className="mt-3 md:flex md:items-center md:-mx-2">
                <button
                  className="flex justify-center w-full px-6 py-3 mt-4 text-blue-500 border border-blue-500 rounded-md md:mt-0 md:w-auto md:mx-2 "
                  style={{
                    color: "black",
                    background: "white",
                    border: "none",
                    width: "150px",
                    height: "50px",
                    fontFamily: "Circular std bold,sans-serif",
                    fontSize: "20px",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <Link
                    href="/login"
                    style={{ fontFamily: "Monospace", fontSize: "20px" }}
                  >
                    <span className="mx-2" style={{ fontFamily: "Monospace" }}>
                      {language === "sp" ? " Acceso" : " Login"}
                    </span>
                  </Link>
                </button>
              </div>
            </div>

            <form
              noValidate
              className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2"
            >
              <div>
                <label
                  htmlFor="first-name"
                  className="block mb-2 "
                  style={{
                    color: "white",
                    fontFamily: "Monospace",
                    fontSize: "20px",
                  }}
                >
                  {language === "sp" ? " → Nombre de pila" : " → First Name"}
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First Name"
                  className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                  style={{
                    background: "white",
                    color: "black",
                    border: "none",
                    fontFamily: "Monospace",
                    fontSize: "20px",
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="last-name"
                  className="block mb-2 "
                  style={{
                    color: "white",
                    fontFamily: "Monospace",
                    fontSize: "20px",
                  }}
                >
                  {language === "sp" ? " → Apellido" : " → Last name"}
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last Name"
                  className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                  style={{
                    background: "white",
                    color: "black",
                    border: "none",
                    fontFamily: "Monospace",
                    fontSize: "20px",
                  }}
                />
              </div>

              <div>
                <label
                  className="block mb-2 "
                  style={{
                    color: "white",
                    fontFamily: "Monospace",
                    fontSize: "20px",
                  }}
                >
                  {language === "sp"
                    ? " → Número de teléfono"
                    : "  → Phone number"}
                </label>
                <input
                  type="text"
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  value={phoneNumber}
                  placeholder="XXX-XX-XXXX-XXX"
                  className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                  style={{
                    background: "white",
                    color: "black",
                    border: "none",
                    fontFamily: "Monospace",
                    fontSize: "20px",
                  }}
                />
              </div>

              <div>
                <label
                  className="block mb-2 "
                  style={{
                    color: "white",
                    fontFamily: "Monospace",
                    fontSize: "20px",
                  }}
                >
                  {language === "sp"
                    ? " → dirección de correo electrónico"
                    : "  → Email address"}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                  style={{
                    background: "white",
                    color: "black",
                    border: "none",
                    fontFamily: "Monospace",
                    fontSize: "20px",
                  }}
                />
              </div>

              <div>
                <label
                  className="block mb-2 "
                  style={{
                    color: "white",
                    fontFamily: "Monospace",
                    fontSize: "20px",
                  }}
                >
                  {language === "sp" ? " → contraseña" : "   → Password"}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                  style={{
                    background: "white",
                    color: "black",
                    border: "none",
                    fontFamily: "Monospace",
                    fontSize: "20px",
                  }}
                />
              </div>

              <div>
                <label
                  className="block mb-2 "
                  style={{
                    color: "white",
                    fontFamily: "Monospace",
                    fontSize: "20px",
                  }}
                >
                  {language === "sp"
                    ? " → confirmar Contraseña"
                    : "   → Confirm Password"}
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                  style={{
                    background: "white",
                    color: "black",
                    border: "none",
                    fontFamily: "Monospace",
                    fontSize: "20px",
                  }}
                />
              </div>

              <button
                onClick={onSubmit}
                className="flex items-center justify-center  text-sm tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-md hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                style={{
                  color: "rgb(40, 48, 129)",
                  background: "white",
                  border: "none",
                  width: "150px",
                  height: "50px",
                  textAlign: "center",
                  fontFamily: "Monospace",
                  fontSize: "20px",
                }}
              >
                <span style={{ fontFamily: "Monospace" }}>
                  <HowToRegIcon style={{ marginRight: "10px" }} />

                  {language === "sp" ? "  Inscribirse" : "   Sign Up "}
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Signup;
