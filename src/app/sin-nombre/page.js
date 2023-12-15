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
        <div className="w-[100%] text-center md:text-left lg:pt-72">
          <div className="!mt-11 2xl:mt-24 [&>*>*]:!text-lg [&>*]:!h-[83px] [&>*>*]:!leading-none whitespace-nowrap">
            <PropertyCard text={"Introduce la URL del video de YouTube aquí"} />
          </div>
          <Image src={Youtube} className="rounded-[10px] mt-12" />
        </div>
        <div className="mx-4 md:mx-0 flex flex-col justify-start items-start mt-5 lg:mt-0 gap-7 lg:gap-14">
          <h1 className=" texto2 !leading-none uppercase !text-4xl 2xl:text-6xl">
            You Google
          </h1>
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
          <div className="w-full lg:mt-52">
          <Search />
          </div>
        </div>
      </div>
      <Image
        src={Logo}
        className="absolute bottom-6 right-10 2xl:w-auto 2xl:h-auto w-20 h-8"
      />
    </div>
  );
};

export default page;
