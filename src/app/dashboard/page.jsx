import Logo from "../../../public/Logo-Blue.svg";
import Icon from "../../../public/logo-whatsapp.png";
import Menu from "../components/Menu";
import Image from "next/image";
import Link from "next/link";

const Page = () => {
  return (
    <div className="lg:pl-20 pt-3 flex flex-col md:flex-row">
      <Menu />
      <div className="grow mt-6 flex flex-col gap-9 mb-20 md:mb-52 text-Oscuro1">
        <h1 className="texto2 uppercase text-center text-4xl md:text-6xl">
          Perfil
        </h1>
        <div className="mx-auto border-b border-Claro1 pb-11 md:border-0 md:pb-0">
          <Image src={Icon} className="mx-auto" alt="" />
          <h2 className="texto5 uppercase text-center !leading-none">
            Advanced Crealogy (Freelance Designer)
          </h2>
          <div className="flex justify-center items-center mt-2 mb-5">
            <Link
              href={"mailto:advancedcrealogy@gmail.com"}
              className="texto-contenido-v2"
            >
              advancedcrealogy@gmail.com
            </Link>
          </div>
          <div className="mt-11 md:mt-0">
            <div className="text-xl font-extrabold font-['Lato'] leading-loose flex justify-between">
              Registrado con:
              <span className="font-normal">Google</span>
            </div>
            <div className="text-xl font-extrabold font-['Lato'] leading-loose flex justify-between">
              Unido en:
              <span className="font-normal">25/10/2023</span>
            </div>
            <div className="text-xl font-extrabold font-['Lato'] leading-loose flex justify-between">
              Suscripción:
              <span className="font-normal">monthly</span>
            </div>
            <div className="text-xl font-extrabold font-['Lato'] leading-loose flex justify-between">
              Suscripción termina en:
              <span className="font-normal">1/12/2023</span>
            </div>
            <div className="text-xl font-extrabold font-['Lato'] leading-loose flex justify-between">
              Suscripción inicia en:
              <span className="font-normal">1/11/2023</span>
            </div>
          </div>
        </div>
      </div>
      <Image
        src={Logo}
        className="absolute bottom-6 right-10 w-20 h-8 xl:w-auto xl:h-auto"
        alt=""
      />
    </div>
  );
};

export default Page;
