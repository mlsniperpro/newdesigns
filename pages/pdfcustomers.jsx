// 1. Import Dependencies
import { useEffect, useState } from 'react';

import Link from 'next/link';

import { auth, db } from '@/config/firebase';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import * as XLSX from 'xlsx';

// 2. State Initialization
const TableComponent = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const userId = auth.currentUser.uid;

  // 3. Fetching Data
  useEffect(() => {
    const fetchData = async () => {
      const q = query(
        collection(db, 'chat'),
        where('userId', '==', userId),
        where('embedded', '==', true),
        orderBy('createdAt', 'desc'), // 4. Data Sorting
      );
      const querySnapshot = await getDocs(q);
      const fetchedData = [];
      querySnapshot.forEach((doc) => {
        const record = doc.data();
        // 5. Adding Day and Time
        const date = new Date(record.createdAt);
        record.day = date.toDateString();
        record.time = date.toTimeString().split(' ')[0];
        fetchedData.push(record);
      });
      setData(fetchedData);
      setFilteredData(fetchedData);
    };
    fetchData();
  }, []);

  // 6. Search Functionality
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term === '') {
      setFilteredData(data);
      return;
    }
    const filtered = data.filter(
      (row) =>
        row.name?.toLowerCase().includes(term.toLowerCase()) ||
        row.email?.toLowerCase().includes(term.toLowerCase()) ||
        row.phone?.toLowerCase().includes(term.toLowerCase()),
    );
    setFilteredData(filtered);
  };

  // 7. Export to Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data');
    XLSX.writeFile(wb, 'exported_data.xlsx');
  };

  // 8. Rendering
  return (
    <div className="container mx-auto p-4">
      <Link
        href="/"
        className="text-blue-500 hover:underline mb-4 inline-block"
      >
        Back Home
      </Link>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search..."
        className="mb-4 p-2 border rounded"
      />
      <button
        onClick={exportToExcel}
        className="mb-4 p-2 bg-blue-500 text-white rounded"
      >
        Export to Excel
      </button>
      <table className="min-w-full bg-white rounded-lg overflow-hidden">
        <thead className="bg-gradient-to-r from-blue-400 to-blue-700 text-white">
          <tr>
            <th className="py-2 px-4 border">Name</th>
            <th className="py-2 px-4 border">Email</th>
            <th className="py-2 px-4 border">Phone</th>
            <th className="py-2 px-4 border">Day</th>
            <th className="py-2 px-4 border">Time</th>
            <th className="py-2 px-4 border">File Name</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, index) => (
            <tr
              key={index}
              className={index % 2 === 0 ? 'bg-blue-100' : 'bg-blue-200'}
            >
              {console.log("The row is ", row)}
              
              <td className="py-2 px-4 border"><Link href={`/history?id=${row.chatId}`}>{row.name ?? 'N/A'}</Link></td>
              <td className="py-2 px-4 border">{row.email ?? 'N/A'}</td>
              <td className="py-2 px-4 border">{row.phone ?? 'N/A'}</td>
              <td className="py-2 px-4 border">{row.day ?? 'N/A'}</td>
              <td className="py-2 px-4 border">{row.time ?? 'N/A'}</td>
              <td className="py-2 px-4 border">{row.fileName.split(".")[0] ?? 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;
