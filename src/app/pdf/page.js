import Logo from "../../../public/Logo-Blue.svg";
import Image from "next/image";
import SidebarInput from "../components/SidebarInput";
import Prompt from "../components/Prompt";
import Search from "../components/Search";

const page = () => {
  return (
    <div className="flex relative flex-col md:flex-row">
      <div className="lg:fixed left-0">
        <Sidebar />
      </div>
      <div className="fixed xl:w-[35vw] h-screen border-r-8 border-[#dfe5ea] xl:block hidden"></div>
      <div className="lg:ml-[37vw] mt-6 flex flex-col gap-2 mb-20 md:mb-52 text-Oscuro1 px-2 md:px-14 relative h-[90svh]">
        <h1 className="texto2 text-center uppercase !leading-none !text-4xl md:!text-6xl">
          Buscador Vioniko
        </h1>
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
        className="absolute -bottom-14 right-10 w-20 h-8 lg:w-auto lg:h-auto"
      />
    </div>
  );
};

const Sidebar = () => {
  return (
    <aside className="bg-Claro1 h-72 w-full md:h-screen md:w-64 flex flex-col justify-between text-Oscuro1 px-5 pt-5 pb-14 md:border-r-8 md:border-[#dfe5ea]">
      <div className="flex justify-center items-center gap-4 md:block">
        <h2 className="texto2 uppercase text-4xl md:text-6xl">PDF</h2>
        <div className="hidden md:block grow border border-Oscuro1 uppercase font-['Lato'] p-2.5 md:max-w-[168px] text-2xl text-center md:mt-6">
          soltar pdf aquí
        </div>
        <div className="block md:hidden grow border border-Oscuro1 uppercase font-['Lato'] p-2.5 md:max-w-[168px] text-2xl text-center md:mt-6">
          Explorar archivo
        </div>
      </div>
      <div className="mt-3 md:mt-0">
        <SidebarInput />
        <div className="mt-7 mx-5 flex flex-row md:flex-col gap-2">
          <div className="flex flex-col gap-2 w-full">
            <SidebarItem text={"Historia"} />
            <SidebarItem text={"Clientes"} />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <SidebarItem text={"Empotrado"} />
            <SidebarItem text={"Inicio"} />
          </div>
        </div>
      </div>
    </aside>
  );
};

const SidebarItem = ({ text }) => {
  return (
    <div className="p-2.5 border-2 border-Oscuro1 uppercase text-Oscuro1 font-extrabold font-['Lato'] flex justify-center items-center">
      {text}
    </div>
  );
};

export default page;
