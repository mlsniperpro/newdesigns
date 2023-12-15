import img from "@/../public/Directorio.png";
import Image from "next/image";
const PromptsDir = () => {
  return (
    <div className="mt-20">
      <div className="text-center text-Oscuro1 mb-11 mx-5 md:mx-52">
        <h2 className="texto2 mb-10 !text-4xl uppercase lg:!text-6xl !leading-none">
          DIRECTORIO de PROMPTS
        </h2>
        <p className="texto-contenido !text-xl sm:!text-2xl">
          Lleva tu experiencia al siguiente nivel con la inteligencia artificial
          , con una vasta opción de PROMPTS , separados por categorías, para su
          rapido acceso , para que puedas usar la IA como si fueras un PRO, pues
          la calidad de respuestas van en directa proporción a la calidad de
          preguntas, y justo a eso es lo que tienes acceso con este Directorio
          VK.
        </p>
      </div>
      <Image src={img} className="h-52 sm:h-auto" />
    </div>
  );
};

export default PromptsDir;
