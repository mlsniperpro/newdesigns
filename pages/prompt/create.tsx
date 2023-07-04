'use client';

import { MouseEvent, useEffect, useRef, useState } from 'react';
import {
  BsArrowUpRightCircle,
  BsFillBagFill,
  BsFire,
  BsLaptop,
  BsPen,
  BsSearch,
} from 'react-icons/bs';
import { FcMoneyTransfer } from 'react-icons/fc';
import { RiStarLine } from 'react-icons/ri';

import Topic, { TopicInterface } from '@/components/prompts/Topic';

import { DropDownTopic, Navbar } from '@/components/prompts';
import { auth, db } from '@/config/firebase';
import classNames from 'classnames';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';

const topics: TopicInterface[] = [
  {
    id: 1,
    icon: <BsFire />,
    title: 'Marketing',
    backgroundColor: 'bg-orange-200',
    textColor: 'text-orange-900',
  },
  {
    id: 2,
    icon: <BsFillBagFill />,
    title: 'Business',
    backgroundColor: 'bg-blue-200',
    textColor: 'text-blue-900',
  },

  {
    id: 3,
    icon: <BsSearch />,
    title: 'SEO',
    backgroundColor: 'bg-purple-400',
    textColor: 'text-purple-900',
  },

  {
    id: 4,
    icon: <BsLaptop />,
    title: 'Development',
    backgroundColor: 'bg-green-600',
    textColor: 'text-green-900',
  },

  {
    id: 5,
    icon: <BsPen />,
    title: 'Writing',
    backgroundColor: 'bg-blue-400',
    textColor: 'text-blue-900',
  },
  {
    id: 6,
    icon: <FcMoneyTransfer />,
    title: 'Financial',
    backgroundColor: 'bg-green-300',
    textColor: 'text-green-800',
  },
];

export default function Page() {
  const [selectedTopics, setSelectedTopics] = useState<TopicInterface[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAddButton, setShowAddButton] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const addButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const addButtonElement = addButtonRef.current;
    const dropdownElement = dropdownRef.current;

    if (addButtonElement && dropdownElement) {
      const addButtonRect = addButtonElement.getBoundingClientRect();
      const dropdownRect = dropdownElement.getBoundingClientRect();
      const addButtonRight = addButtonRect.right;

      if (addButtonRight + dropdownRect.width > window.innerWidth) {
        dropdownElement.style.left = `${
          window.innerWidth - dropdownRect.width
        }px`;
      } else {
        dropdownElement.style.left = `${addButtonRight}px`;
      }
    }
  }, [selectedTopics]);

  const handleTopicClick = (topic: TopicInterface) => {
    if (selectedTopics.some((selectedTopic) => selectedTopic.id === topic.id)) {
      setSelectedTopics((prevSelectedTopics) =>
        prevSelectedTopics.filter(
          (selectedTopic) => selectedTopic.id !== topic.id,
        ),
      );
    } else {
      if (selectedTopics.length < 5) {
        setSelectedTopics((prevSelectedTopics) => [
          ...prevSelectedTopics,
          topic,
        ]);
      }
    }
  };

  const handleClickOutside: EventListener = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDropdown = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setShowDropdown(true);
    if (selectedTopics.length === 5) {
      setShowDropdown(false);
      setShowAddButton(false);
    }
  };

  return (
    <main className="">
      <Navbar />
      <div className="">
        <hr className="border border-gray-200" />
      </div>
      <section className="bg-gray-100 flex flex-col-reverse xl:flex-row xl:space-x-4 px-8 lg:px-16 2xl:px-52 pb-8 pt-8 2xl:pt-16">
        <form className="p-8 xl:pt-0 xl:basis-3/5 flex flex-col space-y-16">
          <div className="flex space-x-2">
            <RiStarLine className="text-3xl" />
            <h2 className="font-bold text-2xl">New Prompt</h2>
          </div>
          <section className="flex flex-col space-y-6">
            <div className="flex flex-col">
              <label htmlFor="title">Title</label>
              <p className="text-xs font-light text-gray-600">
                A catchy title brings more users to your prompt.
              </p>
              <input
                type="text"
                id="title"
                className="p-2 border border-gray-200 rounded-[10px]"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="type">Type</label>
              <p className="text-xs font-light text-gray-600">
                Which type of LLM is your prompt suitable for?
              </p>
              <select id="type" className="p-3">
                <option value="">Select type</option>
                <option value="ChatGPT">ChatGPT</option>
                <option value="Bard">Bard</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="topics">Topics (Up to 5)</label>
              <p className="text-xs font-light text-gray-600 pb-3">
                Choose an adequate category.
              </p>
              <div className="flex items-center space-x-1 flex-wrap">
                {selectedTopics.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => handleTopicClick(topic)}
                    type="button"
                  >
                    <DropDownTopic
                      topic={topic}
                      className={classNames(
                        topic.backgroundColor,
                        topic.textColor,
                      )}
                    />
                  </button>
                ))}
                {selectedTopics.length < 5 && showAddButton && (
                  <button
                    onClick={handleDropdown}
                    ref={addButtonRef}
                    className="self-start p-2 border-gray-300 border rounded-[15px] text-sm text-gray-600"
                  >
                    + Add Topic
                  </button>
                )}

                {showDropdown && selectedTopics.length < 5 && (
                  <section>
                    <div
                      ref={dropdownRef}
                      className="flex flex-col max-h-[200px] opacity-100 overflow-auto w-fit p-4 space-y-1 absolute top-[500px] left-[450px] bg-white rounded-[10px]"
                    >
                      <h3 className="text-gray-800">Topics</h3>
                      {topics.map((topic) => (
                        <button
                          key={topic.id}
                          onClick={() => handleTopicClick(topic)}
                          type="button"
                        >
                          <DropDownTopic
                            topic={topic}
                            className={classNames(
                              topic.backgroundColor,
                              topic.textColor,
                            )}
                          />
                        </button>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </div>
            <div className="flex flex-col">
              <label htmlFor="description">Description</label>
              <p className="text-xs font-light text-gray-600">
                Provide a concise description of your template and potential
                results users can expect.
              </p>
              <textarea
                id="description"
                className="p-2 border border-gray-200 rounded-[10px]"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="prompt">Prompt</label>
              <p className="text-xs font-light text-gray-600">
                Provide a concise description of your template and potential
                results users can expect.
              </p>
              <textarea
                id="prompt"
                className="p-2 border border-gray-200 rounded-[10px]"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="tags">Tags</label>
              <p className="text-xs font-light text-gray-600">
                Be mindful we don’t take responsibility for any actions taken by
                third parties based on the information you decide to disclose.
                Avoid sharing any sensitive information.
              </p>
              <textarea
                id="tags"
                className="p-2 border border-gray-200 rounded-[10px]"
              />
            </div>
          </section>
          <section className="self-end flex space-x-4">
            <button className="self-start px-4 py-3 rounded-[15px] text-lg text-gray-600">
              Cancel
            </button>
            <button className="flex  space-x-6 px-4 py-3 bg-black text-white font-bold justify-between rounded-[22px]">
              <p>Publish Prompt</p>
              <BsArrowUpRightCircle className="text-2xl" />
            </button>
          </section>
        </form>
        <section className="xl:basis-2/5 flex space-x-2">
          <div className="border-l-solid border-l-gray-300 border-l-[1px]"></div>
          <div className="flex flex-col space-y-4 p-8">
            <h2 className="text-xl pb-4 flex space-x-2">
              <span className="text-black font-semibold">Author Details</span>
              <span className="text-gray-600 font-light text-lg">
                (Optional)
              </span>
            </h2>
            <form className="flex flex-col space-y-6">
              <div className="flex flex-col">
                <label htmlFor="bio">Bio</label>
                <input
                  type="text"
                  placeholder="Bio"
                  className="p-2 border border-gray-200 rounded-[10px]"
                />
              </div>
              <section className="flex flex-col space-y-4">
                <div className="flex flex-col">
                  <label htmlFor="web">WEBSITE</label>
                  <input
                    type="text"
                    placeholder="Link"
                    className="p-2 border border-gray-200 rounded-[10px]"
                  />
                </div>
                <section className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label htmlFor="twitter">TWITTER</label>
                    <input
                      type="text"
                      placeholder="@user"
                      className="p-2 border border-gray-200 rounded-[10px]"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="discord">DISCORD</label>
                    <input
                      type="text"
                      placeholder="@user"
                      className="p-2 border border-gray-200 rounded-[10px]"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="github">GITHUB</label>
                    <input
                      type="text"
                      placeholder="@user"
                      className="p-2 border border-gray-200 rounded-[10px]"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="facebook">FACEBOOK</label>
                    <input
                      type="text"
                      placeholder="@user"
                      className="p-2 border border-gray-200 rounded-[10px]"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="instagram">INSTAGRAM</label>
                    <input
                      type="text"
                      placeholder="@user"
                      className="p-2 border border-gray-200 rounded-[10px]"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="tiktok">TIKTOK</label>
                    <input
                      type="text"
                      placeholder="@user"
                      className="p-2 border border-gray-200 rounded-[10px]"
                    />
                  </div>
                </section>
              </section>
              <input
                type="submit"
                value="Update"
                className="w-full text-center text-gray-700 border border-gray-300  rounded-[15px] p-3"
              />
            </form>
          </div>
        </section>
      </section>
    </main>
  );
}
