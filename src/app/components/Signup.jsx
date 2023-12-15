"use client";
import { useEffect, useRef } from "react";
import Language from "./Language";
import Image from "next/image";
import Close from "../../../public/Close.svg";
import Arrow from "../../../public/Arrow-Right.svg";
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
  };
  return (
    <dialog
      ref={dialog}
      className="[&::backdrop]:bg-[rgba(0,0,0,0.7)] bg-neutral-50 rounded-[10px] w-full h-[90vh] lg:w-[843px] md:h-[804px] text-Oscuro1"
    >
      <header className="flex justify-between py-4 px-4">
        <Language />
        <button onClick={closeDialog}>
          <Image src={Close} />
        </button>
      </header>
      <main className="w-3/4 lg:w-[768px] mx-auto mt-4">
        <h1 className="text-[62px] font-['Anton'] uppercase text-left leading-none">
          Obtén Tu Cuenta Gratis Ahora.
        </h1>
        <h2 className="text-[40px] font-['Antonio'] uppercase text-left tracking-tight leading-none">
          Vamos a prepararlo todo para que pueda verificar su cuenta personal y
          comenzar a configurar su perfil.
        </h2>
        <div className="w-full mt-6 [&>*]:mb-4 flex justify-center gap-10 items-center">
          <div>
            <AuthInput placeholder={"Nombre"} type={"text"} />
            <AuthInput placeholder={"Número de teléfono"} type={"tel"} />
            <AuthInput placeholder={"Contraseña"} type={"password"} />
          </div>
          <div>
            <AuthInput placeholder={"Apellido"} type={"text"} />
            <AuthInput placeholder={"Correo electrónico"} type={"password"} />
            <AuthInput placeholder={"Repita Contraseña"} type={"password"} />
          </div>
        </div>
        <div className="mt-16">
          <SubmitBtn>
            Inscribirse <Image src={Arrow} />
          </SubmitBtn>
        </div>
        <p className="text-center text-md md:text-2xl font-['Lato'] mt-6">
          ¿Ya tienes una cuenta?{" "}
          <Link href={"/"} className="font-bold ">
            Inicia sesión
          </Link>
        </p>
      </main>
    </dialog>
  );
};

export default Login;
