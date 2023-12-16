import Menu from "../components/Menu";
import Logo from "../../../public/Logo-Blue.svg";
import Triangle from "../../../public/triangle.svg";
import Image from "next/image";
import Search from "../components/Search";

const page = () => {
  return (
    <div className="lg:pl-20 pt-3 flex relative flex-col md:flex-row">
      <div>
        <Menu />
      </div>
      <div className="grow mt-6 flex flex-col gap-9 mb-20 md:mb-52 text-Oscuro1 px-2 md:px-14 relative h-[90svh]">
        <h1 className="texto2 text-center uppercase !leading-none !text-4xl md:!text-6xl">
          TUTOR VIONIKO DE REDACCIÓN PUBLICITARIA DE IA
        </h1>
        <div className="relative bg-Claro1 ml-auto px-5 py-3">
            <h2 className="text-base md:text-[32px] font-['Antonio'] uppercase tracking-tight">NOTA: Para comenzar a interactuar con el TUTOR, teclee esta palabra : INICIO</h2>
            <Image src={Triangle} className="absolute -bottom-6 left-5 w-6 h-6" alt=""/>
        </div>
        <div className="w-[95%] md:w-[90%] py-3 border-t border-Claro1 absolute bottom-0">
            <Search />
        </div>
      </div>
      <Image
        src={Logo}
        className="absolute bottom-6 right-10 w-20 h-8 lg:w-auto lg:h-auto"
        alt=""
      />
    </div>
  );
};

export default page;
