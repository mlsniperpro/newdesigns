import { useEffect, useState } from 'react';
import {
  BsFillBagFill,
  BsFire,
  BsLaptop,
  BsPen,
  BsSearch,
} from 'react-icons/bs';

import PromptItem from './PromptItem';
import { TopicInterface } from './Topic';

import { auth, db } from '@/config/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { arrayUnion, increment } from 'firebase/firestore';

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

interface AvailablePromptsProps {
  filterByTopic?: boolean;
  selectedTopic?: string;
  filteredByDate?: boolean;
  timePeriod?: string;
  newest?: boolean;
  language?: string;
  searchQuery?: string;
}

const AvailablePrompts: React.FC<AvailablePromptsProps> = ({
  filterByTopic = true,
  selectedTopic = '',
  filteredByDate = true,
  timePeriod = 'allTime',
  newest = false,
  language = 'all',
  searchQuery = '',
}) => {
  const [prompts, setPrompts] = useState<PromptInterface[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const admin =
      auth.currentUser?.uid == 'fcJAePkUVwV7fBR3uiGh5iyt2Tf1' ||
      auth.currentUser?.uid == 'M8LwxAfm26SimGbDs4LDwf1HuCb2';
    setIsAdmin(admin);
  }, [auth.currentUser?.uid]);

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'prompts'));
        const fetchPromises: Promise<PromptInterface | null>[] =
          querySnapshot.docs.map(async (doc) => {
            const data = doc.data();
            if (
              !data.approved &&
              ![
                'M8LwxAfm26SimGbDs4LDwf1HuCb2',
                'fcJAePkUVwV7fBR3uiGh5iyt2Tf1',
              ].includes(data.userId)
            ) {
              return null;
            }
            const userSnapshot = await getDocs(
              query(
                collection(db, 'users'),
                where('userId', '==', data.userId),
              ),
            );
            let username = '';
            userSnapshot.forEach((doc) => (username = doc.data().name));
            return {
              id: doc.id,
              title: data.title,
              categories: data.categories,
              description: data.description,
              owner: username,
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
            };
          });
        let fetchedPrompts = (await Promise.all(fetchPromises)).filter(
          Boolean,
        ) as PromptInterface[];
        fetchedPrompts.sort((a, b) => b.votes - a.votes);
        if (newest) {
          fetchedPrompts.sort((a, b) => a.daysPast - b.daysPast);
        }
        if (language !== 'all') {
          fetchedPrompts = fetchedPrompts.filter(
            (prompt) =>
              prompt.language.toLowerCase() === language.toLowerCase(),
          );
        }
        if (searchQuery) {
          fetchedPrompts = fetchedPrompts.filter((prompt) =>
            prompt.title.toLowerCase().includes(searchQuery.toLowerCase()),
          );
        }
        console.log(
          'Fetched prompts after sorting and filtering: ',
          fetchedPrompts,
        );
        setPrompts(fetchedPrompts);
      } catch (error) {
        console.error('Error fetching prompts: ', error);
      }
    };

    fetchPrompts();
  }, [newest, language, searchQuery]);

  useEffect(() => {
    console.log('Search query is: ', searchQuery);
  }, [searchQuery]);

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

      if (promptVoters.includes(user.uid)) {
        console.log('You have already voted on this prompt');
        return;
      }

      await updateDoc(promptDocRef, {
        votes: increment(1),
        voters: arrayUnion(user.uid),
      });

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
    ? prompts.filter((prompt) => {
        console.log('The selected topic is ', selectedTopic);
        console.log('Checking topics for prompt: ', prompt.id, prompt.topics);
        return (
          prompt.topics &&
          prompt.topics
            .map((topic) => topic.toLowerCase())
            .includes(selectedTopic.toLowerCase())
        );
      })
    : prompts;

  const timeFilterMap = {
    today: 1,
    thisWeek: 7,
    thisMonth: 30,
    allTime: Infinity,
  } as const;

  const filteredPromptsByTimeline = filteredByDate
    ? filteredPrompts.filter(
        (prompt) =>
          prompt.daysPast <=
          timeFilterMap[timePeriod as keyof typeof timeFilterMap],
      )
    : filteredPrompts;

  console.log('Filtered prompts by timeline: ', filteredPromptsByTimeline);

  return (
    <section className="flex flex-col space-y-6 p-8 bg-gradient-to-r from-blue-500 to-purple-500 text-black rounded-lg shadow-lg">
      {filteredPromptsByTimeline.length === 0 ? (
        <p className="text-lg">
          No prompts under{' '}
          {selectedTopic.charAt(0).toUpperCase() + selectedTopic.slice(1)}
        </p>
      ) : (
        filteredPromptsByTimeline.map((prompt) => (
          <PromptItem prompt={prompt} key={prompt.id} onUpvote={handleUpvote} />
        ))
      )}
    </section>
  );
};

export default AvailablePrompts;
