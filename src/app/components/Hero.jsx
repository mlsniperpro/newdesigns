import Image from "next/image";
import React from "react";
import logo from "../../../public/Logo.svg";
import logoDark from "../../../public/logo_dark.svg";
import rocket from "../../../public/Rocket.svg";
import register from "../../../public/Register.svg";
import Language from "./Language";

const Hero = () => {
  return (
    <div className="relative">
      <div className="bg-Coporativo1 flex justify-center items-center h-[100svh]">
        <div className="absolute right-[2rem] top-[1.1875rem] sm:right-[1.4375rem] text-white">
          <Language />
        </div>
        <div className="flex flex-col justify-center items-center sm:mb-[24vh]">
          <Image
            src={logo}
            className="w-[13.8125rem] h-[5.3125rem] mb-5 sm:w-[32rem] sm:mb-8 sm:h-auto"
          />
          <div className="text-center text-white mb-32 sm:mb-10">
            <h3 className="text-4xl font-normal font-['Antonio'] uppercase mb-4">
              Desbloquea el poder de la
            </h3>
            <h1 className="text-center text-white text-5xl font-normal font-['Anton'] uppercase mb-1 sm:text-6xl">
              Inteligencia Artificial
            </h1>
            <h2 className="text-center text-white text-[32px] font-semibold font-['Antonio'] uppercase">
              empieza totalmente gratis
            </h2>
          </div>
          <div className="flex flex-col gap-3 justify-center sm:flex-row relative sm:gap-12">
            <a
              href="/"
              className="text-white text-2xl font-light font-['Lato'] flex justify-center items-center gap-5 border py-3 px-11 sm:px-6 sm:text-xl"
            >
              Iniciar sesión
              <Image src={rocket} />
            </a>
            <a
              href="/"
              className="text-white text-2xl font-light font-['Lato'] flex justify-center items-center gap-0 border py-3 px-11 sm:px-6 sm:text-xl"
            >
              Regístrate &nbsp;<span className="font-bold">¡ gratis!</span>
              <Image src={register} className="ml-5" />
            </a>
            <p className="text-neutral-50 text-base font-normal font-['Lato'] text-center sm:absolute -bottom-10 right-0">
              No se requiere tarjeta de crédito
            </p>
          </div>
        </div>
      </div>
      <div className="px-11 py-14 bg-gradient-to-r from-teal-400 to-amber-200 shadow-[15px_15px_0px_15px_rgba(0,0,0,0.3)]  mr-[2%] sm:absolute sm:-bottom-[25vh] lg:w-[60rem] sm:w-[90vw] sm:left-[50%] sm:-translate-x-[50%] sm:px-20 sm:py-10 sm:shadow-[15px_15px_0px_0px_rgba(0,0,0,0.3)]">
        <div class="flex flex-col justify-start items-center gap-6 px-5">
          <h1 class="text-center text-gray-700 text-5xl font-normal font-['Anton'] uppercase leading-[48px]">
            TOUR COMPLETO por el ECOSISTEMA del CHATVIONIKO
          </h1>
          <p class="text-center text-gray-700 text-2xl font-normal font-['Lato'] leading-9">
            Descubre las multiples funciones disponibles que hay, para usar el
            poder de la inteligencia artificial y disparar tu productividad e
            ingresos.
          </p>
          <Image src={logoDark} className="w-[7.18rem] h-11 mt-3" />
        </div>
      </div>
    </div>
  );
};

export default Hero;
