// 1. Import Dependencies
import { useEffect, useState } from 'react';
import Link from 'next/link';



import { auth, db } from '@/config/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';


const TableComponent = () => {
  // 3. Fetch Data
  const [data, setData] = useState([]);
  const userId = auth.currentUser.uid;

  useEffect(() => {
    const fetchData = async () => {
      const q = query(
        collection(db, 'chat'),
        where('userId', '==', userId),
        where('embedded', '==', true),
      );
      const querySnapshot = await getDocs(q);
      const fetchedData = [];
      querySnapshot.forEach((doc) => {
        fetchedData.push(doc.data());
      });
      setData(fetchedData);
    };
    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <Link href="/pdf" className="text-blue-500 hover:underline mb-4 inline-block">
        PDF Home
      </Link>
      <table className="min-w-full bg-white rounded-lg overflow-hidden">
        <thead className="bg-gradient-to-r from-blue-400 to-blue-700 text-white">
          <tr>
            <th className="py-2 px-4 border">Name</th>
            <th className="py-2 px-4 border">Email</th>
            <th className="py-2 px-4 border">Phone</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={index}
              className={index % 2 === 0 ? 'bg-blue-100' : 'bg-blue-200'}
            >
              <td className="py-2 px-4 border">{row.name ?? 'N/A'}</td>
              <td className="py-2 px-4 border">{row.email ?? 'N/A'}</td>
              <td className="py-2 px-4 border">{row.phone ?? 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


export default TableComponent;