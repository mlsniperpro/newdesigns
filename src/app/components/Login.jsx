"use client";
import { useEffect, useRef } from "react";
import Language from "./Language";
import Image from "next/image";
import Close from "../../../public/Close.svg";
import Google from "../../../public/Google.svg";
import AuthInput from "./AuthInput";
import SubmitBtn from "./SubmitBtn";
import Link from "next/link";

const Login = () => {
  const dialog = useRef();

  useEffect(() => {
    dialog.current.showModal();
  }, []);

  const closeDialog = () => {
    dialog.current.close();
  }
  return (
    <dialog
      ref={dialog}
      className="[&::backdrop]:bg-[rgba(0,0,0,0.7)] bg-neutral-50 rounded-[10px] w-full h-[90vh] md:w-[735px] md:h-[804px] text-Oscuro1"
    >
      <header className="flex justify-between py-4 px-4">
        <Language />
        <button onClick={closeDialog}>
          <Image src={Close} alt=""/>
        </button>
      </header>
      <main className="w-3/4 md:w-[526px] mx-auto">
        <h1 className="text-[62px] font-['Anton'] uppercase text-center">
          Iniciar sesión
        </h1>
        <button className="flex gap-3 justify-center items-center bg-Claro1 rounded-[10px] h-[71px] w-full">
          <Image src={Google} alt=""/>
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
