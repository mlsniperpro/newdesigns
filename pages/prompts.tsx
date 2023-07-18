import { useEffect, useState } from 'react';
import {
  BsFillBagFill,
  BsFire,
  BsLaptop,
  BsPen,
  BsSearch,
} from 'react-icons/bs';
import { FcMoneyTransfer } from 'react-icons/fc';

import { AvailablePrompts, Header, Navbar } from '@/components/prompts';
import Topic from '@/components/prompts/Topic';

const suggestedTopics = [
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

export default function Home() {
  const [timePeriod, setTimePeriod] = useState('allTime');
  const [newest, setNewest] = useState(false);

  useEffect(() => {
    console.log("Here is the time period: ", timePeriod);
  }, [timePeriod]);

  return (
    <main className="px-4 lg:px-16 2xl:px-52 py-8">
      <Navbar />
      <Header setTimePeriod={setTimePeriod} setNewest={setNewest} />
      <hr className="border border-gray-200 my-4" />
      <div className="flex flex-col-reverse xl:flex-row xl:space-x-4">
        <main className="xl:flex-grow pt-8 xl:pt-0">
          <AvailablePrompts
            filterByTopic={false}
            timePeriod={timePeriod}
            newest={newest}
          />
        </main>
        <aside className="xl:w-2/5 pt-8 xl:pt-0 flex space-x-2">
          <div className="border-l border-gray-300"></div>
          <div className="flex flex-col">
            <h2 className="text-gray-600 pb-4">Suggested Topics</h2>
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
