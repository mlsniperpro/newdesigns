'use client';

import { useState } from 'react';
import { BsArrowUpRightCircle } from 'react-icons/bs';
import { FiArrowUpCircle } from 'react-icons/fi';

const CreatePrompt = () => {
  const [upvotes, setUpvotes] = useState<number>(0);
  return (
    <section className="p-8">
      <div className="flex justify-center items-center space-x-4 border border-gray-400 py-2 lg:py-3 lg:pl-16 lg:pr-4 rounded-[22px]">
        <div className="flex items-center space-x-2 font-bold">
          <p className="text-gray-700 text-sm">Upvote</p>
          <p className="text-gray-700 text-lg font-light">{upvotes}</p>
        </div>
        <button onClick={() => setUpvotes(upvotes + 1)} className="self-end">
          <FiArrowUpCircle className="text-gray-700 text-2xl lg:text-4xl" />
        </button>
      </div>
      <section className="flex flex-col pt-10">
        <h3 className="text-xl font-bold pb-4">Edit Tags</h3>
        <form action="" className="flex flex-col space-y-6">
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="name"
              className="bg-yellow-200 text-yellow-600 w-fit"
            >
              #name
            </label>
            <input
              type="text"
              placeholder="Type something"
              className="py-3 px-8 border border-gray-400 rounded-[15px]"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="name" className="bg-pink-200 text-pink-600 w-fit">
              #fitness goal
            </label>
            <input
              type="text"
              placeholder="Type something"
              className="py-3 px-8 border border-gray-400 rounded-[15px]"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="name" className="bg-blue-200 text-blue-600 w-fit">
              #workout style
            </label>
            <input
              type="text"
              placeholder="Type something"
              className="py-3 px-8 border border-gray-400 rounded-[15px]"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="name" className="bg-green-200 text-green-600 w-fit">
              #muscle group 1
            </label>
            <input
              type="text"
              placeholder="Type something"
              className="py-3 px-8 border border-gray-400 rounded-[15px]"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="name"
              className="bg-yellow-200 text-yellow-600 w-fit"
            >
              #muscle group 2
            </label>
            <input
              type="text"
              placeholder="Type something"
              className="py-3 px-8 border border-gray-400 rounded-[15px]"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="name" className="bg-pink-200 text-pink-600 w-fit">
              #muscle group 3
            </label>
            <input
              type="text"
              placeholder="Type something"
              className="py-3 px-8 border border-gray-400 rounded-[15px]"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="name"
              className="bg-blue-200 text-blue-600 inline-block w-fit"
            >
              #list of available equipment
            </label>
            <input
              type="text"
              placeholder="Type something"
              className="py-3 px-8 border border-gray-400 rounded-[15px]"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="name" className="bg-green-200 text-green-600 w-fit">
              #other requirements or preferences
            </label>
            <input
              type="text"
              placeholder="Type something"
              className="py-3 px-8 border border-gray-400 rounded-[15px]"
            />
          </div>
          <section className="flex flex-col space-y-4">
            <div className="flex items-center justify-between space-x-4">
              <label htmlFor="language" className="text-gray-700 basis-1/2">
                Language
              </label>
              <select
                name="languages"
                id="language"
                className="px-4 py-2 border border-gray-400 rounded-[15px] w-full basis-1/2"
              >
                <option value="default">Default</option>
                <option value="english">English</option>
                <option value="spanish">Spanish</option>
              </select>
            </div>
            <div className="flex items-center justify-between space-x-4">
              <label htmlFor="tone" className="text-gray-700 basis-1/2">
                Tone
              </label>
              <select
                name="tones"
                id="tone"
                className="px-4 py-2 border border-gray-400 w-full rounded-[15px] basis-1/2"
              >
                <option value="default">Default</option>
                <option value="authoritative">Authoritative</option>
                <option value="clinical">Clinical</option>
                <option value="cold">Cold</option>
                <option value="confident">Confident</option>
                <option value="cynical">Cynical</option>
                <option value="emotional">Emotional</option>
                <option value="empathetic">Empathetic</option>
                <option value="formal">Formal</option>
                <option value="friendly">Friendly</option>
                <option value="humorous">Humorous</option>
                <option value="informal">Informal</option>
                <option value="ironic">Ironic</option>
                <option value="optimistic">Optimistic</option>
                <option value="pessimistic">Pessimistic</option>
                <option value="playful">Playful</option>
                <option value="sarcastic">Sarcastic</option>
                <option value="serious">Serious</option>
                <option value="sympathetic">Sympathetic</option>
                <option value="tentative">Tentative</option>
                <option value="warm">Warm</option>
              </select>
            </div>
            <div className="flex items-center justify-between space-x-4">
              <label htmlFor="style" className="text-gray-700 basis-1/2">
                Style
              </label>
              <select
                name="styles"
                id="style"
                className="px-4 py-2 border border-gray-400 w-full rounded-[15px] basis-1/2"
              >
                <option value="default">Default</option>
                <option value="academic">Academic</option>
                <option value="analytical">Analytical</option>
                <option value="argumentative">Argumentative</option>
                <option value="conversational">Conversational</option>
                <option value="creative">Creative</option>
                <option value="critical">Critical</option>
                <option value="descriptive">Descriptive</option>
                <option value="epigrammatic">Epigrammatic</option>
                <option value="epistolary">Epistolary</option>
                <option value="expository">Expository</option>
                <option value="informative">Informative</option>
                <option value="instructive">Instructive</option>
                <option value="journalistic">Journalistic</option>
                <option value="metaphorical">Metaphorical</option>
                <option value="narrative">Narrative</option>
                <option value="persuasive">Persuasive</option>
                <option value="poetic">Poetic</option>
                <option value="satirical">Satirical</option>
                <option value="technical">Technical</option>
              </select>
            </div>
          </section>
          <button className="flex  space-x-6 px-4 py-3 bg-black text-white font-bold justify-between rounded-[22px]">
            <p>Copy & Open ChatGPT</p>
            <BsArrowUpRightCircle className="text-2xl" />
          </button>
        </form>
      </section>
    </section>
  );
};

export default CreatePrompt;
