import { useEffect, useState } from 'react';



import { useRouter } from 'next/router';



import { AvailablePrompts, Navbar, Topic, TopicHeader } from '@/components/prompts';



import { db } from '@/config/firebase';
import classNames from 'classnames';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';


export type TopicPage = {
  id: string;
  slug: string;
  icon: JSX.Element;
  title: string;
  prompts: number;
  followers: number;
  summary: string;
  backgroundColor: string;
  textColor: string;
};

interface Prompt {
  id: string | number;
  title: string;
  categories: string[];
  description: string;
  owner: string;
  votes: number;
  bookmarks: number;
  daysPast: number;
  url: string;
}

export default function Page() {
  const router = useRouter();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [topicData, setTopicData] = useState<TopicPage[] | null>(null);

  const fetchData = async (
    collectionName: string,
    condition?: any,
  ): Promise<any[]> => {
    try {
      const q = condition
        ? query(
            collection(db, collectionName),
            where('topics', 'array-contains', condition),
          )
        : collection(db, collectionName);
      const querySnapshot = await getDocs(q);
      const data: any[] = [];
      querySnapshot.forEach((doc) => {
        data.push({
          ...doc.data(),
          id: doc.id,
        });
      });
      return data;
    } catch (error) {
      console.error('Error fetching data: ', error);
      return []; // Return an empty array in case of error
    }
  };

  useEffect(() => {
    const fetchPromptsAndTopics = async () => {
      const topicSlug = router.query.slug;
      if (typeof topicSlug === 'string') {
        const fetchedPrompts = await fetchData('prompts', topicSlug);
        const fetchedTopics = await fetchData('topics');
        setPrompts(fetchedPrompts);
        setTopicData(fetchedTopics);
      }
    };
    fetchPromptsAndTopics();
  }, []);


  useEffect(() => {
    console.log('The fetched prompts are ', prompts);
  }, [prompts]);

  if (!topicData) {
    return <div>Loading...</div>;
  }

  const slug = router.query.slug as string;
  const defaultTopic = {
    id: '',
    slug: slug,
    icon: <></>,
    title: '',
    prompts: 0,
    followers: 0,
    summary: '',
  };
  const matchingTopic =
    topicData.find(
      (topic) => topic.title.toLowerCase() === slug.toLowerCase(),
    ) || defaultTopic;

  return (
    <main className="">
      <Navbar onSearch={()=>{}}/>
      <div className="py-4">
        <hr className="border border-gray-200" />
      </div>
      <section></section>

      <TopicHeader topic={matchingTopic} />

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
            <h2 className="text-gray-600 pb-4">TOPICS/TEMAS</h2>
            <div className="flex items-center space-x-2 flex-wrap gap-2">
              <div className="flex items-center space-x-2 flex-wrap gap-2">
                {topicData &&
                  topicData.map((topic) => (
                    <Topic
                      topic={topic}
                      key={topic.id}
                      className={classNames(
                        topic.backgroundColor,
                        topic.textColor,
                      )}
                    />
                  ))}
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}