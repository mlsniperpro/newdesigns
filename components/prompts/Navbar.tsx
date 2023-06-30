"use client";
import { useState } from "react";
import { AiOutlineMenu, AiOutlineStar } from "react-icons/ai";
import { BsArrowUpRight, BsFillBagFill, BsFire, BsLaptop, BsPen, BsSearch } from "react-icons/bs";



import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";



import SearchIcon from "../../public/icon.jpg";
import { Prompt } from "./PromptItem";


const prompts: Prompt[] = [
  {
    id: 1,
    title: "How to make a good first impression",
    categories: [
      {
        id: 4,
        icon: <BsLaptop />,
        title: "Development",
        backgroundColor: "bg-green-600",
        textColor: "text-green-900",
      },
    ],
    description:
      "Making a good first impression involves being nice and friendly and also being confident in yourself.",
    owner: "John Doe",
    votes: 10,
    bookmarks: 5,
    daysPast: 69,
  },

  {
    id: 2,
    title: "The dynamics of a good first impression",
    categories: [
      {
        id: 1,
        icon: <BsFire />,
        title: "Marketing",
        backgroundColor: "bg-orange-200",
        textColor: "text-orange-900",
      },
      {
        id: 4,
        icon: <BsLaptop />,
        title: "Development",
        backgroundColor: "bg-green-600",
        textColor: "text-green-900",
      },

      {
        id: 5,
        icon: <BsPen />,
        title: "Writing",
        backgroundColor: "bg-blue-400",
        textColor: "text-blue-900",
      },
    ],
    description:
      "Making a good first impression involves being nice and friendly and also being confident in yourself.",
    owner: "John Doe",
    votes: 10,
    bookmarks: 5,
    daysPast: 32,
  },
  {
    id: 3,
    title: "How to give a great first impression",
    categories: [
      {
        id: 1,
        icon: <BsFire />,
        title: "Marketing",
        backgroundColor: "bg-orange-200",
        textColor: "text-orange-900",
      },
      {
        id: 2,
        icon: <BsFillBagFill />,
        title: "Business",
        backgroundColor: "bg-blue-200",
        textColor: "text-blue-900",
      },
    ],
    description:
      "Making a good first impression involves being nice and friendly and also being confident in yourself.",
    owner: "John Doe",
    votes: 10,
    bookmarks: 5,
    daysPast: 1,
  },
  {
    id: 4,
    title: "How to get the most out of your first meetup",
    categories: [
      {
        id: 4,
        icon: <BsLaptop />,
        title: "Development",
        backgroundColor: "bg-green-600",
        textColor: "text-green-900",
      },

      {
        id: 5,
        icon: <BsPen />,
        title: "Writing",
        backgroundColor: "bg-blue-400",
        textColor: "text-blue-900",
      },
    ],
    description:
      "Making a good first impression involves being nice and friendly and also being confident in yourself.",
    owner: "John Doe",
    votes: 10,
    bookmarks: 5,
    daysPast: 2,
  },
  {
    id: 5,
    title: "How to make a good first impression",
    categories: [
      {
        id: 1,
        icon: <BsFire />,
        title: "Marketing",
        backgroundColor: "bg-orange-200",
        textColor: "text-orange-900",
      },
    ],
    description:
      "Making a good first impression involves being nice and friendly and also being confident in yourself.",
    owner: "John Doe",
    votes: 10,
    bookmarks: 5,
    daysPast: 2,
  },
  {
    id: 6,
    title: "How to make a good first impression",
    categories: [
      {
        id: 2,
        icon: <BsFillBagFill />,
        title: "Business",
        backgroundColor: "bg-blue-200",
        textColor: "text-blue-900",
      },
    ],
    description:
      "Making a good first impression involves being nice and friendly and also being confident in yourself.",
    owner: "John Doe",
    votes: 10,
    bookmarks: 5,
    daysPast: 2,
  },
  {
    id: 7,
    title: "How to make a good first impression",
    categories: [
      {
        id: 1,
        icon: <BsFire />,
        title: "Marketing",
        backgroundColor: "bg-orange-200",
        textColor: "text-orange-900",
      },
      {
        id: 2,
        icon: <BsFillBagFill />,
        title: "Business",
        backgroundColor: "bg-blue-200",
        textColor: "text-blue-900",
      },

      {
        id: 3,
        icon: <BsSearch />,
        title: "SEO",
        backgroundColor: "bg-purple-400",
        textColor: "text-purple-900",
      },

      {
        id: 4,
        icon: <BsLaptop />,
        title: "Development",
        backgroundColor: "bg-green-600",
        textColor: "text-green-900",
      },

      {
        id: 5,
        icon: <BsPen />,
        title: "Writing",
        backgroundColor: "bg-blue-400",
        textColor: "text-blue-900",
      },
    ],
    description:
      "Making a good first impression involves being nice and friendly and also being confident in yourself.",
    owner: "John Doe",
    votes: 10,
    bookmarks: 5,
    daysPast: 2,
  },
  {
    id: 8,
    title: "How to practice self compassion consistently",
    categories: [
      {
        id: 1,
        icon: <BsFire />,
        title: "Marketing",
        backgroundColor: "bg-orange-200",
        textColor: "text-orange-900",
      },
      {
        id: 2,
        icon: <BsFillBagFill />,
        title: "Business",
        backgroundColor: "bg-blue-200",
        textColor: "text-blue-900",
      },

      {
        id: 4,
        icon: <BsLaptop />,
        title: "Development",
        backgroundColor: "bg-green-600",
        textColor: "text-green-900",
      },

      {
        id: 5,
        icon: <BsPen />,
        title: "Writing",
        backgroundColor: "bg-blue-400",
        textColor: "text-blue-900",
      },
    ],
    description:
      "Making a good first impression involves being nice and friendly and also being confident in yourself.",
    owner: "John Doe",
    votes: 10,
    bookmarks: 5,
    daysPast: 2,
  },
  {
    id: 9,
    title: "How to get the perfect abs in 2 months",
    categories: [
      {
        id: 3,
        icon: <BsSearch />,
        title: "SEO",
        backgroundColor: "bg-purple-400",
        textColor: "text-purple-900",
      },

      {
        id: 4,
        icon: <BsLaptop />,
        title: "Development",
        backgroundColor: "bg-green-600",
        textColor: "text-green-900",
      },
    ],
    description:
      "Making a good first impression involves being nice and friendly and also being confident in yourself.",
    owner: "John Doe",
    votes: 10,
    bookmarks: 5,
    daysPast: 2,
  },
  {
    id: 10,
    title: "How to be a straight A student",
    categories: [
      {
        id: 1,
        icon: <BsFire />,
        title: "Marketing",
        backgroundColor: "bg-orange-200",
        textColor: "text-orange-900",
      },
      {
        id: 5,
        icon: <BsPen />,
        title: "Writing",
        backgroundColor: "bg-blue-400",
        textColor: "text-blue-900",
      },
    ],
    description:
      "Making a good first impression involves being nice and friendly and also being confident in yourself.",
    owner: "John Doe",
    votes: 10,
    bookmarks: 5,
    daysPast: 2,
  },
];

const Navbar = () => {
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([]);

  const handleNavClick = () => {
    setIsNavOpen(!isNavOpen);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    setSearchQuery(searchValue);
    if (searchValue === "") {
      setFilteredPrompts([]);
    } else {
      setFilteredPrompts(
        prompts.filter(
          (prompt) =>
            prompt.title.toLowerCase().includes(searchValue.toLowerCase()) ||
            prompt.description.toLowerCase().includes(searchValue.toLowerCase())
        )
      );
    }
  };

  const handleFocus = () => {
    setIsInputFocused(true);
  };

  const router = useRouter();

  const Menu = () => (
    <>
      <a href="" className="hover:text-gray-900">
        Topics
      </a>
      <a href="" className="hover:text-gray-900">
        Roadmap
      </a>
      <a href="" className="hover:text-gray-900">
        Feature Requests
      </a>
      <a href="" className="hover:text-gray-900">
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
                    href={`/prompt/${prompt.title
                      .replace(/\s+/g, "-")
                      .toLowerCase()}`}
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
                              {prompt.daysPast}{" "}
                              {prompt.daysPast === 1 ? "day" : "days"} ago
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