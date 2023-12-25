"use client";

// Ensure you import setCookie from the correct location
// import { setCookie } from 'path-to-setCookie-function';
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
    if (dialog.current) {
      dialog.current.showModal();
    }
  }, []);

  const closeDialog = () => {
    if (dialog.current) {
      dialog.current.close();
    }
  };

  const signIn = async (e) => {
    e.preventDefault();

    try {
      const user = await signInUser(email, password);
      if (!user.emailVerified) {
        const alertMessage =
          language === "en"
            ? "Please verify your email address"
            : "Por favor verifica tu correo electrónico";
        alert(alertMessage);
        return;
      }

      const isDisabled = await checkIfUserDisabled(user, router);
      if (isDisabled) {
        toast.error("User is disabled");
      } else {
        toast.success("Login Successful");
        setCookie(null, "auth", user.uid, {
          maxAge: 30 * 24 * 60 * 60, // 30 days
          path: "/",
        });
      }
    } catch (error) {
      console.error("Error signing in:", error);
      toast.error("Error during sign in");
    }
  };

  const signInWithGoogleClick = async () => {
    try {
      const user = await signInWithGoogle();
      const isDisabled = await checkIfUserDisabled(user, router);
      if (isDisabled) {
        toast.error("User is disabled");
      } else {
        toast.success("Login Successful");
        setCookie(null, "auth", user.uid, {
          maxAge: 30 * 24 * 60 * 60, // 30 days
          path: "/",
        });
        router.push("/chat");
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);
      toast.error("Error during Google sign in");
    }
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
          <Image src={Close} alt="Close" />
        </button>
      </header>
      <main className="w-3/4 md:w-[526px] mx-auto">
        <h1 className="text-[62px] font-['Anton'] uppercase text-center">
          Iniciar sesión
        </h1>
        <button
          onClick={signInWithGoogleClick}
          className="flex gap-3 justify-center items-center bg-Claro1 rounded-[10px] h-[71px] w-full"
        >
          <Image src={Google} alt="Sign in with Google" />
          <span className="text-md md:text-2xl font-['Lato'] leading-loose">
            Iniciar sesión con Google
          </span>
        </button>
        <h2 className="text-[40px] font-['Antonio'] uppercase text-center tracking-tight">
          Bienvenido de vuelta a Vioniko 👋
        </h2>
        <div className="w-full mt-6 [&>*]:mb-4">
          <AuthInput
            onChange={(e) => setEmail(e.target.value)}
            placeholder={"Correo electrónico"}
            type={"text"}
          />
          <AuthInput
            onChange={(e) => setPassword(e.target.value)}
            placeholder={"Contraseña"}
            type={"password"}
          />
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
          <SubmitBtn onClick={signIn}>
            Inicia sesión
          </SubmitBtn>
        </div>
        <p className="text-center text-md md:text-2xl font-['Lato'] mt-2">
          ¿No tienes una cuenta?{" "}
          <Link href={"/"}>
            <span className="font-bold ">Regístrate</span>
          </Link>
        </p>
      </main>
    </dialog>
  );
};

export default Login;
