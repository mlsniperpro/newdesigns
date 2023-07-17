import { useState } from 'react';
import { BsArrowUpRight, BsBookmark } from 'react-icons/bs';
import { FiArrowUpCircle } from 'react-icons/fi';

import Link from 'next/link';

import Topic, { TopicInterface } from './Topic';

import classNames from 'classnames';

export type Prompt = {
  id: string | number;
  title: string;
  categories: TopicInterface[];
  description: string;
  owner: string;
  votes: number;
  bookmarks: number;
  daysPast: number;
  url: string;
};

const PromptItem = ({
  prompt,
  onUpvote,
}: {
  prompt: Prompt;
  onUpvote: (id: string) => Promise<void>;
}) => {
  const {
    id,
    title,
    categories,
    description,
    owner,
    votes,
    bookmarks,
    daysPast,
    url,
  } = prompt;

  return (
    <section className="flex items-start bg-gray-100 rounded-[15px] p-8">
      <div className="xl:basis-3/4 flex flex-col space-y-5">
        <Link href={`/prompt/${url}`} className="font-bold text-lg lg:text-2xl">
          {title}
        </Link>
        <div className="flex items-start flex-wrap gap-2">
          {categories &&
            categories.map((topic) => (
              <Topic
                topic={topic}
                key={topic.id}
                className={classNames(topic.backgroundColor, topic.textColor)}
              />
            ))}
        </div>
        <p className="text-gray-900 text-sm lg:text-lg">{description}</p>
        <div className="flex items-center text-xs space-x-4">
          <h4 className="text-black font-bold">{owner}</h4>
          <div className="flex space-x-2 items-center">
            <BsArrowUpRight className="text-gray-400" />
            <p className="text-gray-900">{votes}</p>
          </div>
          <div className="flex space-x-2 items-center">
            <BsBookmark className="text-gray-400" />
            <p className="text-gray-900">{bookmarks}</p>
          </div>
          <div className="flex space-x-2">
            {prompt.daysPast < 30 ? (
              <p>
                {prompt.daysPast} {prompt.daysPast === 1 ? 'day' : 'days'} ago
              </p>
            ) : prompt.daysPast <= 59 ? (
              <p>1 month ago</p>
            ) : (
              <p>{Math.floor(prompt.daysPast / 30)} months ago</p>
            )}
          </div>
        </div>
      </div>
      <div className="hidden xl:basis-1/4 xl:flex xl:justify-end">
        <div className="flex items-center space-x-4 border border-gray-400 px-3 py-1 rounded-[22px]">
          <p className="text-gray-700 font-light">{votes}</p>
          <button onClick={() => onUpvote(String(id))}>
            <FiArrowUpCircle className="text-gray-700 text-2xl" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default PromptItem;
