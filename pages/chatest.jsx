'use client';

import { useState } from 'react';

import Image from 'next/image';

import Button from '@/components/newDesign/Button';
import Search from '@/components/newDesign/Search';
import SidebarInput from '@/components/newDesign/SidebarInput';

import Logo from '@/public/Logo-Blue.svg';
import SearchIcon from '@/public/Search.svg';
import NewChat from '@/public/new-chat.svg';
import Folder from '@/public/new-folder.svg';
import Settings from '@/public/settings.svg';

const Page = () => {
  const [value, setValue] = useState(0.5);
  return (
    <div className="flex relative flex-col md:flex-row">
      <div className="lg:fixed left-0">
        <Sidebar isLeft={true} />
      </div>
      <div className="hidden lg:block lg:fixed right-0">
        <Sidebar isLeft={false} />
      </div>
      <div className="lg:mx-auto mt-10 flex flex-col gap-2 mb-20 md:mb-52 text-Oscuro1 px-5 md:px-14 relative h-[90svh]">
        <Image src={Logo} className="mx-auto w-[164px] lg:w-[532px]" />
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
            {value}
          </span>
          <input
            type="range"
            className="mx-auto w-[320px] lg:w-[500px]"
            min={0}
            max={1}
            step={0.01}
            onChange={(e) => setValue(e.target.value)}
          />
          <span className="absolute left-0 -bottom-4">Preciso</span>
          <span className="absolute left-1/2 -translate-x-1/2 -bottom-4">
            Neutral
          </span>
          <span className="absolute right-0 -bottom-4">Creativo</span>
        </div>
        <div className="w-full mt-10 md:mt-20">
          <Search />
        </div>
      </div>
    </div>
  );
};

const Sidebar = ({ isLeft }) => {
  return (
    <aside className="bg-[#e9edf1] gap-7 h-max w-full md:h-screen md:w-64 flex flex-col justify-center md:justify-between text-Oscuro1 px-5 pt-5 pb-5">
      <header className="flex justify-between items-center md:block">
        <div className="flex justify-start gap-2 md:justify-between items-center">
          <div className="flex gap-2 font-['Lato'] leading-tight">
            <Image src={NewChat} />
            Nuevo Chat
          </div>
          <div className="p-2 bg-Claro1">
            <Image src={Folder} />
          </div>
        </div>
        <div className="md:hidden flex gap-3 text-xl font-bold font-['Lato'] uppercase leading-tight">
          <Image src={Settings} />
          Ajustes
        </div>
        <Image src={SearchIcon} className="block md:hidden" />
        <div className="mt-4 hidden md:block">
          <SidebarInput />
        </div>
      </header>
      <footer className={`${isLeft ? '' : 'hidden'}`}>
        <div className="hidden md:flex gap-3 text-xl font-bold font-['Lato'] uppercase leading-tight mb-11">
          <Image src={Settings} />
          Ajustes
        </div>
        <Button text={'Menú Vioniko'} />
      </footer>
    </aside>
  );
};

export default Page;
