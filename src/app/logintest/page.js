"use client";

import Close from "../../../public/Close.svg";
import Google from "../../../public/Google.svg";
import AuthInput from "../components/AuthInput";
import Language from "../components/Language";
import SubmitBtn from "../components/SubmitBtn";
import {
  checkIfUserDisabled,
  signInUser,
  signInWithGoogle,
} from "@/app/utils/firebaseOperations";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [language, setLanguage] = useState("sp");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dialog = useRef();

  useEffect(() => {
    dialog.current.showModal();
  }, []);

  const closeDialog = () => {
    dialog.current.close();
  };

  const signIn = (e) => {
    e.preventDefault();

    signInUser(email, password)
      .then((user) => {
        if (!user.emailVerified) {
          const alertMessage =
            language === "en"
              ? "Please verify your email address"
              : "Por favor verifica tu correo electrónico";
          alert(alertMessage);
          return;
        }

        checkIfUserDisabled(user, router)
          .then((isDisabled) => {
            if (isDisabled) {
              toast.error("User is disabled");
              // Handle disabled user (e.g., show an error message)
            } else {
              toast.success("Login Successfull");
              // Set the auth cookie
              setCookie(null, "auth", user.uid, {
                maxAge: 30 * 24 * 60 * 60, // 30 days
                path: "/",
              });
            }
          })
          .catch((error) => {
            console.error("Error checking if user is disabled:", error);
          });
      })

      .catch((error) => {
        console.error("Error signing in:", error);
      });
  };

  const signInWithGoogleClick = () => {
    signInWithGoogle()
      .then((user) => {
        checkIfUserDisabled(user, router)
          .then((isDisabled) => {
            router.push("/chat");
            if (isDisabled) {
              toast.error("User is disabled");
            } else {
              toast.success("Login Successfull");
              setCookie(null, "auth", user.uid, {
                maxAge: 30 * 24 * 60 * 60, // 30 days
                path: "/",
              });
            }
          })

          .catch((error) => {
            console.error("Error checking if user is disabled:", error);
          });
      })
      .catch((error) => {
        console.error("Error signing in with Google:", error);
      });
  };
  return (
    <dialog
      ref={dialog}
      className="[&::backdrop]:bg-[rgba(0,0,0,0.7)] bg-neutral-50 rounded-[10px] w-full h-[90vh] md:w-[735px] md:h-[804px] text-Oscuro1"
    >
       <ToastContainer />
      <header className="flex justify-between py-4 px-4">
        <Language />
        <button onClick={closeDialog}>
          <Image src={Close} alt="" />
        </button>
      </header>
      <main className="w-3/4 md:w-[526px] mx-auto">
        <h1 className="text-[62px] font-['Anton'] uppercase text-center">
          Iniciar sesión
        </h1>
        <button className="flex gap-3 justify-center items-center bg-Claro1 rounded-[10px] h-[71px] w-full">
          <Image src={Google} alt="" />
          <span className="text-md md:text-2xl font-['Lato'] leading-loose">
            Iniciar sesión con Google
          </span>
        </button>
        <h2 className="text-[40px] font-['Antonio'] uppercase text-center tracking-tight">
          Bienvenido de vuelta a Vioniko 👋
        </h2>
        <div className="w-full mt-6 [&>*]:mb-4">
          <AuthInput placeholder={"Correo electrónico"} type={"text"} />
          <AuthInput placeholder={"Contraseña"} type={"password"} />
        </div>
        <div className="flex justify-between items-center mt-7">
          <div className="flex justify-center items-center gap-2">
            <input type="checkbox" className="accent-Claro1 w-6 h-6" />
            <label className="text-md md:text-2xl font-normal font-['Lato']">
              Recuérdame
            </label>
          </div>
          <p className="text-md md:text-2xl font-bold font-['Lato']">
            ¿Olvidaste tu contraseña?
          </p>
        </div>
        <div className="mt-5">
          <SubmitBtn>Inicia sesión</SubmitBtn>
        </div>
        <p className="text-center text-md md:text-2xl font-['Lato'] mt-2">
          ¿No tienes una cuenta?{" "}
          <Link href={"/"} className="font-bold ">
            Regístrate
          </Link>
        </p>
      </main>
    </dialog>
  );
};

export default Login;
