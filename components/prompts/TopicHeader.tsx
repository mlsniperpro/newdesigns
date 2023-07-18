// `pos` breakpoint is not part of the tailwind breakpoints - customized in tailwind.config.js file
"use client";

import { useState } from "react";
import { BsFire } from "react-icons/bs";
import { CiSun } from "react-icons/ci";
import { RxCaretDown, RxCaretUp } from "react-icons/rx";


// `pos` breakpoint is not part of the tailwind breakpoints - customized in tailwind.config.js file


export type TopicPage = {
  id: string; // Change this to string
  slug: string;
  icon: JSX.Element;
  title: string;
  prompts: number;
  followers: number;
  summary: string;
};


const TopicHeader = ({ topic }: { topic: TopicPage }) => {
  const { icon, title, prompts, followers, summary } = topic;
  const [timePeriodClicked, setTimePeriodClicked] = useState(false);
  const [upvotesClicked, setUpvotesClicked] = useState(false);

  const handleUpvotesClicked = () => {
    setTimePeriodClicked(false);
    setUpvotesClicked(!upvotesClicked);
  };
  const handleTimeClicked = () => {
    setUpvotesClicked(false);
    setTimePeriodClicked(!timePeriodClicked);
  };

  return (
    <header className="2xl:px-52 px-8 lg:px-16 py-8 flex flex-col space-y-6">
      <section className="flex flex-col space-y-4">
        <section className="flex items-center space-x-4">
          <div className="text-5xl">{icon}</div>
          <h3>{title}</h3>
          <button className="bg-black text-white rounded-[15px] px-3 py-2">
            Follow
          </button>
        </section>
        <section className="flex space-x-6">
          <div className="flex items-center space-x-6">
            <div className="flex flex-col space-y-3">
              <p className="text-black font-black">{prompts}</p>
              <p className="text-gray-600">Prompts</p>
            </div>
            <div className="flex flex-col space-y-3">
              <p className="text-black font-black">{followers}</p>
              <p className="text-gray-600">Followers</p>
            </div>
          </div>
          <div>
            <p>{summary}</p>
          </div>
        </section>
      </section>
      <section className="flex space-x-4 items-center">
        <a
          href=""
          className="flex space-x-1 lg:space-x-3 items-center border border-gray-400 rounded-[20px] px-5 py-2"
        >
          <CiSun className="text-yellow-500 text-sm lg:text-2xl" />
          <p className="text-sm">New</p>
        </a>
        <div className="flex flex-col space-y-2">
          <button
            onClick={handleTimeClicked}
            className="flex space-x-1 lg:space-x-3 items-center border border-gray-400 rounded-[20px] px-5 py-2 w-fit"
          >
            <BsFire className="text-red-600 text-sm lg:text-2xl" />
            <p className="text-sm">This Week</p>

            {timePeriodClicked ? (
              <RxCaretUp className="text-lg lg:text-2xl" />
            ) : (
              <RxCaretDown className="text-lg lg:text-2xl" />
            )}
          </button>
          {timePeriodClicked && (
            <div className="bg-gray-100 text-sm flex items-center rounded-[15px] p-4 space-x-2 lg:space-x-4 absolute bottom-[660px] pos:right-[50px] lg:bottom-[650px] 2xl:bottom-[600px]">
              <p className="hover:underline hover:cursor-pointer">Today</p>
              <p className="hover:underline hover:cursor-pointer">This Week</p>
              <p className="hover:underline hover:cursor-pointer">This Month</p>
              <p className="hover:underline hover:cursor-pointer">All time</p>
            </div>
          )}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleUpvotesClicked}
            className="flex items-center space-x-1 lg:space-x-3"
          >
            <p className="text-sm">Upvotes</p>

            {upvotesClicked ? (
              <RxCaretUp className="text-lg lg:text-2xl" />
            ) : (
              <RxCaretDown className="text-lg lg:text-2xl" />
            )}
          </button>
          {upvotesClicked && (
            <div className="bg-gray-100 text-sm flex flex-col rounded-[15px] p-4 space-y-4 absolute pos:bottom-[590px] pos:right-[20px] lg:left-[500px] 2xl:left-[660px]">
              <p className="hover:underline hover:cursor-pointer">Upvotes</p>
              <p className="hover:underline hover:cursor-pointer">Most Uses</p>
              <p className="hover:underline hover:cursor-pointer">Most Saved</p>
            </div>
          )}
        </div>
      </section>
    </header>
  );
};

export default TopicHeader;