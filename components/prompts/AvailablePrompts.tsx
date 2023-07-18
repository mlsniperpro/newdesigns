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
}

const AvailablePrompts = ({
  filterByTopic = true,
  selectedTopic = '',
  filteredByDate = true,
  timePeriod = 'allTime', // Add this line
}) => {
  const [prompts, setPrompts] = useState<PromptInterface[]>([]);

  useEffect(() => {
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
          votes: data.votes || 0,
          bookmarks: data.bookmarks,
          daysPast: Math.ceil(
            Math.abs(
              new Date().getTime() - new Date(data.dayPosted).getTime(),
            ) /
              (1000 * 60 * 60 * 24),
          ),
          url: data.url,
        });
      });
      setPrompts(fetchedPrompts);
    };

    fetchPrompts();
  }, []);

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
        prompt.categories?.some(
          (category) => category.title.toLowerCase() === selectedTopic,
        ),
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
