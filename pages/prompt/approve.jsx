import { useEffect, useState } from 'react';

import Navbar from '@/components/prompts/Navbar';

import { db } from '@/config/firebase';
import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';

function ApprovePromptsPage() {
  const [prompts, setPrompts] = useState([]);

  useEffect(() => {
    const fetchPrompts = async () => {
      const promptsCollection = await getDocs(collection(db, 'prompts'));
      setPrompts(
        promptsCollection.docs.map((doc) => ({ ...doc.data(), id: doc.id })),
      );
    };

    fetchPrompts();
  }, []);

  const handleApprove = async (id) => {
    try {
      await updateDoc(doc(db, 'prompts', id), { approved: true });
      setPrompts(
        prompts.map((prompt) =>
          prompt.id === id ? { ...prompt, approved: true } : prompt,
        ),
      );
      alert('Prompt approved successfully');
    } catch (error) {
      console.error('Error approving prompt: ', error);
      alert('An error occurred while approving the prompt');
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <main className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Approve Prompts</h1>
        {prompts.map((prompt) => (
          <div key={prompt.id} className="border p-4 rounded mt-4">
            <h2 className="text-xl font-bold">{prompt.title}</h2>
            <p className="mt-2">{prompt.description}</p>
            {!prompt.approved &&
              ![
                'M8LwxAfm26SimGbDs4LDwf1HuCb2',
                'fcJAePkUVwV7fBR3uiGh5iyt2Tf1',
              ].includes(prompt.userId) && (
                <button
                  onClick={() => handleApprove(prompt.id)}
                  className="mt-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Approve
                </button>
              )}
          </div>
        ))}
      </main>
    </div>
  );
}

export default ApprovePromptsPage;
