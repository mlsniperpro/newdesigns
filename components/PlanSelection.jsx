import React from 'react'
import Link from 'next/link';
import { getDocs, collection } from "firebase/firestore";
import { db } from "../config/firebase";


function PlanSelection() {
  const [yearly, setYearly] = React.useState(90);
  const [monthly, setMonthly] = React.useState(9);
  const [language, setLanguage] = React.useState("spanish"); //Language can be english or spanish
  const retrievePrices = async () => {
    const pricesDoc = await getDocs(collection(db, "Payment"));
    console.log("The prices retrieved are: ", pricesDoc);
    pricesDoc.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
        setMonthly(doc.data().monthly);
        setYearly(doc.data().yearly);
    });
  };
  React.useEffect(() => {
    retrievePrices();
  }, []);

  return (
    <>
      {/* This is an example component */}
      <div className="flex min-h-screen pt-[30px] px-[40px]">
        <div className="min-w-full">
          <p className="text-[#00153B] text-[20px] leading-[40px] font-semibold">
            {language === "english"
              ? "Select Subscription Plan"
              : "Seleccionar Plan de Suscripción"}
          </p>
          <div>
            <p className="text-[#717F87] text-[15px] leading-[27px] font-medium">
              {language === "english"
                ? "Choose the plan that works for you. You can always change it later."
                : "Elige el plan que mejor se adapte a ti. Siempre puedes cambiarlo más tarde."}
            </p>
          </div>
          <div className="mt-[30px] inline-flex border border-[#E1E3E5] shadow-[0px 1px 2px #E1E3E5] divide-[#E1E3E5] divide-x rounded-[5px]">
            <button className="bg-white hover:bg-[#F6F6F7] hover:text-[#717F87] text-[#0E1823] leading-[16px] text-[13px] font-semibold font-bold py-[15px] px-[25px] rounded-l">
              <Link href="/">{language === "english" ? "Free" : "Gratis"}</Link>
            </button>
            <button className="bg-white hover:bg-[#F6F6F7] hover:text-[#717F87] text-[#0E1823] text-[13px] leading-[16px] font-semibold font-bold py-[15px] px-[25px] rounded-r">
              {language === "english" ? "Monthly" : "Mensual"}
            </button>
            <button className="bg-white hover:bg-[#F6F6F7] hover:text-[#717F87] text-[#0E1823] text-[13px] leading-[16px] font-semibold font-bold py-[15px] px-[25px] rounded-r">
              {language === "english" ? "Annual" : "Anual"}
            </button>
          </div>
          <div className="mt-[20px] grid grid-cols-3 gap-[20px]">
            <div
              key={1}
              className="w-full bg-[#fff] rounded-[10px] shadow-[0px 1px 2px #E1E3E5] border border-[#E1E3E5] divide-y"
            >
              <div className="pt-[15px] px-[25px] pb-[25px]">
                <div className="flex justify-end">
                  <div className="bg-[#F6F6F7] rounded-[20px] flex justify-center align-center px-[12px]">
                    <p className="text-[#00153B] text-[12px] leading-[28px] font-bold">
                      {language === "english" ? "Starter" : "Principiante"}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-[#00153B] text-[19px] leading-[24px] font-bold">
                    {language === "english" ? "Basic" : "Básico"}
                  </p>
                  <p className="text-[#00153B] text-[50px] leading-[63px] font-bold">
                    {language === "english" ? "FREE" : "GRATIS"}
                  </p>
                </div>
                <div>
                  <p className="text-[#717F87] text-[18px] leading-[28px] font-medium">
                    {language === "english" ? "4 Functions:" : "4 Funciones:"}
                  </p>
                  <p className="text-[#717F87] text-[18px] leading-[28px] font-medium">
                    {language === "english"
                      ? "These are the benefits you get when you sign up for free"
                      : "Estos son los beneficios que obtienes cuando te registras de forma gratuita"}
                  </p>
                </div>
              </div>
              <div className="pt-[25px] px-[25px] pb-[35px]">
                <div>
                  <p className="text-[#717F87] text-[14px] leading-[24px] font-medium">
                    {language === "english"
                      ? "1. Get a professional step-by-step guide from an AI-based tutor to create high-quality advertising copy."
                      : "1. Obtén una guía profesional paso a paso de un tutor basado en Inteligencia Artificial, para crear redacciones publicitarias de excelente calidad."}
                  </p>
                  <p className="text-[#717F87] text-[14px] leading-[24px] font-medium">
                    {language === "english"
                      ? "2.Save time by selecting pre-set options and fields to quickly and efficiently obtain advertising copy."
                      : "2.Ahorra tiempo al seleccionar opciones y campos preestablecidos para obtener redacciones publicitarias de forma rápida y eficiente."}
                  </p>
                  <p className="text-[#717F87] text-[14px] leading-[24px] font-medium">
                    {language === "spanish"
                      ? "3. Genera una orden basada en texto de tu idea publicitaria y obtén una redaccion lista en tiempo récord."
                      : "3. Generate a text-based order for your advertising idea and get a ready-made copy in record time."}
                  </p>
                  <p className="text-[#717F87] text-[14px] leading-[24px] font-medium">
                    {language === "english"
                      ? "4.Optimize your results by using an advertising idea generator based on relevant keywords for your audience and marketing objectives."
                      : "4.Optimiza tus resultados al utilizar un generador de ideas publicitarias basadas en palabras clave relevantes para tu audiencia y objetivos de marketing."}
                  </p>
                </div>
                <div className="mt-[25px]">
                  <button
                    onClick={() => {
                      language === "english"
                        ? setLanguage("spanish")
                        : setLanguage("english");
                    }}
                    className="bg-[#006EF5] rounded-[5px] py-[15px] px-[25px] text-[#fff] text-[14px] leading-[17px] font-semibold"
                  >
                    {language === "english"
                      ? "Switch to Spanish"
                      : "Cambiar a inglés"}
                  </button>
                </div>
              </div>
            </div>
            <div
              key={2}
              className="w-full bg-[#fff] rounded-[10px] shadow-[0px 1px 2px #E1E3E5] border border-[#E1E3E5] divide-y"
            >
              <div className="pt-[15px] px-[25px] pb-[25px]">
                <div className="flex justify-end">
                  <div className="bg-[#F6F6F7] rounded-[20px] flex justify-center align-center px-[12px]">
                    <p className="text-[#00153B] text-[12px] leading-[28px] font-bold">
                      {language === "english" ? "Most Popular" : "Más Popular"}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-[#00153B] text-[19px] leading-[24px] font-bold">
                    {language === "english" ? "Monthly" : "Mensual"}
                  </p>
                  <p className="text-[#00153B] text-[50px] leading-[63px] font-bold">
                    {monthly} USD
                  </p>
                </div>
                <div>
                  <p className="text-[#717F87] text-[18px] leading-[28px] font-medium">
                    {language === "english"
                      ? "Unlimited Usage"
                      : "Uso Ilimitado"}
                  </p>
                  <p className="text-[#717F87] text-[18px] leading-[28px] font-medium">
                    {language === "english"
                      ? "1 month activation"
                      : "Activación de 1 mes"}
                  </p>
                </div>
              </div>
              <div className="pt-[25px] px-[25px] pb-[35px]">
                <div>
                  <p className="text-[#717F87] text-[14px] leading-[24px] font-medium">
                    {language === "english"
                      ? "7 Days Free Bonus In Addition to 1 Month Activation"
                      : "7 días de bonificación gratis además de la activación de 1 mes"}
                  </p>
                  <p className="text-[#717F87] text-[14px] leading-[24px] font-medium">
                    {language === "english"
                      ? "Everything in the Free Plan + Unlimited Access"
                      : "Todo en el Plan Gratuito + Acceso Ilimitado"}
                  </p>
                </div>
                <div className="mt-[25px]">
                  <button className="bg-[#006EF5] rounded-[5px] py-[15px] px-[25px] text-[#fff] text-[14px] leading-[17px] font-semibold">
                    <Link href="/monthly">
                      {language === "english"
                        ? "Select Plan"
                        : "Seleccionar Plan"}
                    </Link>
                  </button>
                </div>
              </div>
            </div>
            <div
              key={3}
              className="w-full bg-[#fff] rounded-[10px] shadow-[0px 1px 2px #E1E3E5] border border-[#E1E3E5] divide-y"
            >
              <div className="pt-[15px] px-[25px] pb-[25px]">
                <div className="flex justify-end">
                  <div className="bg-[#F6F6F7] rounded-[20px] flex justify-center align-center px-[12px]">
                    <p className="text-[#00153B] text-[12px] leading-[28px] font-bold">
                      {language === "english" ? "Best Value" : "Mejor Valor"}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-[#00153B] text-[19px] leading-[24px] font-bold">
                    {language === "english" ? "Yearly" : "Anual"}
                  </p>
                  <p className="text-[#00153B] text-[50px] leading-[63px] font-bold">
                    {yearly} USD
                  </p>
                </div>
                <div>
                  <p className="text-[#717F87] text-[18px] leading-[28px] font-medium">
                    {language === "english"
                      ? "Unlimited Usage"
                      : "Uso Ilimitado"}
                  </p>
                  <p className="text-[#717F87] text-[18px] leading-[28px] font-medium">
                    {language === "english"
                      ? "12 months activation"
                      : "Activación de 12 meses"}
                  </p>
                </div>
              </div>
              <div className="pt-[25px] px-[25px] pb-[35px]">
                <div>
                  <p className="text-[#717F87] text-[14px] leading-[24px] font-medium">
                    {language === "english"
                      ? "2 months of free access"
                      : "2 meses de acceso gratuito"}
                  </p>
                  <p className="text-[#717F87] text-[14px] leading-[24px] font-medium"></p>
                  <p className="text-[#717F87] text-[14px] leading-[24px] font-medium">
                    {language === "english"
                      ? "Everything in the Free Plan + Unlimited Access"
                      : "Todo en el Plan Gratuito + Acceso Ilimitado"}
                  </p>
                </div>
                <div className="mt-[25px]">
                  <button className="bg-[#006EF5] rounded-[5px] py-[15px] px-[25px] text-[#fff] text-[14px] leading-[17px] font-semibold">
                    <Link href="/yearly">
                      {language === "english" ? "Upgrade +" : "Mejorar +"}
                    </Link>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PlanSelection
