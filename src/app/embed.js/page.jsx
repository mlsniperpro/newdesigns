"use client";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useRouter } from "next/navigation";

import Link from "next/link";

import { auth, db } from "@/app/config/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

function App() {
  const router = useRouter();
  const { id } = router?.query || {};
  const [chats, setChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(id);
  const [selectedChat, setSelectedChat] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showEmbedded, setShowEmbedded] = useState(false);
  const [editingChatId, setEditingChatId] = useState(null);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    const fetchChats = async () => {
      const userId = auth.currentUser.uid;
      const q = query(collection(db, "chat"), where("userId", "==", userId));
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
      const chatDoc = await getDoc(doc(db, "chat", selectedChatId));
      if (chatDoc.exists()) {
        setSelectedChat(chatDoc.data());
      }
    };

    if (selectedChatId) {
      fetchChat();
    }
  }, [selectedChatId]);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "chat", id));
    setChats(chats.filter((chat) => chat.id !== id));
  };

  const handleTitleUpdate = async (id) => {
    await updateDoc(doc(db, "chat", id), {
      title: newTitle,
    });
    setChats(
      chats.map((chat) =>
        chat.id === id ? { ...chat, title: newTitle } : chat
      )
    );
    setEditingChatId(null);
    setNewTitle("");
  };

  let filteredChats = chats.filter(
    (chat) =>
      chat.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.fileName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.date?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  if (showEmbedded) {
    filteredChats = filteredChats.filter((chat) => chat.embedded === true);
  }

  // Sorting the filteredChats array by the createdAt attribute in descending order
  filteredChats.sort((a, b) => {
    if (a.createdAt > b.createdAt) {
      return -1;
    }
    if (a.createdAt < b.createdAt) {
      return 1;
    }
    return 0;
  });

  const exportChats = () => {
    const blob = new Blob([JSON.stringify(filteredChats)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "filteredChats.json";
    link.click();
  };

  const importChats = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const importedChats = JSON.parse(e.target.result);
      setChats(importedChats);
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-800 text-gray-300 p-4 overflow-y-auto h-screen">
        {/* Import & Export Buttons */}
        <div class="mb-3">
          <input type="file" onChange={importChats} />
          <button onClick={exportChats}>Export Chats</button>
        </div>
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search Chats"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 rounded border flex-grow"
          />
          <Link href="/pdf" className="ml-4 text-white">
            PDF
          </Link>
        </div>

        <label className="ml-4 flex items-center">
          <input
            type="checkbox"
            checked={showEmbedded}
            onChange={() => setShowEmbedded(!showEmbedded)}
          />
          <span className="ml-2">Show Only Embedded</span>
        </label>
        {/* Chat List */}
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
                  <span className="text-sm ml-2">
                    {chat.title +
                      `${
                        chat.FileName ? "   FileName: " + chat.FileName : ""
                      }` +
                      `${chat.name ? " Name: " + chat.name : ""}` +
                      `${chat.email ? " Email: " + chat.email : ""}` +
                      `${chat.phone ? " Phone: " + chat.phone : ""}` +
                      `${chat.date ? " Date: " + chat.date : ""}`}
                  </span>
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
                      m.role === "user" ? "bg-gray-300" : "bg-gray-200"
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
