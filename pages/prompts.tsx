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

import classNames from 'classnames';

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
  return (
    <main>
      <Navbar />
      <Header />
      <div className="py-4">
        <hr className="border border-gray-200" />
      </div>
      <section className="flex flex-col-reverse xl:flex-row xl:space-x-4 px-8 lg:px-16 2xl:px-52 pb-8 pt-8 2xl:pt-16">
        <section className="pt-8 xl:pt-0 xl:basis-3/5 flex flex-col">
          <div className="items-start flex"></div>
          <div>
            <AvailablePrompts filterByTopic={false} />
          </div>
        </section>
        <section className="xl:basis-2/5 flex space-x-2">
          <div className="border-l-solid border-l-gray-300 border-l-[1px]"></div>
          <div className="flex flex-col">
            <h2 className="text-gray-600 pb-4">Suggested Topics</h2>
            <div className="flex items-center space-x-2 flex-wrap gap-2">
              {suggestedTopics.map((topic) => (
                <Topic
                  topic={topic}
                  key={topic.id}
                  className={classNames(topic.backgroundColor, topic.textColor)}
                />
              ))}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}