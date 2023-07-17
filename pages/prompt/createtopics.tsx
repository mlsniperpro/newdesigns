'use client';

import { useState } from 'react';

import Navbar from '@/components/prompts/Navbar';

import { db } from '@/config/firebase';
import { addDoc, collection } from 'firebase/firestore';

const colors = {
  Marketing: ['bg-orange-200', 'text-orange-900'],
  Business: ['bg-blue-200', 'text-blue-900'],
  SEO: ['bg-purple-400', 'text-purple-900'],
  Development: ['bg-green-600', 'text-green-900'],
  Writing: ['bg-blue-400', 'text-blue-900'],
  Financial: ['bg-green-300', 'text-green-800'],
};

function AddTopicPage() {
  const [title, setTitle] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const colorKeys = Object.keys(colors);
    const randomColorKey =
      colorKeys[Math.floor(Math.random() * colorKeys.length)];
    const [backgroundColor, textColor] =
      colors[randomColorKey as keyof typeof colors];

    try {
      await addDoc(collection(db, 'topics'), {
        title,
        backgroundColor,
        textColor,
      });

      alert('Topic added successfully');
    } catch (error) {
      console.error('Error adding topic: ', error);
      alert('An error occurred while adding the topic');
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <main className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Add a new topic</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Title"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add Topic
          </button>
        </form>
      </main>
    </div>
  );
}

export default AddTopicPage;
