import { useEffect, useMemo, useState } from 'react';
import { FC } from 'react';
import {
  BsArrowUpRight,
  BsBookmark,
  BsFire,
  BsLaptop,
  BsPen,
} from 'react-icons/bs';

import { useRouter } from 'next/router';

import { CreatePrompt, Navbar, Topic } from '@/components/prompts';

import { auth, db } from '@/config/firebase';
import classNames from 'classnames';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { get } from 'http';

type Category = {
  id: number;
  icon: JSX.Element;
  title: string;
  style: {
    backgroundColor: string;
    textColor: string;
  };
};
const categories: Category[] = [
  {
    id: 1,
    icon: <BsFire />,
    title: 'Marketing',
    style: { backgroundColor: 'bg-orange-200', textColor: 'text-orange-900' },
  },
  {
    id: 4,
    icon: <BsLaptop />,
    title: 'Development',
    style: { backgroundColor: 'bg-green-600', textColor: 'text-green-900' },
  },
  {
    id: 5,
    icon: <BsPen />,
    title: 'Writing',
    style: { backgroundColor: 'bg-blue-400', textColor: 'text-blue-900' },
  },
];

export interface PromptData {
  id: number;
  title: string;
  categories: Category[]; // <-- Update this line
  description: string;
  votes: number;
  bookmarks: number;
  daysPast: number;
  owner: string;
  comments: [];
  topics: [];
  createdAt: string;
  updatedAt: string;
  userId: string;
  url: string;
  categoryIds: number[];
  prompt: string;
}
//Fetch the data from firestore database collection called prompts
const getPromptData = async (promptId: string) => {
  const q = query(collection(db, 'prompts'), where('url', '==', promptId));
  const querySnapshot = await getDocs(q);
  const promptData = querySnapshot.docs.map((doc) => doc.data() as PromptData);
  console.log('Here is the prompt data: ', promptData);
  return promptData;
};

const displayDaysPast = (daysPast: number) =>
  daysPast < 30
    ? `${daysPast} ${daysPast === 1 ? 'day' : 'days'} ago`
    : `${Math.floor(daysPast / 30)} months ago`;

const info = [
  {
    label: 'Name',
    value: '#name',
    bg: 'bg-yellow-200',
    text: 'text-yellow-600',
  },
  {
    label: 'Fitness Goal',
    value: '#fitness goal',
    bg: 'bg-pink-200',
    text: 'text-pink-600',
  },
  {
    label: 'Preferred Workout Style',
    value: '#workout style',
    bg: 'bg-blue-200',
    text: 'text-blue-600',
  },
  {
    label: 'Targeted Muscle Groups',
    values: ['#muscle group 1', '#muscle group 2', '#muscle group 3'],
    bg: 'bg-green-200',
    text: 'text-green-600',
  },
  {
    label: 'Available Equipment',
    value: '#list of available equipment',
    bg: 'bg-blue-200',
    text: 'text-blue-600',
  },
  {
    label: 'Other Requirements/Preferences',
    value: '#other requirements or preferences',
    bg: 'bg-green-200',
    text: 'text-green-600',
  },
];
interface CommentSectionProps {
  name: string;
  comment: string;
  votes: number;
  time: string;
}
const CommentSection: FC<CommentSectionProps> = ({
  name,
  comment,
  votes,
  time,
}) => (
  <div className="flex flex-col space-y-2">
    <h5 className="font-bold text-black">{name}</h5>
    <h6>{comment}</h6>
    <div className="flex items-center space-between space-x-6 text-xs">
      <div className="flex space-x-2 items-center">
        <BsArrowUpRight className="text-gray-400" />
        <p className="text-gray-900 font-bold">{votes}</p>
      </div>
      <p className="text-gray-900 font-bold">Reply</p>
      <p className="text-gray-900 font-bold">Report</p>
      <p>{time}</p>
    </div>
  </div>
);

const CustomPrompt = () => {
  const [promptData, setPromptData] = useState<PromptData | ''>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const PromptId = router.query.promptId;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await getPromptData(PromptId as string);
        setPromptData(data[0]);
        setIsLoading(false);
      } catch (err) {
        setError((err as Error).message);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [PromptId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const daysPastDisplay = promptData
    ? displayDaysPast(promptData.daysPast)
    : '';
  return (
    <main>
      <h1>The product id is {PromptId}</h1>
      <Navbar />
      <hr className="border border-gray-200" />
      <section className="flex flex-col-reverse xl:flex-row xl:space-x-4 px-8 lg:px-16 2xl:px-52 py-8 bg-gray-100">
        <section className="pt-8 xl:pt-0 xl:basis-3/5 flex flex-col space-y-16">
          <div className="flex flex-col space-y-3">
            <h2 className="text-2xl font-bold">
              {promptData && promptData.title}
            </h2>
            <p>{promptData && promptData.description}</p>
            <div className="flex items-center space-x-4">
              <p className="text-black font-bold">
                {promptData && promptData.owner}
              </p>
              <div className="flex items-start flex-wrap gap-2">
                {promptData &&
                  promptData.categoryIds &&
                  promptData.categoryIds.map((id) => {
                    const category = categories.find(
                      (category) => category.id === id,
                    );
                    return category ? (
                      <Topic
                        topic={{ ...category, ...category.style }}
                        key={category.id}
                        className={classNames(
                          category.style.backgroundColor,
                          category.style.textColor,
                        )}
                      />
                    ) : null;
                  })}
              </div>
            </div>
            <div className="flex items-center text-xs space-x-4">
              <div className="flex space-x-2 items-center">
                <BsArrowUpRight className="text-gray-400" />
                <p className="text-gray-900 font-bold">
                  {promptData ? promptData.votes : ''}
                </p>
                <p>Total uses</p>
              </div>
              <div className="flex space-x-2 items-center">
                <BsBookmark className="text-gray-400" />
                <p className="text-gray-900 font-bold">
                  {promptData ? promptData.bookmarks : ''}
                </p>
                <p>Saved</p>
              </div>
              <div className="flex space-x-2">
                <p>{daysPastDisplay}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-8 rounded-[15px]">
            <h4>
              {promptData && promptData.description}
            </h4>
            <div className="flex flex-col">
              {/*info.map((item, index) => (
                <p key={index} className="flex items-center space-x-1">
                  {item.label}:
                  {Array.isArray(item.values) ? (
                    item.values.map((val, idx) => (
                      <span
                        key={idx}
                        className={`${item.bg} ${item.text} w-fit`}
                      >
                        {val}
                      </span>
                    ))
                  ) : (
                    <span className={`${item.bg} ${item.text} w-fit`}>
                      {item.value}
                    </span>
                  )}
                </p>
                  ))*/}
                  {
                    promptData && promptData.prompt
                  }
            </div>
          </div>
          <section className="p-4 flex flex-col">
            <div className="flex justify-between items-center pb-4">
              <div className="flex space-x-6 items-center">
                <h2 className="text-2xl font-bold">Discussion</h2>
                <p>2 Comments</p>
              </div>
              <p className="text-gray-800">Write a comment</p>
            </div>
            <hr className="border border-gray-200" />
            <div className="flex flex-col space-y-6 pt-8">
              <p className="text-gray-800">Top comments</p>
              <CommentSection
                name="Ankit Kumar Ghosh"
                comment="Diet plan and weight loss suggestion"
                votes={10}
                time="16 days ago"
              />
              <CommentSection
                name="Glen Spelling"
                comment="Get personalized daily action plans to achieve your fitness goals directly in your calendar. Get Started on www.getonjourney.com"
                votes={4}
                time="6 months ago"
              />
            </div>
          </section>
        </section>

        <section className="xl:basis-2/5 flex space-x-2">
          <div className="border-l-solid border-l-gray-300 border-l-[1px]"></div>
          <CreatePrompt prompt={promptData&&promptData.prompt} />
        </section>
      </section>
    </main>
  );
};
export default CustomPrompt;
