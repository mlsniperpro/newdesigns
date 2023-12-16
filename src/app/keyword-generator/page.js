import Button from "../components/Button";
import Menu from "../components/Menu";
import PropertyCard from "../components/PropertyCard";
import Logo from "../../../public/Logo-Blue.svg";
import MagnifyingGlass from "../../../public/Union (1).png";
import Image from "next/image";

const Page = () => {
  return (
    <div className="lg:pl-20 pt-3 flex relative flex-col md:flex-row">
      <Menu />
      <div className="grow mt-6 flex flex-col gap-9 mb-20 md:mb-52">
        <div>
          <Image
            src={MagnifyingGlass}
            className="mx-auto mb-5 w-[131.85px] h-[131px] md:block hidden"
            alt=""
          />
          <h1 className="texto2 text-center text-Oscuro1 uppercase !leading-none !text-4xl md:!text-6xl">
            Generador de contenido AI:
          </h1>
          <h2 className="texto3 text-center text-Coporativo2 uppercase md:!leading-none leading-snug !text-xl md:!text-4xl ">
            basado en palabras clave
          </h2>
        </div>
        <div className="w-3/4 mx-auto">
          <PropertyCard
            text={"Escribe aquí tu palabra clave"}
            height={96}
            isAccordion={false}
          />
        </div>
        <div className="w-full sm:w-[519px] mx-auto mt-4 md:mt-[72px]">
          <Button text={"Generar contenido usando palabras clave"} />
        </div>
      </div>
      <Image
        src={Logo}
        className="absolute bottom-6 right-10 w-20 h-8 md:w-auto md:h-auto"
        alt=""
      />
    </div>
  );
};

export default Page;
