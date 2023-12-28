"use client";

import Arrow from "../../../public/Arrow-Right.svg";
import Close from "../../../public/Close.svg";
import AuthInput from "../components/AuthInput";
import Language from "../components/Language";
import SubmitBtn from "../components/SubmitBtn";
import { auth, db } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [language, setLanguage] = useState("sp");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const dialog = useRef();

  useEffect(() => {
    dialog.current.showModal();
  }, []);

  const closeDialog = () => {
    dialog.current.close();
  };

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
      console.log("The email is ", email)
      console.log("The password is ", password)
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await sendEmailVerification(user);
      console.log("I have successfully sent the email verification")
      const date = new Date();
      const dateSignedUp = `${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()}`;

      await addDoc(collection(db, "users"), {
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

      router.push("/login");
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
    }
  };

  return (
    <dialog
      ref={dialog}
      className="[&::backdrop]:bg-[rgba(0,0,0,0.7)] bg-neutral-50 rounded-[10px] w-full h-[90vh] lg:w-[843px] md:h-[804px] text-Oscuro1"
    >
      <header className="flex justify-between py-4 px-4">
        <Language />
        <button onClick={closeDialog}>
          <Image src={Close} alt="" />
        </button>
      </header>
      <form className="w-3/4 lg:w-[768px] mx-auto mt-4">
        <h1 className="text-[62px] font-['Anton'] uppercase text-left leading-none">
          Obtén Tu Cuenta Gratis Ahora.
        </h1>
        <h2 className="text-[40px] font-['Antonio'] uppercase text-left tracking-tight leading-none">
          Vamos a prepararlo todo para que pueda verificar su cuenta personal y
          comenzar a configurar su perfil.
        </h2>
        <div className="w-full mt-6 [&>*]:mb-4 flex justify-center gap-10 items-center">
          <div>
            <AuthInput
              onChange={(e) => setFirstName(e.target.value)}
              placeholder={"Nombre"}
              type={"text"}
            />
            <AuthInput
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder={"Número de teléfono"}
              type={"tel"}
            />
            <AuthInput
              onChange={(e) => setPassword(e.target.value)}
              placeholder={"Contraseña"}
              type={"password"}
            />
          </div>
          <div>
            <AuthInput
              onChange={(e) => setLastName(e.target.value)}
              placeholder={"Apellido"}
              type={"text"}
            />
            <AuthInput
              onChange={(e) => setEmail(e.target.value)}
              placeholder={"Correo electrónico"}
              type={"email"}
            />
            <AuthInput
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={"Repita Contraseña"}
              type={"password"}
            />
          </div>
        </div>
        <div className="mt-16">
          <SubmitBtn onClick={onSubmit} type="submit">
            Inscribirse <Image src={Arrow} alt="" />
          </SubmitBtn>
        </div>
        <p className="text-center text-md md:text-2xl font-['Lato'] mt-6">
          ¿Ya tienes una cuenta?{" "}
          <Link href={"/login"} className="font-bold ">
            Inicia sesión
          </Link>
        </p>
      </form>
      <ToastContainer />
    </dialog>
  );
};

export default Login;
