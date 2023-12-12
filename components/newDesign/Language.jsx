import americanflag from "@/public/American Flag.png";
import Image from "next/image";

const Language = () => {
  return (
    <div className="flex justify-end items-center gap-4">
      <p className="text-sm font-normal font-['Inter']">English</p>
      <Image src={americanflag} className="w-6 h-6" />
    </div>
  );
};

export default Language;
