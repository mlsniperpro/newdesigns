"use client"
import Image from "next/image";
import ArrowDown from "../../../public/Arrow-Down.svg";
import { useState } from "react";

const PropertyCard = ({ text, height, isAccordion }) => {
  const [isAccordionOpen, setIsAccordionOpen] = useState(false)
  return (
    <div
      className={`bg-Blanco flex flex-col justify-center items-center w-full ${isAccordionOpen ? `pt-5 h-max`:`h-${height}`} border-b border-slate-300 relative transition-all`}
    >
      <p className="opacity-60 text-center text-gray-700 text-2xl font-normal font-['Lato'] leading-loose">
        {text}
      </p>
      {isAccordion && <Image src={ArrowDown} className={`absolute right-5 ${isAccordion ? 'cursor-pointer':''} ${isAccordionOpen ? 'top-8': 'top-1/2'}`} onClick={() => setIsAccordionOpen(isAccordionOpen => !isAccordionOpen)} />}
      {isAccordionOpen && <p className="text-center text-gray-700 text-xl font-normal font-['Lato'] leading-loose mt-10">lorem ipsum dolor sit amet</p>}
    </div>
  );
};

export default PropertyCard;
