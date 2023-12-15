import Image from "next/image";
import RegisterBlue from "../../../public/Register_Blue.svg";
import Captcha from "../../../public/captcha.png";
import Input from "./Input";

const Footer = () => {
  return (
    <div className="bg-slate-300 flex justify-center items-center gap-10 py-10 md:py-24 md:px-24 bg-footer bg-cover bg-center md:flex-row flex-col">
      <div className="text-Oscuro1 lg:w-1/2 mx-10">
        <h2 className="texto2 !text-4xl uppercase !leading-none lg:w-1/2 mb-5">
          ¿Listo para llevar tu Marketing al siguiente nivel?
        </h2>
        <div className="list-img texto-contenido mb-5">
          <li>&nbsp;&nbsp;No se ocupa tarjeta de crédito</li>
          <li>&nbsp;&nbsp;2,000 palabras gratis por mes</li>
          <li>&nbsp;&nbsp;Múltiples funciones disponibles</li>
        </div>
        <div className="flex gap-5">
          <div className=" text-slate-700 text-xl font-normal font-['Lato'] leading-loose">
            Regístrate <span className="font-bold">¡gratis!</span>
          </div>
          <Image src={RegisterBlue} />
        </div>
      </div>
      <div className="p-5 bg-Coporativo1 rounded-md">
        <form className="p-5 border border-neutral-100 rounded-md relative">
          <Input placeholder={"Name:"} type={"text"} />
          <div className="flex gap-4">
            <Input placeholder={"Email:"} type={"email"} />
            <Input placeholder={"Phone:"} type={"phone"} />
          </div>
          <Input placeholder={"Subject:"} type={"text"} />
          <textarea placeholder="Message:" className="bg-transparent border border-neutral-100 rounded-md w-full mb-2 text-lg font-medium font-['Poppins'] leading-7 placeholder-white px-4 py-2 outline-none focus:shadow-inner focus:shadow-[rgb(0,0,0,0.3)] text-white" rows={4} />
          <Image src={Captcha} className="mb-16" />
          <button type='submit' className="absolute bottom-3 right-5 text-center text-neutral-100 text-xl font-normal font-['Anton'] uppercase leading-normal tracking-tight">Enviar mensaje</button>
        </form>
      </div>
    </div>
  );
};

export default Footer;
