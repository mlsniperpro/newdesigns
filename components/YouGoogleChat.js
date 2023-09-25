import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

import fetchResponse from '../utils/fetchResponse';
import { performGoogleSearch } from '../utils/googleSearch';
import updateUserWordCount from '../utils/updateWordCount';

import { auth } from '@/config/firebase';

export default function YouGoogleChat({
  theme = 'light',
  embeddingData,
  chatId,
}) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('google');

  const fetchMessages = async () => {
    // Implement your message fetching logic here
  };

  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    const googleResults = await performGoogleSearch(input, 10); // Assuming this is async
    const prompt = `Based on the google search result below please answer the user question.
    User question: ${input}
    Google search results: ${googleResults}`;

    setMessages((prevMessages) => [
      ...prevMessages,
      { content: prompt, role: 'user' },
    ]);
    let message = [...messages, { content: prompt, role: 'user' }]
    const reader = await fetchResponse(message, auth?.currentUser?.uid);
    let assistantMessage = '';
    setInput('');
    while (true) {
      const { done, value } = reader.read();
      if (done) {
        break;
      }
      const textChunk = new TextDecoder().decode(value);
      const match = textChunk.match(/data: (.*?})\s/);
      if (match && match[1]) {
        const jsonData = JSON.parse(match[1]);
        if (
          jsonData.choices &&
          jsonData.choices[0] &&
          jsonData.choices[0].delta &&
          jsonData.choices[0].delta.content
        ) {
          assistantMessage = jsonData.choices[0].delta.content;
          setMessages((prevMessages) => [
            ...prevMessages.slice(0, -1),
            { content: assistantMessage, role: 'assistant' },
          ]);
        }
      }
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [chatId]);

  useEffect(() => {
    if (messages[messages.length - 1]?.role === 'user') {
      // Additional logic for updating word count can go here
    }
  }, [messages]);

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
