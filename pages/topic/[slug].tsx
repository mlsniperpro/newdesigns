import { BsFillBagFill, BsFire, BsLaptop, BsPen, BsSearch } from 'react-icons/bs';



import { useRouter } from 'next/router';



import { AvailablePrompts, Navbar, Topic, TopicHeader } from '@/components/prompts';
import { TopicInterface } from '@/components/prompts/Topic';
import { TopicPage } from '@/components/prompts/TopicHeader';



import classNames from 'classnames';


const SUMMARY = 'is the art of putting your thoughts into words.';

const createTopic = (
  id: number,
  slug: string,
  icon: JSX.Element,
  title: string,
) => ({
  id,
  slug,
  icon,
  title,
  prompts: 10,
  followers: 100,
  summary: `${title} ${SUMMARY}`,
});

const allTopics = [
  createTopic(1, 'marketing', <BsFire />, 'Marketing'),
  createTopic(2, 'business', <BsFillBagFill />, 'Business'),
  createTopic(3, 'seo', <BsSearch />, 'SEO'),
  createTopic(4, 'development', <BsLaptop />, 'Development'),
  createTopic(5, 'writing', <BsPen />, 'Writing'),
];

const suggestedTopics: TopicInterface[] = [
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
];

const defaultTopic = {
  id: 0,
  slug: '',
  icon: <></>,
  title: '',
  prompts: 0,
  followers: 0,
  summary: '',
};

export default function Page({ params }: { params: TopicPage }) {
  const router = useRouter();
  const topicData =
    allTopics.find(
      (topic) => topic.title.toLowerCase() === router.query.slug,
    ) || defaultTopic;

  return (
    <main className="">
      <Navbar />
      <div className="py-4">
        <hr className="border border-gray-200" />
      </div>
      <section></section>
      <TopicHeader topic={topicData} />
      <div className="px-8 lg:px-16 2xl:px-52 py-4">
        <hr className="border border-gray-200" />
      </div>
      <section className="flex flex-col-reverse xl:flex-row xl:space-x-4 px-8 lg:px-16 2xl:px-52 pb-8 pt-8 2xl:pt-16">
        <section className="pt-8 xl:pt-0 xl:basis-3/5">
          <AvailablePrompts selectedTopic={router.query.slug?.toString()} />
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