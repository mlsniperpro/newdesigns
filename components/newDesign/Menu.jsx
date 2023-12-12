'use client';

import { useState } from 'react';

import Image from 'next/image';

import icon2 from '../../../public/Icono menu (1).png';
import icon3 from '../../../public/Icono menu (2).png';
import icon4 from '../../../public/Icono menu (3).png';
import icon5 from '../../../public/Icono menu (4).png';
import icon6 from '../../../public/Icono menu (5).png';
import icon7 from '../../../public/Icono menu (6).png';
import icon8 from '../../../public/Icono menu (7).png';
import icon9 from '../../../public/Icono menu (8).png';
import icon10 from '../../../public/Icono menu (9).png';
import icon11 from '../../../public/Icono menu (10).png';
import icon12 from '../../../public/Icono menu (11).png';
import icon13 from '../../../public/Icono menu (12).png';
import icon1 from '../../../public/Icono menu.png';
import MenuIcon from '../../../public/Menu.svg';
import Language from './Language';
import MenuItem from './MenuItem';

const items = [
  { icon: icon1, text: 'English' },
  { icon: icon2, text: 'Actualizar' },
  { icon: icon3, text: 'guiado' },
  { icon: icon4, text: 'chat' },
  { icon: icon5, text: 'prompts' },
  { icon: icon6, text: 'palabra clave' },
  { icon: icon7, text: 'perfil' },
  { icon: icon8, text: 'tutor' },
  { icon: icon9, text: 'youTube' },
  { icon: icon10, text: 'Buscador Vioniko' },
  { icon: icon11, text: 'Analizador de Documentos VK' },
  { icon: icon12, text: 'cancelar' },
  { icon: icon13, text: 'cerrar sesión' },
];

const Menu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <div className="w-60 relative">
      <div
        className={`text-Oscuro1 bg-Claro1 pl-7 pb-3 md:block ${
          isMenuOpen ? 'block absolute top-0 left-0 z-30' : 'hidden'
        }`}
      >
        <h2 className="texto5 uppercase">Menú</h2>
        {items.map((item) => (
          <MenuItem key={item.text} icon={item.icon} text={item.text} />
        ))}
      </div>
      <div className="mt-2 hidden md:block">
        <Language />
      </div>
      <button
        className={`md:hidden block border border-slate-300 mt-3 ml-5 transition-all ${
          isMenuOpen ? 'absolute translate-x-60 -translate-y-2 z-40' : ''
        }`}
        onClick={() => setIsMenuOpen((isMenuOpen) => !isMenuOpen)}
      >
        <Image src={MenuIcon} alt='MenuIcon'/>
      </button>
    </div>
  );
};

export default Menu;
