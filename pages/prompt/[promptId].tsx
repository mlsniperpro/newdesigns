import { useEffect, useMemo, useState } from 'react';
import { FC } from 'react';
import { BsArrowUpRight, BsBookmark, BsQuestionCircle } from 'react-icons/bs';
import {
  BsArrowUpRightCircle,
  BsFillBagFill,
  BsFire,
  BsLaptop,
  BsPen,
  BsSearch,
} from 'react-icons/bs';
import { FcMoneyTransfer } from 'react-icons/fc';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useRouter } from 'next/router';

import { CreatePrompt, Navbar, Topic } from '@/components/prompts';

import { auth, db } from '@/config/firebase';
import classNames from 'classnames';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { get } from 'http';

const defaultCategory: Category = {
  id: 0,
  icon: <BsQuestionCircle />, // Use an icon of your choice
  title: 'Unknown',
  style: { backgroundColor: 'bg-gray-200', textColor: 'text-gray-900' },
};

type Category = {
  id: number;
  icon: JSX.Element;
  title: string;
  style: {
    backgroundColor: string;
    textColor: string;
  };
};
const icons = {
  Marketing: <BsFire />,
  Business: <BsFillBagFill />,
  SEO: <BsSearch />,
  Development: <BsLaptop />,
  Writing: <BsPen />,
  Financial: <FcMoneyTransfer />,
};
const categories: Category[] = [
  {
    id: 1,
    icon: icons.Marketing,
    title: 'Marketing',
    style: { backgroundColor: 'bg-orange-200', textColor: 'text-orange-900' },
  },
  {
    id: 2,
    icon: icons.Business,
    title: 'Business',
    style: { backgroundColor: 'bg-yellow-200', textColor: 'text-yellow-900' },
  },
  {
    id: 3,
    icon: icons.SEO,
    title: 'SEO',
    style: { backgroundColor: 'bg-red-200', textColor: 'text-red-900' },
  },
  {
    id: 4,
    icon: icons.Development,
    title: 'Development',
    style: { backgroundColor: 'bg-green-600', textColor: 'text-green-900' },
  },
  {
    id: 5,
    icon: icons.Writing,
    title: 'Writing',
    style: { backgroundColor: 'bg-blue-400', textColor: 'text-blue-900' },
  },
  {
    id: 6,
    icon: icons.Financial,
    title: 'Financial',
    style: { backgroundColor: 'bg-purple-200', textColor: 'text-purple-900' },
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
    (doc) =>
      ({
        id: doc.id, // Add this line
        ...doc.data(),
      } as CommentSectionProps),
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
  topics: string[];
  createdAt: string;
  updatedAt: string;
  userId: string;
  url: string;
  categoryIds: number[];
  prompt: string;
  dayPosted: string;
  bio: string;
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
  id: string;
  name: string;
  comment: string;
  votes: number;
  time: string;
  userId: string;
  deleteComment: (id: string) => void;
  editComment: (id: string, newComment: string) => void;
  reportComment: (id: string) => void; // Add this line
  isAdmin: boolean;
  isPublisher: boolean;
  reported: boolean;
}

const CommentSection: FC<CommentSectionProps> = ({
  id,
  name,
  comment,
  votes,
  time,
  userId,
  deleteComment,
  editComment,
  isAdmin,
  isPublisher = false,
  reported = false, // Add this line
  reportComment, // Add this line
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editCommentText, setEditCommentText] = useState(comment);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (editCommentText.trim()) {
      await editComment(id, editCommentText);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditCommentText(comment);
  };

  const handleReport = async () => {
    await reportComment(id);
  };

  return (
    <div
      className={`flex flex-col space-y-2 ${reported ? 'bg-red-200' : ''}`} // Add this line
    >
      <h5 className="font-bold text-black">{name}</h5>
      {isEditing ? (
        <input
          type="text"
          value={editCommentText}
          onChange={(e) => setEditCommentText(e.target.value)}
          className="px-2 py-1 border border-gray-400 rounded"
        />
      ) : (
        <h6>{comment}</h6>
      )}
      <div className="flex items-center space-between space-x-6 text-xs">
        <div className="flex space-x-2 items-center">
          <BsArrowUpRight className="text-gray-400" />
          <p className="text-gray-900 font-bold">{votes}</p>
        </div>
        <button onClick={handleReport} className="text-gray-900 font-bold">
          Report
        </button>
        <p>{time}</p>
        {(isAdmin || isPublisher) && !isEditing && (
          <button
            onClick={handleEdit}
            className="px-2 py-1 bg-blue-500 text-white rounded"
          >
            Edit
          </button>
        )}
        {(isAdmin || isPublisher) && isEditing && (
          <button
            onClick={handleSave}
            className="px-2 py-1 bg-green-500 text-white rounded"
          >
            Save
          </button>
        )}
        {isEditing && (
          <button
            onClick={handleCancel}
            className="px-2 py-1 bg-gray-500 text-white rounded"
          >
            Cancel
          </button>
        )}
        {(isAdmin || isPublisher) && (
          <button
            onClick={() => deleteComment(id)}
            className="px-2 py-1 bg-red-500 text-white rounded"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

const CustomPrompt = () => {
  const [showInfo, setShowInfo] = useState(false);
  const [isPublisher, setIsPublisher] = useState(false);
  const [promptData, setPromptData] = useState<PromptData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const PromptId = router.query.promptId;
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<CommentSectionProps[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);
  const [editedPrompt, setEditedPrompt] = useState<PromptData | null>(null);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    if (promptData?.userId) {
      const q = query(
        collection(db, 'users'),
        where('userId', '==', promptData.userId),
      );

      getDocs(q)
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            setUsername(doc.data().name); // use 'name' instead of 'username'
          });
        })
        .catch((error) => {
          console.log('Error getting documents:', error);
        });
    }
  }, [promptData?.userId]); // use promptData.userId as the dependency

  const reportComment = async (id: string) => {
    try {
      const commentRef = doc(db, 'comments', id);
      await updateDoc(commentRef, { reported: true });
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === id ? { ...comment, reported: true } : comment,
        ),
      );
      toast.success('Comment reported successfully!');
    } catch (err) {
      toast.error('Error reporting comment');
      console.error('Error reporting comment: ', err);
    }
  };
  const handleUpdatePrompt = async (event: React.FormEvent) => {
    event.preventDefault();
    if (typeof PromptId === 'string' && editedPrompt !== null) {
      try {
        const q = query(
          collection(db, 'prompts'),
          where('url', '==', PromptId),
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const docRef = doc(db, 'prompts', querySnapshot.docs[0].id);
          const updateData = {
            title: editedPrompt.title,
            description: editedPrompt.description,
            prompt: editedPrompt.prompt,
            // Add other fields you want to update here
          };
          await updateDoc(docRef, updateData);
          // Fetch the prompt data again after it is updated
          const data = await getPromptData(PromptId as string);
          setPromptData(data[0]);
          setIsEditingPrompt(false);
        } else {
          console.error('No document found with url: ', PromptId);
        }
      } catch (err) {
        console.error('Error updating prompt: ', err);
      }
    } else {
      console.error('Invalid PromptId: ', PromptId);
    }
  };

  useEffect(() => {
    const admin =
      auth.currentUser?.uid == 'fcJAePkUVwV7fBR3uiGh5iyt2Tf1' ||
      auth.currentUser?.uid == 'M8LwxAfm26SimGbDs4LDwf1HuCb2';
    setIsAdmin(admin);
  }, [isLoading, promptData, comments]);

  const deleteComment = async (id: string) => {
    try {
      const commentRef = doc(db, 'comments', id);
      await deleteDoc(commentRef);
      setComments(comments.filter((comment) => comment.id !== id));
      toast.success('Comment deleted successfully!');
    } catch (err) {
      toast.error('Error deleting comment');
      console.error('Error deleting comment: ', err);
    }
  };

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
        userId: auth.currentUser?.uid || '123456789', // Replace with the current user's id
      });
      setNewComment('');
      toast.success('Comment added successfully!');
      // Fetch the comments again after a new comment is added
      const commentsData = await getCommentsData(PromptId as string);
      setComments(commentsData);
    } catch (err) {
      toast.error('Error adding comment');
      console.error('Error adding comment: ', err);
    }
  };

  const handleDelete = async (event: React.FormEvent) => {
    event.preventDefault();
    if (typeof PromptId === 'string') {
      try {
        const q = query(
          collection(db, 'prompts'),
          where('url', '==', PromptId),
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const docRef = doc(db, 'prompts', querySnapshot.docs[0].id);
          await deleteDoc(docRef);
          toast.success('Prompt deleted successfully!');
          setTimeout(() => {
            router.push('/prompts');
          }, 5000); // Redirect after 5 seconds
        } else {
          console.error('No document found with url: ', PromptId);
        }
      } catch (err) {
        toast.error('Error deleting prompt');
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

        // Check if the current user is the publisher of the prompt
        setIsPublisher(auth.currentUser?.uid === data[0].userId);
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
    ? displayDaysPast(
        Math.floor(
          (new Date().getTime() - new Date(promptData.dayPosted).getTime()) /
            (1000 * 3600 * 24),
        ),
      )
    : '';
  const handleEditComment = async (id: string, newComment: string) => {
    //Prevent the default behavior of the form
    //event.preventDefault();
    try {
      const commentRef = doc(db, 'comments', id);
      await updateDoc(commentRef, {
        comment: newComment,
        time: new Date().toISOString(), // Update the time to the current time
      });
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === id ? { ...comment, comment: newComment } : comment,
        ),
      );
      toast.success('Comment edited successfully!');
    } catch (err) {
      toast.error('Error editing comment');
      console.error('Error editing comment: ', err);
    }
  };

  return (
    <main>
      <Navbar onSearch={() => {}} />
      <hr className="border border-gray-200" />
      <section className="flex flex-col-reverse xl:flex-row xl:space-x-4 px-8 lg:px-16 2xl:px-52 py-8 bg-gray-100">
        <section className="pt-8 xl:pt-0 xl:basis-3/5 flex flex-col space-y-16">
          <div className="flex flex-col space-y-3">
            <h2 className="text-2xl font-bold">
              {promptData && promptData.title}
            </h2>
            <p>{promptData && promptData.description}</p>
            <div className="flex items-center space-x-4">
              <p
                className="text-black font-bold"
                onClick={() => setShowInfo(!showInfo)}
              >
                {promptData && username}
              </p>
              {showInfo && <div>{promptData?.bio}</div>}
              <div className="flex items-start flex-wrap gap-2">
                {promptData &&
                  promptData.topics &&
                  promptData.topics.map((topicName, index) => {
                    const category: Category | undefined = categories.find(
                      (category: Category) => category.title === topicName,
                    );
                    const categoryToUse: Category = category || {
                      ...defaultCategory,
                      title: topicName, // Use the topic name from Firestore
                    };
                    return (
                      <Topic
                        topic={{ ...categoryToUse, ...categoryToUse.style }}
                        key={categoryToUse.id + index} // Add index to key to ensure uniqueness
                        className={classNames(
                          categoryToUse.style.backgroundColor,
                          categoryToUse.style.textColor,
                        )}
                      />
                    );
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
            {(isAdmin || auth.currentUser?.uid === promptData?.userId) && (
              <div className="flex space-x-4">
                {!isEditingPrompt && (
                  <button
                    onClick={() => {
                      setIsEditingPrompt(true);
                      setEditedPrompt(promptData);
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-[15px]"
                  >
                    Edit Prompt
                  </button>
                )}

                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-[15px]"
                >
                  Delete Prompt
                </button>
              </div>
            )}

            {isEditingPrompt && editedPrompt !== null && (
              <form onSubmit={handleUpdatePrompt} className="space-y-4">
                <label className="block">
                  <span className="text-gray-700">Title:</span>
                  <input
                    type="text"
                    value={editedPrompt.title}
                    onChange={(e) =>
                      setEditedPrompt({
                        ...editedPrompt,
                        title: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </label>
                <label className="block">
                  <span className="text-gray-700">Description:</span>
                  <textarea
                    value={editedPrompt.description}
                    onChange={(e) =>
                      setEditedPrompt({
                        ...editedPrompt,
                        description: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </label>
                <label className="block">
                  <span className="text-gray-700">Owner:</span>
                </label>
                <label className="block">
                  <span className="text-gray-700">Prompt:</span>
                  <textarea
                    value={editedPrompt.prompt}
                    onChange={(e) =>
                      setEditedPrompt({
                        ...editedPrompt,
                        prompt: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </label>
                {/* You would need a more complex input for categories, topics, and categoryIds if you want to allow editing them */}
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingPrompt(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="flex flex-col space-y-6 pt-8">
              <p className="text-gray-800">Top comments</p>
              {comments.map((comment, index) => (
                <CommentSection
                  key={index}
                  id={comment.id}
                  name={comment.name}
                  comment={comment.comment}
                  votes={comment.votes}
                  time={comment.time}
                  userId={comment.userId}
                  deleteComment={deleteComment}
                  editComment={handleEditComment}
                  isAdmin={isAdmin}
                  isPublisher={auth.currentUser?.uid === comment.userId}
                  reported={comment.reported} // Add this line
                  reportComment={reportComment} // Add this line
                />
              ))}
            </div>
          </section>
        </section>

        <section className="xl:basis-2/5 flex space-x-2">
          <div className="border-l-solid border-l-gray-300 border-l-[1px]"></div>
          <CreatePrompt
            prompt={promptData?.prompt || ''}
            url={typeof PromptId === 'string' ? PromptId : ''}
          />
        </section>
      </section>
      <ToastContainer />
    </main>
  );
};
export default CustomPrompt;
