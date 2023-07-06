'use client';

import { BsFillBagFill, BsFire, BsLaptop, BsPen, BsSearch } from 'react-icons/bs';



import PromptItem, { Prompt } from './PromptItem';
import { TopicInterface } from './Topic';


interface CategoryInterface {
  id: number;
  icon: JSX.Element; // remove "| null" if TopicInterface does not allow it
  title: string;
  backgroundColor: string;
  textColor: string;
}
interface PromptInterface {
  id: number;
  title: string;
  categories: TopicInterface[]; // change to TopicInterface[] if that's what Prompt expects
  description: string;
  owner: string;
  votes: number;
  bookmarks: number;
  daysPast: number;
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
const prompts = [
  [1, 'How to make a good first impression', [4], 2],
  [2, 'The dynamics of a good first impression', [1, 4, 5], 2],
  [3, 'How to give a great first impression', [1, 2], 2],
  [4, 'How to get the most out of your first meetup', [4, 5], 2],
  [5, 'How to make a good first impression', [1], 2],
  [6, 'How to make a good first impression', [2], 30],
  [7, 'How to make a good first impression', [1, 2, 3, 4, 5], 55],
  [8, 'How to practice self compassion consistently', [1, 2, 4, 5], 2],
  [9, 'How to get the perfect abs in 2 months', [3, 4], 232],
  [10, 'How to be a straight A student', [1, 5], 2],
].map(([id, title, categoryIds, daysPast]) =>
  createPrompt(
    id as number,
    title as string,
    (categoryIds as number[]).map((id) =>
      createCategory(id, ...categories[id - 1]),
    ),
    daysPast as number,
  ),
);

const AvailablePrompts = ({
  filterByTopic = true,
  selectedTopic = '',
  filteredByDate = true,
}) => {
  let timePeriod = '';
  const filteredPrompts = filterByTopic
    ? prompts.filter((prompt) =>
        prompt.categories.some(
          (category) => category.title.toLowerCase() === selectedTopic,
        ),
      )
    : prompts;

  const filteredPromptsByTimeline = filteredByDate
    ? filteredPrompts.filter((prompt) => {
        if (timePeriod === 'today') {
          return prompt.daysPast <= 1;
        } else if (timePeriod === 'thisWeek') {
          return prompt.daysPast <= 7;
        } else if (timePeriod === 'thisMonth') {
          return prompt.daysPast <= 30;
        } else if (timePeriod === 'allTime') {
          return true;
        } else {
          return false;
        }
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