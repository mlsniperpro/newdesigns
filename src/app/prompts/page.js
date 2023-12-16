import Menu from "../components/Menu";
import Image from "next/image";
import Icon from "../../../public/Union.png";
import Logo from "../../../public/Dispositivo.png";
import WarnBlue from "../../../public/Warning-1.png";
import Fire from "../../../public/Fire.png";
import Dashes from "../../../public/Dashes.png";
import PromptCard from "../components/PromptCard";
import TopicTag from "../components/TopicTag";

const prompts = [0, 1, 2, 3];
const tags = [
  { text: "Business", color: "bg-purple-500" },
  { text: "Lead Magnet", color: "bg-green-300" },
  { text: "IMAGE", color: "bg-orange-200" },
  { text: "SEO", color: "bg-purple-400" },
  { text: "Marketing", color: "bg-blue-200" },
  { text: "Writing", color: "bg-blue-400" },
  { text: "Prompts", color: "bg-blue-200" },
  { text: "Financial", color: "bg-green-300" },
  { text: "Social Media", color: "bg-green-600" },
  { text: "Ejercicio", color: "bg-green-600" },
  { text: "Asistente Virtual VK", color: "bg-purple-400" },
  { text: "RETO VK 10 DIAS", color: "bg-blue-400" },
  { text: "Recetas", color: "bg-purple-400" },
  { text: "Aprendizaje", color: "bg-orange-200" },
  { text: "Learning", color: "bg-green-300" },
  { text: "Divertido", color: "bg-blue-200" },
  { text: "Psicología", color: "bg-blue-200" },
  { text: "Sales", color: "bg-green-600" },
];

const Page = () => {
  return (
    <div className="xl:pl-20 pt-3 flex relative flex-col md:flex-row">
      <div>
        <Menu />
      </div>
      <div className="mt-6 flex flex-col gap-0">
        <Navbar />
        <div className="flex px-2 sm:px-5 gap-3 md:gap-10 mt-10 md:mt-52">
          <div className="md:mt-10">
            {prompts.map((prompt) => (
              <PromptCard key={prompt} />
            ))}
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-center text-gray-700 text-base font-bold font-['Lato'] leading-7">
              Topics/Temas
            </p>
            {tags.map((tag, index) => (
              <TopicTag key={index} text={tag.text} bgColor={tag.color} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Navbar = () => {
  return (
    <nav className="flex justify-between items-start px-3">
      <div className="flex justify-center translate-y-0 md:translate-y-14 lg:translate-y-0 lg:justify-start items-center  gap-2 flex-wrap">
        <Image src={Logo} className="hidden lg:block" alt=""/>
        <div className="bg-neutral-50 grow rounded-[10px] border border-slate-300 w-72 lg:w-80 pl-3 py-3 basis-44">
          <p className="opacity-60 text-gray-700 text-2xl font-normal font-['Lato']">
            Buscar...
          </p>
        </div>
        <div className="flex items-center gap-1 md:gap-2 grow bg-neutral-50 rounded-[10px] border border-slate-300 py-3 px-1 md:px-3 basis-44">
          <Image src={WarnBlue} alt=""/>
          <p className="text-center text-gray-700 text-base font-extrabold font-['Lato'] leading-7 whitespace-nowrap">
            Reciente / Anterior
          </p>
        </div>
        <div className="flex items-center gap-10 grow bg-neutral-50 rounded-[10px] border border-slate-300 py-3 pl-3 md:px-3 basis-44">
          <Image src={Fire} alt=""/>
          <p className="text-center text-gray-700 text-base font-extrabold font-['Lato'] leading-7 whitespace-nowrap">
            Esta Semana
          </p>
        </div>
        <div className="flex items-center gap-10 grow bg-neutral-50 rounded-[10px] border border-slate-300 py-3 pl-3 md:px-3 basis-44">
          <Image src={Dashes} alt=""/>
          <p className="text-center text-gray-700 text-base font-extrabold font-['Lato'] leading-7 whitespace-nowrap">
            Esta Semana
          </p>
        </div>
      </div>
      <button className="bg-neutral-50 rounded-[10px] border border-slate-300 flex justify-center items-center px-4 gap-4 py-4 absolute top-5 right-5 lg:static">
        <Image src={Icon} className="w-[18px] h-[18px]" alt=""/>
        <span className="text-center text-gray-700 text-2xl font-bold font-['Antonio'] uppercase leading-none">
          Crear
        </span>
      </button>
    </nav>
  );
};

export default Page;
