'use client';

import { useState } from 'react';
import { useEffect } from 'react';
import { AiOutlineMenu, AiOutlineStar } from 'react-icons/ai';
import {
  BsArrowUpRight,
  BsFillBagFill,
  BsFire,
  BsLaptop,
  BsPen,
  BsSearch,
} from 'react-icons/bs';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import SearchIcon from '../../public/icon.jpg';
import { Prompt } from './PromptItem';
import { TopicInterface } from './Topic';

import { db } from '@/config/firebase';
import { collection, getDocs } from 'firebase/firestore';

interface PromptInterface {
  id: string | number;
  title: string;
  categories: TopicInterface[]; // change to TopicInterface[] if that's what Prompt expects
  description: string;
  owner: string;
  votes: number;
  bookmarks: number;
  daysPast: number;
  url: string;
}

const Navbar = () => {
  const [allPrompts, setAllPrompts] = useState<Prompt[]>([]);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([]);
  const handleNavClick = () => {
    setIsNavOpen(!isNavOpen);
  };
useEffect(() => {
  // fetch prompts from Firestore when the component mounts
  console.log('i am now fetching prompts');
  const fetchPrompts = async () => {
    const querySnapshot = await getDocs(collection(db, 'prompts'));
    const fetchedPrompts: PromptInterface[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      fetchedPrompts.push({
        id: doc.id,
        title: data.title,
        categories: data.categories,
        description: data.description,
        owner: data.owner,
        votes: data.votes,
        bookmarks: data.bookmarks,
        daysPast: Math.ceil(
          Math.abs(
            new Date().getTime() - new Date(data.dayPosted).getTime(),
          ) /
            (1000 * 60 * 60 * 24),
        ),
        url: data.url,
      });
    });
    setAllPrompts(fetchedPrompts);
    setFilteredPrompts(fetchedPrompts);
  };

  fetchPrompts();
}, []);

const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const searchValue = e.target.value;
  setSearchQuery(searchValue);
  if (searchValue === '') {
    setFilteredPrompts(allPrompts);
  } else {
    setFilteredPrompts(
      allPrompts.filter(
        (prompt) =>
          prompt.title.toLowerCase().includes(searchValue.toLowerCase()) ||
          prompt.description
            .toLowerCase()
            .includes(searchValue.toLowerCase()),
      ),
    );
  }
};



  const handleFocus = () => {
    setIsInputFocused(true);
  };

  const router = useRouter();

  const Menu = () => (
    <>
      <Link href="/prompts" className="hover:text-gray-900">
        Prompts
      </Link>
      <Link href="/chat" className="hover:text-gray-900">
        Chat
      </Link>
      <Link href="/tutor" className="hover:text-gray-900">
        Tutor
      </Link>
      <a
        href="https://vioniko.com/soporte/index.php"
        className="hover:text-gray-900"
      >
        Support
      </a>
    </>
  );

  const MobileMenu = () => (
    <>
      <Link
        href="/prompt/create"
        className="bg-black text-white rounded-[22px] px-12 py-2 flex items-center"
      >
        <AiOutlineStar className="inline-block mr-2" />
        Create
      </Link>

      <a href="" className="hover:text-gray-900 lg:hover:underline">
        Topics
      </a>
      <a href="" className="hover:text-gray-900 lg:hover:underline">
        Roadmap
      </a>
      <a href="" className="hover:text-gray-900 lg:hover:underline">
        Feature Requests
      </a>
      <a href="" className="hover:text-gray-900 lg:hover:underline">
        Support
      </a>
    </>
  );

  return (
    <nav className="flex justify-between space-x-4 lg:px-16 2xl:px-52 px-8 py-8">
      <section className="flex space-x-4 justify-between">
        <div className="flex space-x-4 justify-between">
          <Link href="/" className="flex items-center">
            <Image src={SearchIcon} alt="" />
          </Link>
          <div className="">
            <input
              type="search"
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={handleFocus}
              className="border border-gray-400 px-4 py-2 rounded-[10px] w-full"
            />
            {isInputFocused && (
              <div className="absolute bg-white opacity-100 p-4 top-[100px] flex flex-col space-y-6 max-h-[600px] overflow-auto">
                {filteredPrompts.map((prompt) => (
                  <Link
                    href={`/prompt/${prompt.url}`}
                    key={prompt.id}
                  >
                    <div className="flex flex-col space-y-4">
                      <h4 className="font-semibold text-sm">{prompt.title}</h4>
                      <div className="flex items-center text-xs space-x-4">
                        <h4 className="text-black font-light">
                          {prompt.owner}
                        </h4>
                        <div className="flex space-x-2 items-center">
                          <BsArrowUpRight className="text-pink-400" />
                          <p className="text-gray-900">{prompt.votes}</p>
                        </div>
                        <div className="flex space-x-2">
                          {prompt.daysPast < 30 ? (
                            <p>
                              {prompt.daysPast}{' '}
                              {prompt.daysPast === 1 ? 'day' : 'days'} ago
                            </p>
                          ) : prompt.daysPast <= 59 ? (
                            <p>1 month ago</p>
                          ) : (
                            <p>{Math.floor(prompt.daysPast / 30)} months ago</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="py-4">
                      <hr className="border border-gray-200" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
        {isInputFocused && (
          <div
            onClick={() => setIsInputFocused(false)}
            className="hidden xl:grid xl:place-items-center xl:pl-10 cursor-pointer"
          >
            <AiOutlineMenu className="text-3xl" />
          </div>
        )}
        {/* desktop menu */}
        {!isInputFocused && (
          <div className="hidden xl:flex xl:space-x-4 xl:items-center text-gray-600">
            <Menu />
          </div>
        )}
        {/* mobile menu */}
        {isNavOpen && (
          <div className="xl:hidden flex flex-col space-y-4 items-center absolute bg-white h-screen w-full right-2 top-[100px] opacity-100 py-8">
            <MobileMenu />
          </div>
        )}
      </section>
      <div
        onClick={handleNavClick}
        className="grid place-items-center xl:hidden"
      >
        <AiOutlineMenu className="text-4xl" />
      </div>

      <section className="hidden xl:flex xl:space-x-4">
        <Link
          href="/prompt/create"
          className="bg-black text-white rounded-[22px] px-4 py-2 flex items-center"
        >
          <AiOutlineStar className="inline-block mr-2" />
          Create
        </Link>
      </section>
    </nav>
  );
};

export default Navbar;
