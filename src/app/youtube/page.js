import Menu from "../components/Menu";
import Logo from "../../../public/Logo-Blue.svg";
import Youtube from "../../../public/youtube.png";
import Image from "next/image";
import PropertyCard from "../components/PropertyCard";
import Prompt from "../components/Prompt";
import Search from "../components/Search";

const page = () => {
  return (
    <div className="lg:pl-20 pt-3 flex flex-col md:flex-row relative">
      <div>
        <Menu />
      </div>
      <div className="grow mt-6 flex justify-center items-stretch mb-20 md:mb-52 text-Oscuro1 gap-5 px-5 lg:flex-nowrap flex-wrap">
        <div className="w-[100%] text-center md:text-left">
          <h1 className=" texto2 !leading-none uppercase !text-4xl 2xl:text-6xl">
            Analizador de Videos en YouTube con IA
          </h1>
          <p className=" mt-5 texto-contenido !text-lg 2xl:text-2xl">
            YouTube, en muchos aspectos, se considera una de las mejores formas
            de aprender sobre casi cualquier tema. Sin embargo, el tiempo y el
            idioma suelen ser barreras. Pero eso ya no representará un
            obstáculo, pues con esta función, independientemente del idioma del
            video, podrás hacer resúmenes de lo más relevante y hacer preguntas
            en tu idioma. Esto te permitirá aumentar tu productividad y
            velocidad de aprendizaje.
          </p>
          <div className="!mt-11 2xl:mt-24 [&>*>*]:!text-lg [&>*]:!h-[83px] [&>*>*]:!leading-none whitespace-nowrap">
            <PropertyCard text={"Introduce la URL del video de YouTube aquí"} />
          </div>
          <Image src={Youtube} className="rounded-[10px] mt-12" alt=""/>
        </div>
        <div className="mx-4 md:mx-0 flex flex-col justify-between items-center">
          <Prompt />
          <div className="text-lg">
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
          <Search />
        </div>
      </div>
      <Image
        src={Logo}
        className="absolute bottom-6 right-10 w-20 h-8 2xl:w-auto 2xl:h-auto"
        alt=""
      />
    </div>
  );
};

export default page;
