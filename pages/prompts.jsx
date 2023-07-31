import { useEffect, useState } from 'react';
import { BsFillBagFill, BsFire, BsLaptop, BsPen, BsSearch } from 'react-icons/bs';
import { FcMoneyTransfer } from 'react-icons/fc';



import { AvailablePrompts, Header, Navbar } from '@/components/prompts';
import Topic from '@/components/prompts/Topic';



import { db } from '@/config/firebase';
import { collection, getDocs } from 'firebase/firestore';


const icons = {
  Marketing: <BsFire />,
  Business: <BsFillBagFill />,
  SEO: <BsSearch />,
  Development: <BsLaptop />,
  Writing: <BsPen />,
  Financial: <FcMoneyTransfer />,
};

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestedTopics, setSuggestedTopics] = useState([]);
  const [timePeriod, setTimePeriod] = useState('allTime');
  const [newest, setNewest] = useState(false);
  const [language, setLanguage] = useState('all');

  useEffect(() => {
    const fetchTopics = async () => {
      const topicsCollection = await getDocs(collection(db, 'topics'));
      setSuggestedTopics(
        topicsCollection.docs.map((doc) => ({ ...doc.data(), id: doc.id })),
      );
      //Now map over the topics and add the icon
      setSuggestedTopics((prev) =>
        prev.map((topic) => ({
          ...topic,
          icon: icons[topic.title],
        })),
      );
    };

    fetchTopics();
  }, []);
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <main className="px-4 lg:px-16 2xl:px-52 py-8">
      <Navbar onSearch={handleSearch} />
      <Header
        setTimePeriod={setTimePeriod}
        setNewest={setNewest}
        setLanguage={setLanguage}
      />
      <hr className="border border-gray-200 my-4" />
      <div className="flex flex-col-reverse xl:flex-row xl:space-x-4">
        <main className="xl:flex-grow pt-8 xl:pt-0">
          <AvailablePrompts
            filterByTopic={false}
            timePeriod={timePeriod}
            newest={newest}
            language={language}
            searchQuery={searchQuery}
          />
        </main>
        <aside className="xl:w-2/5 pt-8 xl:pt-0 flex space-x-2">
          <div className="border-l border-gray-300"></div>
          <div className="flex flex-col">
            <h2 className="text-gray-600 pb-4">TOPICS/TEMAS</h2>
            <div className="flex items-center space-x-2 flex-wrap gap-2">
              {suggestedTopics.map((topic) => (
                <Topic
                  topic={topic}
                  key={topic.id}
                  className={`${topic.backgroundColor} ${topic.textColor}`}
                />
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}