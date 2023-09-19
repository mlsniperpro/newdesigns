import { useEffect, useState } from 'react';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import Link from 'next/link';
import Router from 'next/router';

import useSubscription from '@/hooks/useSubscription';

import fetchResponse from '@/utils/fetchResponse';

import ChatBody from '@/components/ChatBody';
import ChatInput from '@/components/ChatInput';

import { auth } from '../config/firebase';

import HomeIcon from '@mui/icons-material/Home';
import LanguageIcon from '@mui/icons-material/Language';

function Tutor() {
  const [user, userLoading] = useAuthState(auth);
  const [firstMessage, setFirstMessage] = useState(false);
  const [language, setLanguage] = useState('spanish');
  const [chat, setChat] = useState([]);
  const { subscriptionDetails, loading } = useSubscription(user);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (
      !subscriptionDetails.subscribed &&
      !(subscriptionDetails.paypalStatus === 'ACTIVE') &&
      !loading &&
      user
    ) {
      Router.push('/');
    }
  }, [loading]);

  useEffect(() => {
    if (language === 'en') {
      setChat([
        {
          role: 'system',
          content: `Imagine you're a seasoned global advertising copywriter with over two decades of experience. Your role is to engage in a systematic interaction, employing a step-by-step approach reminiscent of an interview with a client. Your aim is to deeply understand their requirements, allowing you to offer an impeccable proposal for their advertising copywriting needs. To facilitate this process, kindly present response options in a numbered list format, simplifying the answering process.

Once user writes the word START you Commence by addressing this initial query: What style of copywriting do you have in mind? Please select from the following options by using the corresponding numbers:

Landing page
Sales letter
Email marketing
Blog writing
Video script
YouTube video script
Facebook ad
Google ad
Cold direct message
Cold email
Instagram story idea
YouTube video idea
Twitter text
Lead magnet
Marketing campaign
Promptly await the client's response before proceeding to the subsequent question. Your guidance will be pivotal in achieving an optimal advertising copywriting solution.`,
        },
      ]);
    } else {
      setChat([
        {
          role: 'system',
          content: `Imagínese que es un experimentado redactor publicitario global con más de dos décadas de experiencia. Su función es participar en una interacción sistemática, empleando un enfoque paso a paso que recuerda a una entrevista con un cliente. Su objetivo es comprender profundamente sus requisitos, lo que le permitirá ofrecer una propuesta impecable para sus necesidades de redacción publicitaria. Para facilitar este proceso, presente amablemente las opciones de respuesta en un formato de lista numerada, simplificando el proceso de respuesta.

En cuanto el usuario escriba la palabra INICIO, Comience abordando con esta consulta inicial: ¿Qué estilo de redacción publicitaria tiene en mente? Por favor, seleccione una de las siguientes opciones utilizando los números correspondientes:

Página de aterrizaje
Carta de ventas
Marketing por correo electrónico
Escritura de blogs
Guión de video
Guión de video de YouTube
Anuncio de Facebook
Anuncio de Google
Mensaje directo en frío
Correo electrónico en frío
Idea para una historia de Instagram
Idea para un video de YouTube
Texto de Twitter
Imán de leads
Campaña de marketing
Espere prontamente la respuesta del cliente antes de pasar a la siguiente pregunta. Su orientación será fundamental para lograr una solución óptima de redacción publicitaria.`,
        },
      ]);
    }
  }, [language]);
  function changeLanguage() {
    if (language === 'en') {
      setLanguage('spanish');
    } else if (language === 'spanish') {
      setLanguage('en');
    } else {
      setLanguage('spanish');
    }
  }

  const sendMessage = async (message) => {
    setChat((prev) => [...prev, message]);
    setIsLoading(true);

    // Append an initial empty assistant message
    setChat((prev) => [...prev, { role: 'assistant', content: '' }]);

    try {
      const reader = await fetchResponse(chat, user.uid);
      let assistantMessage = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const textChunk = new TextDecoder().decode(value);

        const match = textChunk.match(/data: (.*?})\s/);
        if (match && match[1]) {
          const jsonData = JSON.parse(match[1]);
          if (
            jsonData.choices &&
            jsonData.choices[0] &&
            jsonData.choices[0].delta &&
            jsonData.choices[0].delta.content
          ) {
            assistantMessage += jsonData.choices[0].delta.content;
            setChat((prev) => {
              // Replace the last message with the updated assistant message
              return prev.map((msg, index) =>
                index === prev.length - 1
                  ? { role: 'assistant', content: assistantMessage }
                  : msg,
              );
            });
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="bg-[#1A232E] h-screen py-6 relative sm:px-16 px-12 text-white overflow-hidden flex flex-col justify-between  align-middle w-screen"
      style={{ background: 'rgb(40, 48, 129)' }}
    >
      <div className="gradient-01 z-0 absolute"></div>
      <div className="gradient-02 z-0 absolute"></div>
      <div className="uppercase font-bold  text-2xl text-center mb-3">
        <h1 style={{ fontFamily: 'Monospace', fontSize: '30px' }}>
          {language === 'en'
            ? 'VIONIKO AI Copywriting Tutor'
            : 'Tutor vioniko de redacción publicitaria de IA'}
        </h1>
      </div>
      <div>
        <Link href="/">
          <button
            className="block uppercase mx-auto shadow bg-indigo-800 hover:bg-indigo-700 focus:shadow-outline focus:outline-none text-white text-xs py-3 px-10 rounded"
            style={{
              background: 'white',
              color: 'rgb(40, 48, 129)',
              width: '200px',
              fontFamily: 'Monospace',
              fontSize: '18px',
            }}
          >
            <HomeIcon /> {language === 'en' ? 'Home' : 'Inicio'}
          </button>
        </Link>
        <button
          onClick={changeLanguage}
          className="block mt-6 uppercase mx-auto shadow bg-indigo-800 hover:bg-indigo-700 focus:shadow-outline focus:outline-none text-white text-xs py-3 px-10 rounded"
          style={{
            background: 'white',
            color: 'rgb(40, 48, 129)',
            width: '300px',
            fontFamily: 'Monospace',
            fontSize: '18px',
            marginBottom: '10px',
          }}
        >
          <LanguageIcon style={{ marginRight: '10px' }} />
          {language === 'en' ? 'Switch to Spanish' : 'Cambiar a Inglés'}
        </button>
        {!firstMessage && (
          <p
            className=" mx-auto"
            style={{
              width: '300px',
              fontSize: '18px',
              marginBottom: '10px',
            }}
          >
            {language === 'en'
              ? 'NOTE: To start interacting with the TUTOR , write this word : START'
              : 'NOTA: Para comenzar a interactuar con el TUTOR, teclee esta palabra : INICIO'}
          </p>
        )}
      </div>
      <div
        className="h-[70%] overflow-auto w-full max-w-4xl min-w-[20rem] py-8 px-4 self-center
      scrollbar-thumb-slate-400 scrollbar-thin scrollbar-track-gray-tranparent scrollbar-thumb-rounded-md
      "
        style={{ border: '1px solid #fff' }}
      >
        <ChatBody chat={chat.slice(1)} />
      </div>
      <div
        className="w-full max-w-4xl min-w-[20rem] self-center"
        style={{ border: '1px solid #fff' }}
      >
        <ChatInput
          sendMessage={sendMessage}
          loading={isLoading}
          style={{
            border: '1px solid white',
            fontFamily: 'Monospace',
            fontSize: '20px',
          }}
        />
      </div>
    </div>
  );
}

export default Tutor;
