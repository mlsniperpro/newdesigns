import { useEffect, useState } from 'react';

import Link from 'next/link';

import { db } from '@/config/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

function ReportedComments() {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      const commentsQuery = query(
        collection(db, 'comments'),
        where('reported', '==', true),
      );
      const commentsSnapshot = await getDocs(commentsQuery);
      setComments(
        commentsSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })),
      );
    };

    fetchComments();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Reported Comments</h1>
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment.id} className="mb-4 p-4 border rounded shadow">
            <Link href={`/prompt/${comment.promptId}`}>
              <div className="text-blue-500 hover:underline">
                <h2 className="text-xl font-bold">{comment.name}</h2>
                <p className="mt-2">{comment.comment}</p>
              </div>
            </Link>
            <p className="mt-2 text-sm text-gray-500">
              Reported at: {new Date(comment.time).toLocaleString()}
            </p>
          </div>
        ))
      ) : (
        <p className="text-lg">No reported comments found.</p>
      )}
    </div>
  );
}

export default ReportedComments;
