import { IconEdit, IconTrash } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

// Import the Edit icon
import { auth, db } from '@/config/firebase';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';

function App() {
  const [chats, setChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEmbedded, setShowEmbedded] = useState(false);
  const [editingChatId, setEditingChatId] = useState(null); // New state to manage editing mode
  const [newTitle, setNewTitle] = useState(''); // New state to manage the new title

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

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'chat', id));
    setChats(chats.filter((chat) => chat.id !== id));
  };

  const handleTitleUpdate = async (id) => {
    await updateDoc(doc(db, 'chat', id), {
      title: newTitle,
    });
    setChats(
      chats.map((chat) =>
        chat.id === id ? { ...chat, title: newTitle } : chat,
      ),
    );
    setEditingChatId(null);
    setNewTitle('');
  };

  let filteredChats = chats.filter((chat) =>
    chat.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  if (showEmbedded) {
    filteredChats = filteredChats.filter((chat) => chat.embedded === true);
  }

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-800 text-gray-300 p-4 overflow-y-auto h-screen">
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
                {editingChatId === chat.id ? (
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                ) : (
                  <span className="text-sm ml-2">{chat.title}</span>
                )}
              </div>
              <div>
                {editingChatId === chat.id ? (
                  <button onClick={() => handleTitleUpdate(chat.id)}>
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setEditingChatId(chat.id);
                      setNewTitle(chat.title);
                    }}
                  >
                    <IconEdit size={18} />
                  </button>
                )}
                <button
                  className="text-red-500 ml-2"
                  onClick={() => handleDelete(chat.id)}
                >
                  <IconTrash size={18} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {/* Main Chat Area */}
      <div className="w-3/4 p-4 overflow-y-auto h-screen">
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
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
