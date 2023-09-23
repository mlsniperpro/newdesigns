import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

import updateUserWordCount from '../utils/updateWordCount';

import { auth } from '@/config/firebase';

export default function YouGoogleChat({
  theme = 'light',
  embeddingData,
  chatId,
}) {
  // State management for messages and input
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  // Simulate API call to fetch messages
  const fetchMessages = async () => {
    // Replace this with your actual API call
    // const fetchedMessages = await apiCall();
    // setMessages(fetchedMessages);
  };

  // Handle message submission
  const handleMessageSubmit = (e) => {
    e.preventDefault();
    const newMessage = {
      content: input,
      role: 'user', // Replace with the actual role
    };
    setMessages([...messages, newMessage]);
    updateUserWordCount(input, auth?.currentUser?.uid);
    setInput('');
  };

  // Reset messages when embeddingData changes
  useEffect(() => {
    setMessages([]);
  }, [embeddingData]);

  // Update word count when a new message is added
  useEffect(() => {
    if (messages[messages.length - 1]?.role === 'user') {
      // Additional logic for updating word count can go here
    }
  }, [messages]);

  // Theme and text color settings
  const isDarkTheme = theme === 'dark';
  const textColorClass = isDarkTheme ? 'text-white' : 'text-black';

  return (
    <div
      className={`flex flex-col h-screen p-4 ${
        isDarkTheme ? 'bg-gray-900' : 'bg-gray-50'
      } ${textColorClass}`}
    >
      <div className="flex flex-col flex-grow overflow-y-auto">
        <ul className="max-h-full w-full rounded-lg">
          {messages.map((m, index) => (
            <li
              key={index}
              className={`flex flex-col w-full mb-2 p-2 rounded-md ${textColorClass} ${
                m.role === 'user'
                  ? isDarkTheme
                    ? 'bg-gray-700'
                    : 'bg-gray-200'
                  : isDarkTheme
                  ? 'bg-gray-600'
                  : 'bg-warm-gray-200'
              } ml-2 mr-2`}
            >
              <div className={`prose prose-sm ${textColorClass}`}>
                <ReactMarkdown>{m.content}</ReactMarkdown>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <form
        onSubmit={handleMessageSubmit}
        className={`flex items-center w-full border-t p-4 ${textColorClass} ${
          isDarkTheme ? 'bg-gray-700' : 'bg-gray-200'
        }`}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Say something..."
          className={`flex-grow p-2 border rounded-md ${
            isDarkTheme ? 'bg-gray-600 text-white' : 'bg-white text-black'
          } ml-2 mr-2`}
        />
        <button
          type="submit"
          className="ml-4 p-2 bg-blue-500 text-white rounded-md"
        >
          Send
        </button>
      </form>
    </div>
  );
}
