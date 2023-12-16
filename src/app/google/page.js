import Menu from "../components/Menu";
import Logo from "../../../public/Logo-Blue.svg";
import GoogleHollow from "../../../public/Google-Hollow.svg";
import Image from "next/image";
import Prompt from "../components/Prompt";
import Search from "../components/Search";

const Page = () => {
  return (
    <div className="lg:pl-20 pt-3 flex relative flex-col md:flex-row">
      <div>
        <Menu />
      </div>
      <div className="grow mt-6 flex flex-col gap-9 mb-20 md:mb-52 text-Oscuro1 px-6 md:px-14">
        <div className="flex justify-center items-center gap-6 mx-auto">
          <Image
            src={GoogleHollow}
            className="mx-auto w-[89px] h-[89px] md:block hidden"
            alt=""
          />
          <h1 className="texto2 text-center uppercase !leading-none !text-4xl md:!text-6xl">
            Buscador Vioniko
          </h1>
        </div>
        <p className="text-center text-xl font-['Lato']">
          Utiliza el poder de Google y de la Inteligencia Artificial para
          generar búsquedas mucho más efectivas. El Buscador Vioniko analiza las
          primeras páginas encontradas en tu búsqueda y te consolida la mejor
          información, evitando que tengas que ir de página en página hasta
          encontrar lo que realmente deseas.
        </p>
        <div className="w-full mt-8 md:mt-12">
          <Prompt placeholder="Aqui un texto de repuesta...." />
        </div>
        <div className="text-xl mt-6 md:mt-20">
          Repuesta:
          <ul className="ml-7 list-disc">
            <li>
              ¿Por qué te cuesta tanto preguntarle a una persona y cómo se
              autopercibe y cuáles son pron de asumir su género?
            </li>
          </ul>
          ☑ No necesito preguntarle a una persona cómo se autopibe en lugar de
          asumir su género. ☐ No me molesta preguntarle a una persona cómo se
          autopercibe en lugar de asumir su género. ☐ Me molesta preguntarle a
          una persona cómo se autopercibe en lugar de asumir su género.
        </div>
        <div className="w-full mt-10 md:mt-20">
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

export default Page;
