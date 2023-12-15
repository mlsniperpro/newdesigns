import Logo from "../../../public/Logo-Blue.svg";
import Left from "../../../public/Left.svg";
import Right from "../../../public/Right.svg";
import Image from "next/image";

const MainScreen = ({
  temp,
  setTemp,
  isLeftOpen,
  setIsLeftOpen,
  isRightOpen,
  setIsRightOpen,
}) => {
  return (
    <>
      <div className="sticky top-0 w-full items-center justify-between flex lg:hidden">
        <button
          className="cursor-pointer hover:opacity-60"
          onClick={() => setIsLeftOpen((isLeftOpen) => !isLeftOpen)}
        >
          {isLeftOpen ? <Image src={Left} /> : <Image src={Right} />}
        </button>
        <button
          className="cursor-pointer hover:opacity-60"
          onClick={() => setIsRightOpen((isRightOpen) => !isRightOpen)}
        >
          {isRightOpen ? <Image src={Right} /> : <Image src={Left} />}
        </button>
      </div>
      <Image src={Logo} className="mx-auto mt-10 w-[164px] lg:w-[532px]" />
      <div className="bg-[#e9edf1] px-6 py-5 lg:w-[639px] mx-auto mt-11">
        <h1 className="texto2 text-center uppercase !leading-none !text-2xl">
          Prompt del sistema
        </h1>
        <p className="text-center font-['Lato']">
          Estás en VionikoMarketing, un gran modelo de lenguaje capacitado por
          Vioniko AI. Siga atentamente las instrucciones del usuario. Responda
          usando la marca hacia abajo.
        </p>
        <h1 className="texto2 text-center uppercase !leading-none !text-2xl mt-3">
          Temperatura
        </h1>
        <p className="text-center font-['Lato']">
          Valores más altos como 0,8 harán que la salida sea más aleatoria,
          mientras que valores más bajos como 0,2 la harán más enfocada y
          determinista.
        </p>
      </div>
      <div className="w-min relative mx-auto mt-10">
        <span className="font-bold absolute left-1/2 -top-4 -translate-x-1/2">
          {temp}
        </span>
        <input
          type="range"
          className="mx-auto w-[200px] sm:w-[320px] lg:w-[500px]"
          min={0}
          max={1}
          step={0.1}
          onChange={(e) => setTemp(e.target.value)}
        />
        <span className="absolute left-0 -bottom-4">Preciso</span>
        <span className="absolute left-1/2 -translate-x-1/2 -bottom-4">
          Neutral
        </span>
        <span className="absolute right-0 -bottom-4">Creativo</span>
      </div>
    </>
  );
};

export default MainScreen;
