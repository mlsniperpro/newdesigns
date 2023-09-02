import { IconTrash } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';



import { auth, db } from '@/config/firebase';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';


function App() {
  const [chats, setChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
   const [showEmbedded, setShowEmbedded] = useState(false);

   useEffect(() => {
     const fetchChats = async () => {
       const userId = auth.currentUser.uid;
       const q = query(collection(db, 'chat'), where('userId', '==', userId));
       const querySnapshot = await getDocs(q);
       const fetchedChats = [];
       querySnapshot.forEach((doc) => {
         fetchedChats.push({ id: doc.id, ...doc.data() });
       });
       setChats(fetchedChats);
     };

     fetchChats();
   }, []);

  useEffect(() => {
    const fetchChat = async () => {
      const chatDoc = await getDoc(doc(db, 'chat', selectedChatId));
      if (chatDoc.exists()) {
        setSelectedChat(chatDoc.data());
      }
    };

    if (selectedChatId) {
      fetchChat();
    }
  }, [selectedChatId]);

  let filteredChats = chats.filter((chat) =>
    chat.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );
   if (showEmbedded) {
     filteredChats = filteredChats.filter((chat) => chat.embedded === true);
   }

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-800 text-gray-300 p-4">
        <input
          type="text"
          placeholder="Search Chats"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 rounded border mb-4"
        />
        <label className="ml-4 flex items-center">
            <input
              type="checkbox"
              checked={showEmbedded}
              onChange={() => setShowEmbedded(!showEmbedded)}
            />
            <span className="ml-2">Show Only Embedded</span>
          </label>
        <ul className="mt-4">
          {filteredChats.map((chat) => (
            <li
              key={chat.id}
              onClick={() => setSelectedChatId(chat.id)}
              className="cursor-pointer hover:bg-gray-700 p-2 rounded mb-2 flex justify-between items-center"
            >
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-messages"
                  width={20}
                  height={20}
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" />
                  <path d="M21 14l-3 -3h-7a1 1 0 0 1 -1 -1v-6a1 1 0 0 1 1 -1h9a1 1 0 0 1 1 1v10" />
                  <path d="M14 15v2a1 1 0 0 1 -1 1h-7l-3 3v-10a1 1 0 0 1 1 -1h2" />
                </svg>
                <span className="text-sm ml-2">{chat.title}</span>
              </div>
              <button
                className="text-red-500"
                onClick={() => {
                  /* Delete logic here */
                }}
              >
                <IconTrash size={18} />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Chat Area */}
      <div className="w-3/4 p-4">
        {selectedChat && (
          <div className="flex flex-col h-screen p-4 bg-gray-50 text-black">
            <div className="flex flex-col flex-grow overflow-y-auto">
              <ul className="max-h-full w-full rounded-lg">
                {selectedChat.messages.map((m, index) => (
                  <li
                    key={index}
                    className={`flex flex-col w-full mb-2 p-2 rounded-md text-black ${
                      m.role === 'user' ? 'bg-gray-300' : 'bg-gray-200'
                    } ml-2 mr-2`}
                  >
                    <div className={`prose prose-sm text-black`}>
                      <ReactMarkdown>{m.content}</ReactMarkdown>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <form
              className={`flex items-center w-full border-t p-4 text-black bg-gray-200`}
            >
              <input
                placeholder="Say something..."
                className={`flex-grow p-2 border rounded-md bg-white text-black ml-2 mr-2`}
              />
              <button
                type="submit"
                className="ml-4 p-2 bg-blue-500 text-white rounded-md"
              >
                Send
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;