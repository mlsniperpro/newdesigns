import Button from "../components/Button";
import Menu from "../components/Menu";
import PropertyCard from "../components/PropertyCard";
import Logo from "../../../public/Logo-Blue.svg";
import Image from "next/image";

const Marketing = () => {
  return (
    <div className="lg:pl-20 pt-3 flex relative flex-col md:flex-row">
      <Menu />
      <div className="grow mt-6 flex flex-col gap-9 mb-20 md:mb-52">
        <div>
          <h1 className="texto2 text-center text-Oscuro1 uppercase !leading-none !text-4xl md:!text-6xl">
            Generador de contenido AI:
          </h1>
          <h2 className="texto3 text-center text-Coporativo2 uppercase md:!leading-none leading-snug !text-xl md:!text-4xl">
            Mas preciso y eficiente que chatGPT
          </h2>
        </div>
        <div className="mx-auto w-3/4 md:w-3/5">
          <PropertyCard text={"Título del producto/servicio"} height={20} />
          <PropertyCard text={"Especifica tu audiencia objetivo"} height={20} />
          <PropertyCard
            text={"¿Qué hace único a su producto/servicio?"}
            height={40}
          />
          <PropertyCard text={"Tipo de copia"} height={20} isAccordion={true} />
          <PropertyCard text={"Tono"} height={20} isAccordion={true} />
        </div>
        <div className="w-60 mx-auto mt-4 md:mt-[72px]">
          <Button text={"Generar contenido"} />
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

export default Marketing;
