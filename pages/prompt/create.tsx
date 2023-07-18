'use client';

import { MouseEvent, useEffect, useRef, useState } from 'react';
import { BsArrowUpRightCircle, BsFillBagFill, BsFire, BsLaptop, BsPen, BsSearch } from 'react-icons/bs';
import { FcMoneyTransfer } from 'react-icons/fc';
import { RiStarLine } from 'react-icons/ri';
import { ToastContainer, toast } from 'react-toastify';



import { DropDownTopic, Navbar } from '@/components/prompts';
import Topic, { TopicInterface } from '@/components/prompts/Topic';



import { auth, db } from '@/config/firebase';
import classNames from 'classnames';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';


/*
const icons = {
  Marketing: <BsFire />,
  Business: <BsFillBagFill />,
  SEO: <BsSearch />,
  Development: <BsLaptop />,
  Writing: <BsPen />,
  Financial: <FcMoneyTransfer />,
};

const colors = {
  Marketing: ['bg-orange-200', 'text-orange-900'],
  Business: ['bg-blue-200', 'text-blue-900'],
  SEO: ['bg-purple-400', 'text-purple-900'],
  Development: ['bg-green-600', 'text-green-900'],
  Writing: ['bg-blue-400', 'text-blue-900'],
  Financial: ['bg-green-300', 'text-green-800'],
};

const topics: TopicInterface[] = Object.keys(icons).map((title, index) => ({
  id: index + 1,
  icon: icons[title as keyof typeof icons],
  title,
  backgroundColor: colors[title as keyof typeof colors][0],
  textColor: colors[title as keyof typeof colors][1],
}));
*/
export default function Page() {
  const [selectedTopics, setSelectedTopics] = useState<TopicInterface[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAddButton, setShowAddButton] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState('');
  const [description, setDescription] = useState('');
  const [prompt, setPrompt] = useState('');
  const [tags, setTags] = useState('');
  const [bio, setBio] = useState('');
  const [website, setWebsite] = useState('');
  const [twitter, setTwitter] = useState('');
  const [discord, setDiscord] = useState('');
  const [github, setGithub] = useState('');
  const [facebook, setFacebook] = useState('');
  const [instagram, setInstagram] = useState('');
  const [tiktok, setTiktok] = useState('');
  const [topics, setTopics] = useState<TopicInterface[]>([]);
  async function fetchTopicsFromFirebase() {
    const topicsCollection = collection(db, 'topics'); // replace 'topics' with your collection name
    const topicsSnapshot = await getDocs(topicsCollection);
    const topicsList = topicsSnapshot.docs.map((doc) => doc.data());
    return topicsList;
  }
  const iconComponents = {
    BsFire: <BsFire />,
    BsFillBagFill: <BsFillBagFill />,
    BsSearch: <BsSearch />,
    BsLaptop: <BsLaptop />,
    BsPen: <BsPen />,
    FcMoneyTransfer: <FcMoneyTransfer />,
  };

  useEffect(() => {
    fetchTopicsFromFirebase().then((topicsList) => {
      const topicsWithIcons = topicsList.map((topic, index) => ({
        id: index + 1,
        icon: iconComponents[topic.icon as keyof typeof iconComponents],
        title: topic.title,
        backgroundColor: topic.backgroundColor,
        textColor: topic.textColor,
      }));


      setTopics(topicsWithIcons);
    });
  }, []);


  const handleSubmit = async (event: MouseEvent<HTMLButtonElement>) => {
    console.log(
      'The tits is: ',
      title,
      'description is: ',
      description,
      'Prompt is: ',
      prompt,
      'Tags is: ',
      tags,
    );
    event.preventDefault();

    // Check that no field is missing and then submit to firestore
    if (title === '' || description === '' || prompt === '' || tags === '') {
      // Now throw the toast message
      alert('Please fill in all fields');
    } else if (!auth.currentUser) {
      alert('User is not authenticated');
    } else {
      //Get url which is title separeted by hyphens
      try {
        const docRef = await addDoc(collection(db, 'prompts'), {
          title: title,
          language: language,
          description: description,
          prompt: prompt,
          tags: tags,
          bio: bio,
          website: website,
          twitter: twitter,
          discord: discord,
          github: github,
          facebook: facebook,
          instagram: instagram,
          tiktok: tiktok,
          userId: auth.currentUser.uid,
          url: title.toLowerCase().split(' ').join('-'),
          dayPosted: new Date().toISOString().slice(0, 10),
          topics: selectedTopics.map((topic) => topic.title),
        });
        // Provide feedback to the user
        alert('Form submitted successfully');
      } catch (error) {
        console.error('Error adding document: ', error);
        alert('An error occurred while submitting the form');
      }
    }
  };

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
            <ToastContainer />
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
                onChange={(event) => setTitle(event.target.value)}
                id="title"
                className="p-2 border border-gray-200 rounded-[10px]"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="language">Language</label>
              <p className="text-xs font-light text-gray-600">
                In Which Language is your prompt?
              </p>
              <select id="type" className="p-3" onChange={(event)=> setLanguage(event.target.value)}>
                <option value="Spanish">Spanish</option>
                <option value="English">English</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="topics">Topics (Up to 5)</label>
              <p className="text-xs font-light text-gray-600 pb-3">
                Choose an adequate category.
              </p>
              <div className="relative">
                <div
                  className="relative flex items-center space-x-1 flex-wrap"
                  style={{ width: '300px' }}
                >
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
                    <div
                      ref={dropdownRef}
                      className="absolute top-full left-0 mt-2 w-64 p-4 bg-white rounded-[10px] overflow-auto"
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
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <label htmlFor="description">Description</label>
              <p className="text-xs font-light text-gray-600">
                Provide a concise description of your template and potential
                results users can expect.
              </p>
              <textarea
                onChange={(event) => setDescription(event.target.value)}
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
                onChange={(event) => setPrompt(event.target.value)}
                id="prompt"
                className="p-2 border border-gray-200 rounded-[10px]"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="tags">Tags</label>
              <p className="text-xs font-light text-gray-600">
                Be mindful we don’t take responsibility for any actions taken by
                third parties based on the information you decide to disclose.
                Avoid sharing any sensitive information.(Tags should start with
                # symbol and separated by space)
              </p>
              <textarea
                onChange={(event) => setTags(event.target.value)}
                id="tags"
                className="p-2 border border-gray-200 rounded-[10px]"
              />
            </div>
          </section>
          <section className="self-end flex space-x-4">
            <button className="self-start px-4 py-3 rounded-[15px] text-lg text-gray-600">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex  space-x-6 px-4 py-3 bg-black text-white font-bold justify-between rounded-[22px]"
            >
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
                  onChange={(event) => setBio(event.target.value)}
                  type="text"
                  placeholder="Bio"
                  className="p-2 border border-gray-200 rounded-[10px]"
                />
              </div>
              <section className="flex flex-col space-y-4">
                <div className="flex flex-col">
                  <label htmlFor="web">WEBSITE</label>
                  <input
                    onChange={(event) => setWebsite(event.target.value)}
                    type="text"
                    placeholder="Link"
                    className="p-2 border border-gray-200 rounded-[10px]"
                  />
                </div>
                <section className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label htmlFor="twitter">TWITTER</label>
                    <input
                      onChange={(event) => setTwitter(event.target.value)}
                      type="text"
                      placeholder="@user"
                      className="p-2 border border-gray-200 rounded-[10px]"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="discord">DISCORD</label>
                    <input
                      onChange={(event) => setDiscord(event.target.value)}
                      type="text"
                      placeholder="@user"
                      className="p-2 border border-gray-200 rounded-[10px]"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="github">GITHUB</label>
                    <input
                      onChange={(event) => setGithub(event.target.value)}
                      type="text"
                      placeholder="@user"
                      className="p-2 border border-gray-200 rounded-[10px]"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="facebook">FACEBOOK</label>
                    <input
                      onChange={(event) => setFacebook(event.target.value)}
                      type="text"
                      placeholder="@user"
                      className="p-2 border border-gray-200 rounded-[10px]"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="instagram">INSTAGRAM</label>
                    <input
                      onChange={(event) => setInstagram(event.target.value)}
                      type="text"
                      placeholder="@user"
                      className="p-2 border border-gray-200 rounded-[10px]"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="tiktok">TIKTOK</label>
                    <input
                      onChange={(event) => setTiktok(event.target.value)}
                      type="text"
                      placeholder="@user"
                      className="p-2 border border-gray-200 rounded-[10px]"
                    />
                  </div>
                </section>
              </section>
              <input
                type="submit"
                onClick={() => handleSubmit}
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