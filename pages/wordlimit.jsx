import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

import Link from 'next/link';

import { db } from '../config/firebase';

import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
} from 'firebase/firestore';

const WORDLIMIT_COLLECTION = 'wordlimit';

function WordLimit() {
  const [wordLimit, setWordLimit] = useState(20000);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (event) => {
    const newLimit = event.target.value;
    if (newLimit === '') {
      setWordLimit(newLimit);
    } else {
      const parsedLimit = parseFloat(newLimit);
      if (!isNaN(parsedLimit)) {
        setWordLimit(parsedLimit);
      }
    }
  };

  const updateWordLimitInDB = async () => {
    setIsLoading(true);
    try {
      const wordLimitDoc = await getDocs(collection(db, WORDLIMIT_COLLECTION));

      if (!wordLimitDoc.empty) {
        const wordLimitRef = wordLimitDoc.docs[0].ref;
        await updateDoc(wordLimitRef, { limit: wordLimit });
      } else {
        await setDoc(doc(db, WORDLIMIT_COLLECTION, 'limit'), {
          limit: wordLimit,
        });
      }
      toast.success('Word limit updated successfully');
    } catch (error) {
      toast.error('Failed to update word limit');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-r from-blue-400 to-blue-600">
      <div className="grid w-80 grid-rows-4 gap-1 bg-white p-6 rounded-lg shadow-lg">
        <p className="font-semibold text-blue-700">
          💌 Enter the new word limit:
        </p>
        <input
          type="number"
          value={wordLimit}
          onChange={handleInputChange}
          className="h-10 w-full rounded border p-2 text-sm"
          placeholder="Enter the new word limit here"
        />
        <button
          onClick={updateWordLimitInDB}
          disabled={isLoading}
          className="rounded bg-blue-500 text-white hover:bg-blue-700 transition-colors duration-200"
        >
          {isLoading ? 'Updating...' : 'Confirm Change'}
        </button>
        <p className="mt-4 flex items-center text-xs text-gray-500 hover:text-gray-700">
          <Link href="/">Go back home</Link>
        </p>
      </div>
    </div>
  );
}

export default WordLimit;
