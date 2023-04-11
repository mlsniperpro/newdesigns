import React from 'react'
import Link from 'next/link';
function PlanSelection() {
  const [language, setLanguage] = React.useState("english"); //Language can be english or spanish
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
                    {language === "english" ? "Language" : "Idioma"}
                  </p>
                  <p className="text-[#00153B] text-[50px] leading-[63px] font-bold">
                    {language === "english" ? "SELECTION" : "SELECCIÓN"}
                  
                  </p>
                </div>
                <div>
                  <p className="text-[#717F87] text-[18px] leading-[28px] font-medium">
                    {language === "english" ? "Click Button Below to Change to Spanish" : "Haga clic en el botón de abajo para cambiar al español"}
                  </p>
                  <p className="text-[#717F87] text-[18px] leading-[28px] font-medium">
                    {language === "english"
                      ? "It will change the language of the page"
                      : "Cambiará el idioma de la página"}
                  </p>
                </div>
              </div>
              <div className="pt-[25px] px-[25px] pb-[35px]">
                <div>
                  <p className="text-[#717F87] text-[14px] leading-[24px] font-medium">
                    {language === "english"
                      ? "Interract with the tutor to learn copywriting"
                      : "Interactúa con el tutor para aprender redacción publicitaria"}
                  </p>
                  <p className="text-[#717F87] text-[14px] leading-[24px] font-medium">
                    {language === "english"
                      ? "Select pre-made options to get copies faster"
                      : "Selecciona opciones prehechas para obtener copias más rápido"}
                  </p>
                  <p className="text-[#717F87] text-[14px] leading-[24px] font-medium">
                    {language === "english"
                      ? "Give a text-based command of your idea and get a copy faster"
                      : "Da una orden basada en texto de tu idea y obtén una copia más rápido"}
                  </p>
                  <p className="text-[#717F87] text-[14px] leading-[24px] font-medium">
                    {language === "english"
                      ? "Get Copy Based on Keyword"
                      : "Obtener copia basada en palabra clave"}
                  </p>
                </div>
                <div className="mt-[25px]">
                  <button onClick={()=>{language==="english"? setLanguage("spanish"): setLanguage("english")}} className="bg-[#006EF5] rounded-[5px] py-[15px] px-[25px] text-[#fff] text-[14px] leading-[17px] font-semibold">
                    {language === "english"
                      ? "Switch to Spanish"
                      : "Cambiar a español"}
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
                    $9
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
                      ? "Generate Copy Based on Keyword"
                      : "Generar copia basada en palabra clave"}
                  </p>
                  <p className="text-[#717F87] text-[14px] leading-[24px] font-medium">
                    {language === "english"
                      ? "Generate Copy Based on Text Prompt"
                      : "Generar copia basada en texto"}
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
                    $75
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
                      ? "Generate Copy Based on Keyword"
                      : "Generar copia basada en palabra clave"}
                  </p>
                  <p className="text-[#717F87] text-[14px] leading-[24px] font-medium">
                    {language === "english"
                      ? "Generate Copy Based on Text Prompt"
                      : "Generar copia basada en texto"}
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
