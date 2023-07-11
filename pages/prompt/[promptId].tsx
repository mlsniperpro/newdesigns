import { useEffect, useMemo, useState } from 'react';
import { FC } from 'react';
import { BsArrowUpRight, BsBookmark, BsFire, BsLaptop, BsPen } from 'react-icons/bs';



import { useRouter } from 'next/router';



import { CreatePrompt, Navbar, Topic } from '@/components/prompts';



import { auth, db } from '@/config/firebase';
import classNames from 'classnames';
import { addDoc, collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
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
//Fetch the comments data from firestore database collection called comments
const getCommentsData = async (promptId: string) => {
  const q = query(
    collection(db, 'comments'),
    where('promptId', '==', promptId),
  );
  const querySnapshot = await getDocs(q);
  const commentsData = querySnapshot.docs.map(
    (doc) => doc.data() as CommentSectionProps,
  );
  console.log('Here is the comments data: ', commentsData);
  return commentsData;
};

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
  dayPosted: string;
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
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<CommentSectionProps[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const handleCommentSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!newComment.trim()) {
      // Don't submit empty comments
      return;
    }
    try {
      await addDoc(collection(db, 'comments'), {
        promptId: PromptId,
        name: auth?.currentUser?.displayName || 'BullDozer', // Replace with the current user's name
        comment: newComment,
        votes: 0,
        time: new Date().toISOString(), // Replace with the current time
      });
      setNewComment('');
    } catch (err) {
      console.error('Error adding comment: ', err);
    }
  };
 const handleDelete = async () => {
   if (typeof PromptId === 'string') {
     try {
       const q = query(collection(db, 'prompts'), where('url', '==', PromptId));
       const querySnapshot = await getDocs(q);
       if (!querySnapshot.empty) {
         const docRef = doc(db, 'prompts', querySnapshot.docs[0].id);
         await deleteDoc(docRef);
         // Redirect to another page after deleting the prompt
         router.push('/');
       } else {
         console.error('No document found with url: ', PromptId);
       }
     } catch (err) {
       console.error('Error deleting prompt: ', err);
     }
   } else {
     console.error('Invalid PromptId: ', PromptId);
   }
 };


  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await getPromptData(PromptId as string);
        const commentsData = await getCommentsData(PromptId as string);
        setPromptData(data[0]);
        setComments(commentsData);
        setIsLoading(false);

        // Check if the current user is an admin
        // Replace this with your actual check
        setIsAdmin(
          auth?.currentUser?.uid === 'M8LwxAfm26SimGbDs4LDwf1HuCb2' ||
            auth?.currentUser?.uid === 'fcJAePkUVwV7fBR3uiGh5iyt2Tf1',
        );
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
    ? displayDaysPast(Math.floor((new Date().getTime() - new Date(promptData.dayPosted).getTime()) / (1000 * 3600 * 24)))
    : '';
  return (
    <main>
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
            <h4>{promptData && promptData.prompt}</h4>
          </div>
          <section className="p-4 flex flex-col">
            <div className="flex justify-between items-center pb-4">
              <div className="flex space-x-6 items-center">
                <h2 className="text-2xl font-bold">Discussion</h2>
                <p>{comments.length} Comments</p>{' '}
                {/* Display the number of comments */}
              </div>
              <p className="text-gray-800">Write a comment</p>
            </div>
            <hr className="border border-gray-200" />
            <form
              onSubmit={handleCommentSubmit}
              className="flex space-x-4 items-center mt-4"
            >
              <input
                type="text"
                value={newComment}
                onChange={(event) => setNewComment(event.target.value)}
                placeholder="Write a comment..."
                className="flex-grow px-4 py-2 border border-gray-400 rounded-[15px]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-[15px]"
              >
                Submit
              </button>
            </form>
            {isAdmin && (
        <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded-[15px]">
          Delete Prompt
        </button>
      )}

            <div className="flex flex-col space-y-6 pt-8">
              <p className="text-gray-800">Top comments</p>
              {comments.map((comment, index) => (
                <CommentSection
                  key={index}
                  name={comment.name}
                  comment={comment.comment}
                  votes={comment.votes}
                  time={comment.time}
                />
              ))}
            </div>
          </section>
        </section>

        <section className="xl:basis-2/5 flex space-x-2">
          <div className="border-l-solid border-l-gray-300 border-l-[1px]"></div>
         <CreatePrompt prompt={promptData && promptData.prompt} url={typeof PromptId === 'string' ? PromptId : ''} />
        </section>
      </section>
    </main>
  );
};
export default CustomPrompt;