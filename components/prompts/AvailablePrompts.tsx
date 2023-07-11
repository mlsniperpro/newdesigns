'use client';

import { useEffect, useState } from 'react';
import {
  BsFillBagFill,
  BsFire,
  BsLaptop,
  BsPen,
  BsSearch,
} from 'react-icons/bs';

import PromptItem, { Prompt } from './PromptItem';
import { TopicInterface } from './Topic';

import { db } from '@/config/firebase';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';

interface CategoryInterface {
  id: number;
  icon: JSX.Element; // remove "| null" if TopicInterface does not allow it
  title: string;
  backgroundColor: string;
  textColor: string;
}
interface PromptInterface {
  id: string | number;
  title: string;
  categories: TopicInterface[]; // change to TopicInterface[] if that's what Prompt expects
  description: string;
  owner: string;
  votes: number;
  bookmarks: number;
  daysPast: number;
  url: string;
}

const createPrompt = (
  id: number,
  title: string,
  categories: CategoryInterface[],
  daysPast: number,
): PromptInterface => ({
  id,
  title,
  categories,
  description:
    'Making a good first impression involves being nice and friendly and also being confident in yourself.',
  owner: 'John Doe',
  votes: 10,
  bookmarks: 5,
  daysPast,
  url: 'making-a-good-first-impression',
});

const icons: Record<string, JSX.Element> = {
  Development: <BsLaptop />,
  Marketing: <BsFire />,
  Business: <BsFillBagFill />,
  Writing: <BsPen />,
  SEO: <BsSearch />,
};

const createCategory = (
  id: number,
  title: string,
  backgroundColor: string,
  textColor: string,
): CategoryInterface => ({
  id,
  icon: icons[title] || null,
  title,
  backgroundColor,
  textColor,
});

const categories: [string, string, string][] = [
  ['Development', 'bg-green-600', 'text-green-900'],
  ['Marketing', 'bg-orange-200', 'text-orange-900'],
  ['Business', 'bg-blue-200', 'text-blue-900'],
  ['Writing', 'bg-blue-400', 'text-blue-900'],
  ['SEO', 'bg-purple-400', 'text-purple-900'],
];
const AvailablePrompts = ({
  filterByTopic = true,
  selectedTopic = '',
  filteredByDate = true,
}) => {
  const [prompts, setPrompts] = useState<PromptInterface[]>([]); // added state for prompts
  useEffect(() => {
    // fetch prompts from Firestore when the component mounts
    console.log('i am now fetching prompts');
    const fetchPrompts = async () => {
      const querySnapshot = await getDocs(collection(db, 'prompts'));
      const fetchedPrompts: PromptInterface[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedPrompts.push({
          id: doc.id,
          title: data.title,
          categories: data.categories,
          description: data.description,
          owner: data.owner,
          votes: data.votes,
          bookmarks: data.bookmarks,
          daysPast: Math.ceil(Math.abs(new Date().getTime() - new Date(data.dayPosted).getTime()) / (1000 * 60 * 60 * 24)),
          url: data.url,
        });
      });
      setPrompts(fetchedPrompts);
    };

    fetchPrompts();
  }, []);
  let timePeriod = '';
  const filteredPrompts = filterByTopic
  ? prompts.filter((prompt) =>
      prompt.categories?.some(
        (category) => category.title.toLowerCase() === selectedTopic,
      ),
    )
  : prompts;

  const filteredPromptsByTimeline = filteredByDate
  ? filteredPrompts.filter((prompt) => {
      return timePeriod === 'today' ? prompt.daysPast <= 1
           : timePeriod === 'thisWeek' ? prompt.daysPast <= 7
           : timePeriod === 'thisMonth' ? prompt.daysPast <= 30
           : timePeriod === 'allTime' ? true
           : false;
    })
  : filteredPrompts;
  if (filteredPrompts.length === 0) {
    return (
      <section>
        <p>
          No prompts under{' '}
          {selectedTopic.charAt(0).toUpperCase() + selectedTopic.slice(1)}
        </p>
      </section>
    );
  }

  return (
    <section className="flex flex-col space-y-6">
    {filteredPrompts.map((prompt) => (
        <PromptItem prompt={prompt} key={prompt.id} />
      ))}
    </section>
  );
};

export default AvailablePrompts;
