import { useCallback, useEffect, useState } from 'react';
import { BsArrowUpRightCircle } from 'react-icons/bs';
import { FiArrowUpCircle } from 'react-icons/fi';

import Link from 'next/link';

import { auth, db } from '@/config/firebase';
import {
  collection,
  getDocs,
  increment,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';

interface CreatePromptProps {
  prompt: string;
  url: string;
}
interface SelectInputProps {
  label: string;
  name: string;
  id: string;
  options: string[];
}

const SelectInput: React.FC<SelectInputProps> = ({
  label,
  name,
  id,
  options,
}) => (
  <div className="flex items-center justify-between space-x-4">
    <label htmlFor={id} className="text-gray-700 basis-1/2">
      {label}
    </label>
    <select
      name={name}
      id={id}
      className="px-4 py-2 border border-gray-400 rounded-[15px] w-full basis-1/2"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option.charAt(0).toUpperCase() + option.slice(1)}
        </option>
      ))}
    </select>
  </div>
);
const tagColors: { [key: string]: string } = {
  name: 'yellow',
  'fitness goal': 'pink',
  'workout style': 'blue',
  'muscle group 1': 'green',
  'muscle group 2': 'yellow',
  'muscle group 3': 'pink',
  'list of available equipment': 'blue',
  'other requirements or preferences': 'green',
  default: 'gray', // Add a default color
};

const CreatePrompt: React.FC<CreatePromptProps> = ({ prompt, url }) => {
  const [tags, setTags] = useState<string[]>([]);
  const [tagValues, setTagValues] = useState<{ [key: string]: string }>({});
  const [upvotes, setUpvotes] = useState<number>(0);
  useEffect(() => {
    const fetchVotes = async () => {
      // Query the database for the document with the matching url
      const q = query(collection(db, 'prompts'), where('url', '==', url));
      const querySnapshot = await getDocs(q);
      const promptDoc = querySnapshot.docs[0]; // Assuming the url is unique, there should only be one matching document

      if (promptDoc) {
        // Get the 'votes' field of the document
        const promptVotes = promptDoc.data().votes || 0;

        // Update the 'upvotes' state variable
        setUpvotes(promptVotes);
      }
    };

    fetchVotes();
  }, [url]);

  const handleUpvoteClick = useCallback(async () => {
    // Check if the user is logged in
    if (auth.currentUser) {
      // Query the database for the document with the matching url
      const q = query(collection(db, 'prompts'), where('url', '==', url));
      const querySnapshot = await getDocs(q);
      const promptDoc = querySnapshot.docs[0]; // Assuming the url is unique, there should only be one matching document

      if (promptDoc) {
        // Get the 'voters' field of the document
        const promptVoters = promptDoc.data().voters || [];

        // Check if the user has already voted for the prompt
        if (promptVoters.includes(auth.currentUser.uid)) {
          console.log('You have already voted for this prompt');
          return;
        }

        // Update the 'votes' and 'voters' fields of the document
        await updateDoc(promptDoc.ref, {
          votes: increment(1),
          voters: [...promptVoters, auth.currentUser.uid],
        });

        // Update the 'upvotes' state variable
        setUpvotes(upvotes + 1);
      }
    } else {
      console.log('You must be logged in to vote');
    }
  }, [upvotes, url]);

  useEffect(() => {
    const promptTags = prompt.match(/#\w+/g);
    setTags(promptTags || []);
  }, [prompt]);

  const handleCopyClick = useCallback(async () => {
    let updatedPrompt = prompt;
    for (const tag of tags) {
      const tagName = tag.slice(1); // Remove the '#' from the start of the tag
      if (tagValues[tagName]) {
        // Replace the tag in the prompt with the user's value
        updatedPrompt = updatedPrompt.replace(tag, tagValues[tagName]);
      }
    }

    try {
      await navigator.clipboard.writeText(updatedPrompt);
      console.log('Copying to clipboard was successful!');
    } catch (err) {
      console.error('Could not copy text: ', err);
    }
  }, [prompt, tags, tagValues, url]);

  const handleTagValueChange = (tag: string, value: string) => {
    setTagValues((prevValues) => ({ ...prevValues, [tag]: value }));
  };

  return (
    <section className="p-8">
      <div className="flex justify-center items-center space-x-4 border border-gray-400 py-2 lg:py-3 lg:pl-16 lg:pr-4 rounded-[22px]">
        <div className="flex items-center space-x-2 font-bold">
          <p className="text-gray-700 text-sm">Upvote</p>
          <p className="text-gray-700 text-lg font-light">{upvotes}</p>
        </div>
        <button onClick={handleUpvoteClick} className="self-end">
          <FiArrowUpCircle className="text-gray-700 text-2xl lg:text-4xl" />
        </button>
      </div>
      <section className="flex flex-col pt-10">
        <h3 className="text-xl font-bold pb-4">Edit Tags</h3>
        <form action="" className="flex flex-col space-y-6">
          {tags.map((tag) => {
            const tagName = tag.slice(1); // Remove the '#' from the start of the tag
            const tagColor = tagColors[tagName] || tagColors.default; // Use the default color if the tag is not in the dictionary

            return (
              <div key={tag} className="flex flex-col space-y-2">
                <label
                  htmlFor={tag}
                  className={`bg-${tagColor}-200 text-${tagColor}-600 w-fit`}
                >
                  {tag}
                </label>
                <input
                  type="text"
                  placeholder="Type something"
                  className="py-3 px-8 border border-gray-400 rounded-[15px]"
                  onChange={(e) =>
                    handleTagValueChange(tagName, e.target.value)
                  }
                />
              </div>
            );
          })}
          <button
            onClick={handleCopyClick}
            className="flex  space-x-6 px-4 py-3 bg-black text-white font-bold justify-between rounded-[22px]"
          >
            <Link href={`/chat`}>
              <p>Copy & Open ChatGPT</p>
              <BsArrowUpRightCircle className="text-2xl" />
            </Link>
          </button>
          <SelectInput
            label="Language"
            name="languages"
            id="language"
            options={['spanish','english']}
          />
          <SelectInput
            label="Tone"
            name="tones"
            id="tone"
            options={[
              'default',
              'authoritative',
              'clinical',
              'cold',
              'confident',
              'cynical',
              'emotional',
              'empathetic',
              'formal',
              'friendly',
              'humorous',
              'informal',
              'ironic',
              'optimistic',
              'pessimistic',
              'playful',
              'sarcastic',
              'serious',
              'sympathetic',
              'tentative',
              'warm',
            ]}
          />
          <SelectInput
            label="Style"
            name="styles"
            id="style"
            options={[
              'default',
              'academic',
              'analytical',
              'argumentative',
              'conversational',
              'creative',
              'critical',
              'descriptive',
              'epigrammatic',
              'epistolary',
              'expository',
              'informative',
              'instructive',
              'journalistic',
              'metaphorical',
              'narrative',
              'persuasive',
              'poetic',
              'satirical',
              'technical',
            ]}
          />
        </form>
      </section>
    </section>
  );
};

export default CreatePrompt;
