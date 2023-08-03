import { useEffect, useState } from 'react';
import { AiOutlineMenu, AiOutlineStar } from 'react-icons/ai';

import Image from 'next/image';
import Link from 'next/link';

import { auth } from '@/config/firebase';

interface NavbarProps {
  onSearch: (searchQuery: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const admin =
      auth.currentUser?.uid === 'fcJAePkUVwV7fBR3uiGh5iyt2Tf1' ||
      auth.currentUser?.uid === 'M8LwxAfm26SimGbDs4LDwf1HuCb2';
    setIsAdmin(admin);
  }, [auth.currentUser?.uid]);

  const handleNavClick = () => {
    setIsNavOpen(!isNavOpen);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value); // Pass the new search query up to the parent component
  };

  return (
    <nav className="flex justify-between items-center bg-white text-black px-8 py-4">
      <section className="flex items-center space-x-4">
        <Link href="/">
          <div className="flex items-center">
            <Image src="/icon.jpg" alt="" width={50} height={50} />
          </div>
        </Link>
        <div className="relative">
          <input
            type="search"
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearchChange}
            className="border border-black px-4 py-2 rounded-[10px] w-full bg-gray-200 text-black"
          />
        </div>
      </section>

      <section className="flex items-center space-x-4">
        <Link href="/prompt/create">
          <div className="bg-gray-200 text-black rounded-[22px] px-4 py-2 flex items-center">
            <AiOutlineStar className="inline-block mr-2" />
            Create
          </div>
        </Link>
        {isAdmin && (
          <Link href="/prompt/createtopics">
            <div className="bg-gray-200 text-black rounded-[22px] px-4 py-2 flex items-center">
              <AiOutlineStar className="inline-block mr-2" />
              CreateTopic
            </div>
          </Link>
        )}
        {isAdmin && (
          <Link href="/prompt/reportedcomment">
            <div className="bg-gray-200 text-black rounded-[22px] px-4 py-2 flex items-center">
              <AiOutlineStar className="inline-block mr-2" />
              ReportedComments
            </div>
          </Link>
        )}
        {isAdmin && (
          <Link href="/prompt/approve">
            <div className="bg-gray-200 text-black rounded-[22px] px-4 py-2 flex items-center">
              <AiOutlineStar className="inline-block mr-2" />
              Approve
            </div>
          </Link>
        )}
      </section>
    </nav>
  );
};

export default Navbar;
