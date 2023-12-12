import Image from "next/image";

const Card = ({ children, heading, subheading, img, isImgRight }) => {
  return (
    <div
      className={`flex justify-center items-center gap-20 max-w-[1556px] mx-3 md:w-[90vw] md:mx-auto border border-slate-300 sm:py-20 sm:px-24 md:px-10 px-10 py-10 flex-col-reverse ${
        isImgRight ? "md:flex-row" : "md:flex-row-reverse"
      } mt-7 mb-0 md:mt-20 md:mb-24`}
    >
      <div className="text-Oscuro1">
        <div className="mb-10">
          <h2 className="texto2 !text-4xl uppercase lg:!text-6xl !leading-none">
            {heading}
            <br />
          </h2>
          <span className="text-gray-700 text-2xl sm:text-4xl font-normal font-['Antonio'] uppercase -mt-10 !leading-none">
            {subheading}
          </span>
        </div>
        <div className="texto-contenido !text-xl">{children}</div>
      </div>
      <Image src={img} className="rounded-xl object-cover w-96 h-80" />
    </div>
  );
};

export default Card;
