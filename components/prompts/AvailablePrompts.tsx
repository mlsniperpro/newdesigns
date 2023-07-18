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

import { auth, db } from '@/config/firebase';
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  updateDoc,
} from 'firebase/firestore';

interface CategoryInterface {
  id: number;
  icon: JSX.Element;
  title: string;
  backgroundColor: string;
  textColor: string;
}

interface PromptInterface {
  id: string | number;
  title: string;
  categories: TopicInterface[];
  description: string;
  owner: string;
  votes: number;
  bookmarks: number;
  daysPast: number;
  url: string;
  topics: string[];
  userId: string;
  language: string;
}

const AvailablePrompts = ({
  filterByTopic = true,
  selectedTopic = '',
  filteredByDate = true,
  timePeriod = 'allTime', // Add this line
  newest = false,
  language = 'all',
}) => {
  const [prompts, setPrompts] = useState<PromptInterface[]>([]);
  useEffect(() => {
    console.log('Here is the current topic selected: ', selectedTopic);
  }, [selectedTopic]);
  useEffect(() => {
    const fetchPrompts = async () => {
      const querySnapshot = await getDocs(collection(db, 'prompts'));
      let fetchedPrompts: PromptInterface[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedPrompts.push({
          id: doc.id,
          title: data.title,
          categories: data.categories,
          description: data.description,
          owner: data.owner,
          votes: data.votes || 0,
          topics: data.topics,
          bookmarks: data.bookmarks,
          userId: data.userId,
          language: data.language,
          daysPast: Math.ceil(
            Math.abs(
              new Date().getTime() - new Date(data.dayPosted).getTime(),
            ) /
              (1000 * 60 * 60 * 24),
          ),
          url: data.url,
        });
      });
      // Sort the prompts by votes in descending order
      fetchedPrompts.sort((a, b) => b.votes - a.votes);
      // If newest is true, sort the prompts by daysPast in ascending order
      if (newest) {
        fetchedPrompts.sort((a, b) => a.daysPast - b.daysPast);
      }
      //If language is Spanish, filter the prompts by language
      if (language === 'Spanish') {
        fetchedPrompts = fetchedPrompts.filter(
          (prompt) => prompt.language === 'Spanish',
        );
      }
      //If language is English filter the prompts by language
      if (language === 'English') {
        fetchedPrompts = fetchedPrompts.filter(
          (prompt) => prompt.language === 'English',
        );
      }
      setPrompts(fetchedPrompts);
    };

    fetchPrompts();
  }, [newest, language]); // Add newest and language as dependencies

  const handleUpvote = async (id: string) => {
    const user = auth.currentUser;
    if (!user) {
      console.log('User is not authenticated');
      return;
    }

    const promptDocRef = doc(db, 'prompts', id);
    const promptDoc = await getDoc(promptDocRef);

    if (promptDoc.exists()) {
      const promptData = promptDoc.data();
      const promptVoters = promptData.voters || [];

      // If the user has already voted on this prompt, don't allow another vote
      if (promptVoters.includes(user.uid)) {
        console.log('You have already voted on this prompt');
        return;
      }

      // Otherwise, add the user's UID to the prompt's list of voters and increment the vote count
      await updateDoc(promptDocRef, {
        votes: increment(1),
        voters: arrayUnion(user.uid),
      });

      // Update the 'votes' field of the prompt in the 'prompts' state array
      setPrompts((prevPrompts) =>
        prevPrompts.map((prompt) =>
          prompt.id === id ? { ...prompt, votes: prompt.votes + 1 } : prompt,
        ),
      );
    } else {
      console.log('Prompt does not exist');
    }
  };
  const filteredPrompts = filterByTopic
    ? prompts.filter((prompt) =>
        prompt.topics
          ?.map((topic) => topic.toLowerCase())
          .includes(selectedTopic.toLowerCase()),
      )
    : prompts;

  const filteredPromptsByTimeline = filteredByDate
    ? filteredPrompts.filter((prompt) => {
        return timePeriod === 'today'
          ? prompt.daysPast <= 1
          : timePeriod === 'thisWeek'
          ? prompt.daysPast <= 7
          : timePeriod === 'thisMonth'
          ? prompt.daysPast <= 30
          : timePeriod === 'allTime'
          ? true
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
      {filteredPromptsByTimeline.map((prompt) => (
        <PromptItem prompt={prompt} key={prompt.id} onUpvote={handleUpvote} />
      ))}
    </section>
  );
};

export default AvailablePrompts;
