// pos breakpoint is not part of the tailwind breakpoints - customized in tailwind.config.js file
"use client";
import Topic, { TopicInterface } from "./Topic";
import classNames from "classnames";
import { CiSun } from "react-icons/ci";
import { RxCaretDown, RxCaretUp } from "react-icons/rx";
import {
  BsFillBagFill,
  BsFire,
  BsLaptop,
  BsPen,
  BsSearch,
} from "react-icons/bs";
import { useState } from "react";

const trendingTopics: TopicInterface[] = [
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
];

const Header = () => {
  const [timePeriodClicked, setTimePeriodClicked] = useState(false);
  const [upvotesClicked, setUpvotesClicked] = useState(false);
  const [selectedTimePeriod, setSelectedTimePeriod] = useState<string>("");

  const handleUpvotesClicked = () => {
    setTimePeriodClicked(false);
    setUpvotesClicked(!upvotesClicked);
  };
  const handleTimeClicked = () => {
    setUpvotesClicked(false);
    setTimePeriodClicked(!timePeriodClicked);
  };

  const handleTimePeriod = (period: string) => {
    setSelectedTimePeriod(period);
  };

  return (
    <section className="2xl:px-52 px-8 lg:px-16 py-8 flex flex-col space-y-6 xl:space-y-0 xl:flex-row xl:justify-between">
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
            <div className="bg-gray-100 text-sm flex items-center rounded-[15px] p-4 space-x-2 lg:space-x-4 absolute bottom-[660px] pos:right-[50px] lg:bottom-[650px] 2xl:bottom-[699px]">
              <p
                className="hover:underline hover:cursor-pointer"
                onClick={() => handleTimePeriod("today")}
              >
                Today
              </p>
              <p
                className="hover:underline hover:cursor-pointer"
                onClick={() => handleTimePeriod("thisWeek")}
              >
                This Week
              </p>
              <p
                className="hover:underline hover:cursor-pointer"
                onClick={() => handleTimePeriod("thisMonth")}
              >
                This Month
              </p>
              <p
                className="hover:underline hover:cursor-pointer"
                onClick={() => handleTimePeriod("alltime")}
              >
                All time
              </p>
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
      <section className="flex flex-col space-y-3 lg:space-y-0 lg:flex-row lg:space-x-2 items-center">
        <h3 className="self-start lg:self-center">Trending</h3>
        <div className="flex items-center space-x-1 gap-2 flex-wrap">
          {trendingTopics.map((topic) => (
            <Topic
              topic={topic}
              key={topic.id}
              className={classNames(topic.backgroundColor, topic.textColor)}
            />
          ))}
        </div>
      </section>
    </section>
  );
};

export default Header;
