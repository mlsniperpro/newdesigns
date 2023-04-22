import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export default function ThankYou() {
  const router = useRouter();
  const [language, setLanguage] = useState("es");

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "es" : "en");
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <Head>
        <title>Thank You Page</title>
      </Head>
      <div className="relative py-3 sm:max-w-xl mx-auto text-center">
        <button
          className="absolute top-4 right-4 bg-blue-500 hover:bg-blue-700 text-white text-sm font-semibold py-1 px-2 rounded"
          onClick={toggleLanguage}
        >
          {language === "en" ? "Cambiar a Español" : "Change to English"}
        </button>
        <span className="text-2xl font-light text-gray-800">
          {language === "en" ? "Thank You!" : "¡Gracias!"}
        </span>
        <div className="mt-4 bg-white shadow-md rounded-lg text-lg text-gray-700 overflow-hidden">
          <div className="py-8 px-8">
            <p className="leading-normal">
              {/*Display the message both in English or Spanish*/}
              {language === "en"
                ? "Thank you for subscribing to Vioniko premium. Dedicated to helping you grow your business."
                : "Gracias por suscribirte a Vioniko premium. Dedicado a ayudarte a hacer crecer tu negocio."}
            </p>
            <div className="mt-6 pt-3">
              <Link href="/">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded">
                  Go Back Home
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
