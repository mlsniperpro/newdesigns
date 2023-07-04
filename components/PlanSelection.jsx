import React, { use } from 'react'
import { useEffect } from 'react'
import Link from 'next/link';
import { useAuthState } from "react-firebase-hooks/auth";
import { getDocs, collection } from "firebase/firestore";
import { createCheckoutSession } from "@/stripe/createCheckoutSession";
import { db, auth } from "../config/firebase";
import InventoryIcon from '@mui/icons-material/Inventory';
import StarIcon from '@mui/icons-material/Star';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import UpgradeIcon from '@mui/icons-material/Upgrade';

function PlanSelection() {
  const [user, userLoading] = useAuthState(auth);
  const [stripePrices, setStripePrices] = React.useState({}); //Dictionary of prices from stripe
  const [yearly, setYearly] = React.useState(90);
  const [monthly, setMonthly] = React.useState(9);
  const [referred, setReferred] = React.useState(false); //If the user was referred by a friend
  const [language, setLanguage] = React.useState("spanish"); //Language can be english or spanish

 const fetchPrices = async () => {
   const pricesDict = {};
   const stripePricesCollection = collection(db, "stripePrices");
   const snapshot = await getDocs(stripePricesCollection);

   snapshot.forEach((doc) => {
     const productId = doc.id;
     const priceId = doc.data().price_id;
     pricesDict[productId] = priceId;
   });

   return pricesDict;
 };
  const retrievePrices = async () => {
    const pricesDoc = await getDocs(collection(db, "Payment"));
    pricesDoc.forEach((doc) => {
        setMonthly(doc.data().monthly);
        setYearly(doc.data().yearly);
    });
  };
  React.useEffect(() => {
     fetchPrices().then((pricesDict) => {
  setStripePrices(pricesDict);
});
  
    retrievePrices();
  }, []);
   const handleMonthlyClick = () => {
     if (window?.Rewardful && window.Rewardful?.referral) {
       createCheckoutSession(user.uid, stripePrices["prod_Njtrgy9W8UwGW7"]);
     }
   };
   const handleYearlyClick = () => {
     if (window?.Rewardful && window.Rewardful?.referral) {
       createCheckoutSession(user.uid, stripePrices["prod_NjtvxM9XlsH2c6"]);
     }
   };

  return (
    <>
      <div
        className="flex min-h-screen pt-[30px] px-[40px]"
        style={{ background: "white" }}
      >
        <div className="min-w-full">
          <div style={{ left: "150px" }}>
            <button
              onClick={() => {
                language === "english"
                  ? setLanguage("spanish")
                  : setLanguage("english");
              }}
              className="bg-[white] rounded-[5px] py-[15px] px-[25px] text-[#fff] text-[14px] leading-[17px] font-semibold"
              style={{
                color: "white",
                fontFamily: "Monospace",
                fontSize: "18px",
                background: "#283081",
              }}
            >
              {language === "english"
                ? "Switch to Spanish"
                : "Cambiar a inglés"}
            </button>
            <Link href="/login">
              <button
                className="bg-[white] rounded-[5px] py-[15px] px-[25px] text-[#fff] text-[14px] leading-[17px] font-semibold"
                style={{
                  color: "white",
                  fontFamily: "Monospace",
                  fontSize: "18px",
                  background: "#283081",
                  marginLeft: "20px",
                }}
              >
                {language === "english" ? "MEMBERS AREA" : "AREA de MIEMBROS"}
              </button>
            </Link>
          </div>
          <br></br>
          <p
            className="text-[#00153B] text-[20px] leading-[40px] font-semibold"
            style={{
              color: "black",
              fontSize: "bolder",
              fontFamily: "Monospace",
              fontSize: "40px",
            }}
          >
            <InventoryIcon style={{ marginRight: "10px" }} />
            {language === "english"
              ? "Select Subscription Plan"
              : "Seleccionar Plan de Suscripción"}
          </p>
          <br></br>
          <div>
            <p
              className="text-[#717F87] text-[15px] leading-[27px] font-medium"
              style={{
                color: "black",
                fontSize: "bolder",
                fontFamily: "Monospace",
                fontSize: "20px",
              }}
            >
              <StarIcon style={{ marginRight: "10px" }} />
              {language === "english"
                ? "Choose the plan that works for you. You can always change it later."
                : "Elige el plan que mejor se adapte a ti. Siempre puedes cambiarlo más tarde."}
            </p>
          </div>
          <div className="mt-[30px] inline-flex border border-[#E1E3E5] shadow-[0px 1px 2px #E1E3E5] divide-[#E1E3E5] divide-x rounded-[5px]">
            <button
              className="bg-white hover:bg-[#F6F6F7] hover:text-[#717F87] text-[#0E1823] leading-[16px] text-[13px] font-semibold font-bold py-[15px] px-[25px] rounded-l"
              style={{
                background: "#283081",
                color: "white",
                fontFamily: "Monospace",
                fontSize: "18px",
              }}
            >
              <Link href="/">
                <MoneyOffIcon style={{ marginRight: "10px" }} />
                {language === "english" ? "Free" : "Gratis"}
              </Link>
            </button>
            <button
              className="bg-white hover:bg-[#F6F6F7] hover:text-[#717F87] text-[#0E1823] text-[13px] leading-[16px] font-semibold font-bold py-[15px] px-[25px] rounded-r"
              style={{
                background: "#283081",
                color: "white",
                fontFamily: "Monospace",
                fontSize: "18px",
              }}
            >
              <AttachMoneyIcon style={{ marginRight: "10px" }} />
              {language === "english" ? "Monthly" : "Mensual"}
            </button>
            <button
              className="bg-white hover:bg-[#F6F6F7] hover:text-[#717F87] text-[#0E1823] text-[13px] leading-[16px] font-semibold font-bold py-[15px] px-[25px] rounded-r"
              style={{
                background: "#283081",
                color: "white",
                fontFamily: "Monospace",
                fontSize: "18px",
              }}
            >
              <AttachMoneyIcon style={{ marginRight: "10px" }} />
              {language === "english" ? "Annual" : "Anual"}
            </button>
          </div>
          <div className="mt-[20px] grid grid-cols-3 gap-[20px]">
            <div
              key={1}
              className="w-full bg-[#fff] rounded-[10px] shadow-[0px 1px 2px #E1E3E5] border border-[#E1E3E5] divide-y"
              style={{ background: "#283081" }}
            >
              <div className="pt-[15px] px-[25px] pb-[25px]">
                <div className="flex justify-end">
                  <div className="bg-[#F6F6F7] rounded-[20px] flex justify-center align-center px-[12px]">
                    <p
                      className="text-[#00153B] text-[12px] leading-[28px] font-bold"
                      style={{ fontFamily: "Monospace", fontSize: "16px" }}
                    >
                      {language === "english" ? "Starter" : "Principiante"}
                    </p>
                  </div>
                </div>
                <div>
                  <p
                    className="text-[#00153B] text-[19px] leading-[24px] font-bold"
                    style={{
                      color: "white",
                      fontFamily: "Monospace",
                      fontSize: "30px",
                    }}
                  >
                    {language === "english" ? "Basic" : "Básico"}
                  </p>
                  <p
                    className="text-[#00153B] text-[50px] leading-[63px] font-bold"
                    style={{ color: "white" }}
                  >
                    {language === "english" ? "FREE" : "GRATIS"}
                  </p>
                </div>
                <div>
                  <p
                    className="text-[#717F87] text-[18px] leading-[28px] font-medium"
                    style={{
                      color: "white",
                      fontFamily: "Monospace",
                      fontSize: "20px",
                    }}
                  >
                    {language === "english"
                      ? " → 4 Functions"
                      : " → 4 Funciones"}
                  </p>
                  <p
                    className="text-[#717F87] text-[18px] leading-[28px] font-medium"
                    style={{
                      color: "white",
                      fontFamily: "Monospace",
                      fontSize: "20px",
                    }}
                  >
                    {language === "english"
                      ? "These are the benefits you get when you sign up for free"
                      : "Estos son los beneficios que obtienes cuando te registras de forma gratuita"}
                  </p>
                </div>
              </div>
              <div className="pt-[25px] px-[25px] pb-[35px]">
                <div>
                  <p
                    className="text-[#717F87] text-[14px] leading-[24px] font-medium"
                    style={{
                      color: "white",
                      fontFamily: "Monospace",
                      fontSize: "16px",
                    }}
                  >
                    {language === "english"
                      ? " → Get a professional step-by-step guide from an AI-based tutor to create high-quality advertising copy."
                      : " → Obtén una guía profesional paso a paso de un tutor basado en Inteligencia Artificial, para crear redacciones publicitarias de excelente calidad."}
                  </p>
                  <br></br>
                  <p
                    className="text-[#717F87] text-[14px] leading-[24px] font-medium"
                    style={{
                      color: "white",
                      fontFamily: "Monospace",
                      fontSize: "16px",
                    }}
                  >
                    {language === "english"
                      ? " → Save time by selecting pre-set options and fields to quickly and efficiently obtain advertising copy."
                      : " → Ahorra tiempo al seleccionar opciones y campos preestablecidos para obtener redacciones publicitarias de forma rápida y eficiente."}
                  </p>
                  <br></br>
                  <p
                    className="text-[#717F87] text-[14px] leading-[24px] font-medium"
                    style={{
                      color: "white",
                      fontFamily: "Monospace",
                      fontSize: "16px",
                    }}
                  >
                    {language === "spanish"
                      ? " → Genera una orden basada en texto de tu idea publicitaria y obtén una redaccion lista en tiempo récord."
                      : " → Generate a text-based order for your advertising idea and get a ready-made copy in record time."}
                  </p>
                  <br></br>
                  <p
                    className="text-[#717F87] text-[14px] leading-[24px] font-medium"
                    style={{
                      color: "white",
                      fontFamily: "Monospace",
                      fontSize: "16px",
                    }}
                  >
                    {language === "english"
                      ? " → Optimize your results by using an advertising idea generator based on relevant keywords for your audience and marketing objectives."
                      : " → Optimiza tus resultados al utilizar un generador de ideas publicitarias basadas en palabras clave relevantes para tu audiencia y objetivos de marketing."}
                  </p>
                </div>
                <div className="mt-[25px]">
                  <Link href="/">
                    <button
                      className="bg-[white] rounded-[5px] py-[15px] px-[25px] text-[#fff] text-[14px] leading-[17px] font-semibold"
                      style={{
                        color: "#283081",
                        fontFamily: "Monospace",
                        fontSize: "18px",
                        marginLeft: "10px",
                      }}
                    >
                      {language === "english"
                        ? "Has reached the limit free to use available For this month"
                        : "Ha alcanzado el límite gratuito de uso disponible para este mes"}
                    </button>
                  </Link>
                </div>
              </div>
            </div>
            <div
              key={2}
              className="w-full bg-[#fff] rounded-[10px] shadow-[0px 1px 2px #E1E3E5] border border-[#E1E3E5] divide-y"
              style={{ background: "#283081" }}
            >
              <div className="pt-[15px] px-[25px] pb-[25px]">
                <div className="flex justify-end">
                  <div className="bg-[#F6F6F7] rounded-[20px] flex justify-center align-center px-[12px]">
                    <p
                      className="text-[#00153B] text-[12px] leading-[28px] font-bold"
                      style={{ fontFamily: "Monospace", fontSize: "16px" }}
                    >
                      {language === "english" ? "Most Popular" : "Más Popular"}
                    </p>
                  </div>
                </div>
                <div>
                  <p
                    className="text-[#00153B] text-[19px] leading-[24px] font-bold"
                    style={{
                      color: "white",
                      fontFamily: "Monospace",
                      fontSize: "24px",
                    }}
                  >
                    {language === "english" ? "Monthly" : "Mensual"}
                  </p>
                  <p
                    className="text-[#00153B] text-[50px] leading-[63px] font-bold"
                    style={{ color: "white" }}
                  >
                    {monthly} USD
                  </p>
                </div>
                <div>
                  <p
                    className="text-[#717F87] text-[18px] leading-[28px] font-medium"
                    style={{ color: "white" }}
                  >
                    {language === "english"
                      ? "  Unlimited Usage"
                      : " Uso Ilimitado"}
                  </p>
                  <p
                    className="text-[#717F87] text-[18px] leading-[28px] font-medium"
                    style={{ color: "white" }}
                  >
                    {language === "english"
                      ? " 1 month activation"
                      : " Activación de 1 mes"}
                  </p>
                </div>
              </div>
              <div className="pt-[25px] px-[25px] pb-[35px]">
                <div>
                  <p
                    className="text-[#717F87] text-[14px] leading-[24px] font-medium"
                    style={{
                      color: "white",
                      fontFamily: "Monospace",
                      fontSize: "16px",
                    }}
                  >
                    {language === "english"
                      ? " → 7 Days Free Bonus In Addition to 1 Month Activation"
                      : " → 7 días de bonificación gratis además de la activación de 1 mes"}
                  </p>
                  <br></br>
                  <p
                    className="text-[#717F87] text-[14px] leading-[24px] font-medium"
                    style={{
                      color: "white",
                      fontFamily: "Monospace",
                      fontSize: "16px",
                    }}
                  >
                    {language === "english"
                      ? " → Everything in the Free Plan + Unlimited Access"
                      : " → Todo en el Plan Gratuito + Acceso Ilimitado"}
                  </p>
                </div>
                <div className="mt-[25px]">
                  <button
                    className="bg-[white] rounded-[5px] py-[15px] px-[25px] text-[#fff] text-[14px] leading-[17px] font-semibold"
                    style={{
                      color: "#283081",
                      fontFamily: "Monospace",
                      fontSize: "18px",
                    }}
                    onClick={handleMonthlyClick}
                  >
                    {window?.Rewardful?.referral ? (
                      <span>
                        {language === "english"
                          ? "Select Plan"
                          : "Seleccionar Plan"}
                      </span>
                    ) : (
                      <Link
                        href={`/paypal?planduration=monthly&priceMonthly=${monthly}&priceYearly=${yearly}`}
                      >
                        {language === "english" ? "Upgrade " : "Mejorar "}
                        <UpgradeIcon />
                      </Link>
                    )}
                  </button>
                </div>
              </div>
            </div>
            <div
              key={3}
              className="w-full bg-[#fff] rounded-[10px] shadow-[0px 1px 2px #E1E3E5] border border-[#E1E3E5] divide-y"
              style={{ background: "#283081" }}
            >
              <div className="pt-[15px] px-[25px] pb-[25px]">
                <div className="flex justify-end">
                  <div className="bg-[#F6F6F7] rounded-[20px] flex justify-center align-center px-[12px]">
                    <p
                      className="text-[#00153B] text-[12px] leading-[28px] font-bold"
                      style={{ fontFamily: "Monospace", fontSize: "16px" }}
                    >
                      {language === "english" ? "Best Value" : "Mejor Valor"}
                    </p>
                  </div>
                </div>
                <div>
                  <p
                    className="text-[#00153B] text-[19px] leading-[24px] font-bold"
                    style={{
                      color: "white",
                      fontFamily: "Monospace",
                      fontSize: "24px",
                    }}
                  >
                    {language === "english" ? "Yearly" : "Anual"}
                  </p>
                  <p
                    className="text-[#00153B] text-[50px] leading-[63px] font-bold"
                    style={{ color: "white" }}
                  >
                    {yearly} USD
                  </p>
                </div>
                <div>
                  <p
                    className="text-[#717F87] text-[18px] leading-[28px] font-medium"
                    style={{
                      color: "white",
                      fontFamily: "Monospace",
                      fontSize: "21px",
                    }}
                  >
                    {language === "english"
                      ? "  Unlimited Usage"
                      : "  Uso Ilimitado"}
                  </p>
                  <p
                    className="text-[#717F87] text-[18px] leading-[28px] font-medium"
                    style={{
                      color: "white",
                      fontFamily: "Monospace",
                      fontSize: "20px",
                    }}
                  >
                    {language === "english"
                      ? "  12 months activation"
                      : "  Activación de 12 meses"}
                  </p>
                </div>
              </div>
              <div className="pt-[25px] px-[25px] pb-[35px]">
                <div>
                  <p
                    className="text-[#717F87] text-[14px] leading-[24px] font-medium"
                    style={{
                      color: "white",
                      fontFamily: "Monospace",
                      fontSize: "16px",
                    }}
                  >
                    {language === "english"
                      ? " → 2 months of free access"
                      : " → 2 meses de acceso gratuito"}
                  </p>
                  <br></br>
                  <p className="text-[#717F87] text-[14px] leading-[24px] font-medium"></p>
                  <p
                    className="text-[#717F87] text-[14px] leading-[24px] font-medium"
                    style={{
                      color: "white",
                      fontFamily: "Monospace",
                      fontSize: "16px",
                    }}
                  >
                    {language === "english"
                      ? " → Everything in the Free Plan + Unlimited Access"
                      : " → Todo en el Plan Gratuito + Acceso Ilimitado"}
                  </p>
                </div>
                <div className="mt-[25px]">
                  <button
                    className="bg-[white] rounded-[5px] py-[15px] px-[25px] text-[#fff] text-[14px] leading-[17px] font-semibold"
                    style={{
                      color: "#283081",
                      fontFamily: "Monospace",
                      fontSize: "18px",
                    }}
                    onClick={handleYearlyClick}
                  >
                    {window?.Rewardful?.referral ? (
                      <span>
                        {language === "english" ? "Upgrade " : "Mejorar "}
                        <UpgradeIcon />
                      </span>
                    ) : (
                      <Link
                        href={`/paypal?planduration=yearly&priceMonthly=${monthly}&priceYearly=${yearly}`}>
                        {language === "english" ? "Upgrade " : "Mejorar "}
                        <UpgradeIcon />
                      </Link>
                    )}
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