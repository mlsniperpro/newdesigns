"use client"
import Language from "../components/Language";
import Logo from "../../../public/Logo-Blue.svg";
import Warning from "../../../public/Warning.png";
import Ellipse from "../../../public/Ellipse 3.svg"
import Image from "next/image";
import { useState } from "react";

const page = () => {
  const [activeSub, setActiveSub] = useState(1)
  const [hiddenSubs, setHiddenSubs] = useState([2, 3])
  return (
    <div>
      <div className="absolute top-6 left-8 hidden md:block">
        <Language />
      </div>
      <div className="absolute top-6 right-10 w-32 lg:w-[175px] hidden md:block">
        <Image src={Logo} alt=""/>
      </div>
      <h1 className="text-center text-Oscuro1 text-4xl md:text-[62px] font-normal font-['Anton'] uppercase leading-none md:leading-[64px] mt-6 md:mt-24">
        Seleccionar Plan de Suscripción
      </h1>
      <h2 className="text-center text-Coporativo2 text-xl md:text-[40px] font-normal font-['Antonio'] uppercase leading-none mt-3 md:mt-0 md:leading-[44px]">
        Elige el plan que mejor se adapte a ti. Siempre puedes cambiarlo más
        tarde.
      </h2>
      <div className="flex justify-center items-center mt-5">
        <button className="bg-Coporativo1 text-Blanco uppercase font-['Anton'] text-2xl px-10 py-2.5 rounded-[10px] mx-auto">
          Área de miembros
        </button>
      </div>
      <div className={`flex gap-3 xl:gap-10 lg:[&>*:nth-child(1)]:block lg:[&>*:nth-child(3)]:block lg:[&>*:nth-child(2)]:block justify-center items-stretch mt-3 lg:mt-11 lg:flex-row [&>*:nth-child(${hiddenSubs[0]})]:hidden [&>*:nth-child(${hiddenSubs[1]})]:hidden [&>*:nth-child(${activeSub})]:block`}>
        <SubscriptionCard isBasic={true} isMensual={false} isAnual={false}>
          <ol className=" list-decimalml-4 text-sm lg:text-2xl">
            <li className="mb-2 lg:mb-3">
              Obtén una guía profesional paso a paso de un tutor basado en
              Inteligencia Artificial, para crear redacciones publicitarias de
              excelente calidad.
            </li>
            <li className="mb-2 lg:mb-3">
              Ahorra tiempo al seleccionar opciones y campos preestablecidos
              para obtener redacciones publicitarias de forma rápida y
              eficiente.
            </li>
            <li className="mb-2 lg:mb-3">
              Genera una orden basada en texto de tu idea publicitaria y obtén
              una redaccion lista en tiempo récord.
            </li>
            <li className="mb-2 lg:mb-3">
              Optimiza tus resultados al utilizar un generador de ideas
              publicitarias basadas en palabras clave relevantes para tu
              audiencia y objetivos de marketing.
            </li>
          </ol>
        </SubscriptionCard>
        <SubscriptionCard isBasic={false} isMensual={true} isAnual={false}>
          <p className="text-sm lg:text-2xl">
            7 días de bonificación gratis además de la activación de 1 mes
          </p>
        </SubscriptionCard>
        <SubscriptionCard isBasic={false} isMensual={false} isAnual={true}>
          <p>2 meses de acceso gratuito</p>
        </SubscriptionCard>
      </div>
      <div className="flex justify-center items-center gap-5 py-3 lg:hidden">
        <Image src={Ellipse} onClick={()=> {setActiveSub(1); setHiddenSubs([2, 3])}} alt=""/>
        <Image src={Ellipse} onClick={()=> {setActiveSub(2); setHiddenSubs([1, 3])}} alt=""/>
        <Image src={Ellipse} onClick={()=> {setActiveSub(3); setHiddenSubs([1, 2])}} alt=""/>
      </div>
    </div>
  );
};

const SubscriptionCard = ({ children, isBasic, isMensual, isAnual }) => {
  return (
    <div
      className={`grow basis-0 py-5 min-h-[470px] lg:h-auto ${
        isBasic ? "px-4" : "px-10"
      } max-w-[561px] rounded-[10px] ${
        isBasic
          ? "bg-slate-300 bg-opacity-60"
          : isMensual
          ? "bg-Claro1"
          : "bg-Oscuro1"
      }`}
    >
      <div
        className={`${isAnual ? "text-Claro1" : "text-Oscuro1"} text-center`}
      >
        <span className="opacity-60 text-2xl font-normal font-['Lato'] leading-loose">
          {isBasic ? "Básico" : isMensual ? "Mensual" : "Anual"}
        </span>
        <h2 className="text-8xl font-['Anton'] uppercase">
          {isBasic ? "Gratis" : isMensual ? "50 USD" : "500 USD"}
        </h2>
      </div>
      <div
        className={`mt-3 text-center ${
          isBasic ? "py-2 px-3" : "py-6 px-7"
        } rounded-[10px] text-['Lato] text-2xl bg-opacity-60 ${
          isMensual ? " bg-gray-700" : "bg-slate-300"
        } ${isMensual ? "text-neutral-50" : "text-gray-700"}`}
      >
        <p className="font-bold">{isBasic ? "4 Funciones" : "Uso Ilimitado"}</p>
        <p>
          {isBasic
            ? "Estos son los beneficios que obtienes cuando te registras de forma gratuita"
            : "Ilimitado Activación de 1 mes"}
        </p>
      </div>
      <div
        className={`flex flex-col justify-between items-center h-[280px] lg:h-3/5 ${
          isBasic ? "pt-3" : "lg:mt-16 lg:pt-20 pt-14"
        }`}
      >
        <div
          className={`text-xl font-normal font-['Lato'] leading-7 flex justify-center items-center ${
            isAnual ? "text-Claro1" : "text-Oscuro1"
          } ${isBasic ? "text-left" : "text-center"}`}
        >
          {children}
        </div>
        <div>
          <span
            className={`text-xl font-normal font-['Lato'] leading-7 flex justify-center items-center ${
              isAnual ? "text-Claro1" : "text-Oscuro1"
            }`}
          >
            {isBasic ? "" : "2 meses de acceso gratuito"}
          </span>
          {isBasic && (
            <div className="flex gap-4 px-5 py-4 justify-center items-center bg-neutral-50 rounded-[10px] border-b border-slate-300">
              <Image src={Warning} alt=""/>
              <p className="text-Oscuro1 text-base font-semibold font-['Lato'] leading-tight">
                Ha alcanzado el límite gratuito de uso disponible para este mes
              </p>
            </div>
          )}
          {!isBasic && (
            <button className="px-10 py-2.5 bg-Coporativo2 rounded-[10px] uppercase text-Blanco text-2xl font-['Anton'] leading-[44px] mt-3">
              MejorAR A ESTE PLAN
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
