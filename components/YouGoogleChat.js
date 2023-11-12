// Importing required modules and utilities
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';

import fetchResponse from '../utils/fetchResponse';
import { performGoogleSearch } from '../utils/googleSearch';
import updateUserWordCount from '../utils/updateWordCount';
import { iterativeCharacterTextSplitter } from '@/utils/extractTextFromPdfs';
import { getEmbeddings } from '@/utils/similarDocs';
import { contextRetriever } from '@/utils/similarDocs';

import { auth, db, storage } from '@/config/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { deleteObject, listAll, ref, uploadBytes } from 'firebase/storage';

// Main component definition
export default function YouGoogleChat({
  theme = 'light',
  transcriptContent,
  chatId,
  currentUrl,
  mode,
}) {
  // State variables
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [embeddingwithChunks, setEmbeddingwithChunks] = useState();
  let links = [];
  useEffect(() => {
    if (!transcriptContent) return;
    const fetchData = async () => {
      // Reference to Firestore document
      const docRef = doc(
        db,
        'transcripts',
        Buffer.from(currentUrl)
          .toString('base64')
          .replace(/\//g, '_')
          .replace(/\+/g, '-')
          .replace(/=/g, ''),
      );

      const docSnap = await getDoc(docRef);

      let shouldUpdate = true;

      if (docSnap.exists()) {
        const existingData = docSnap.data();

        // Check if transcript is the same as the existing one
        if (existingData.transcript === transcriptContent) {
          setEmbeddingwithChunks(existingData.embeddings);
          console.log(
            'Document and transcript content are the same. Skipping update.',
          );
          shouldUpdate = false;
        }
      }

      if (shouldUpdate) {
        const chunks = iterativeCharacterTextSplitter(
          transcriptContent,
          2000,
          100,
        );

        // Use Promise.all for concurrent fetching of embeddings
        const embeddings = await getEmbeddings(chunks);
        setEmbeddingwithChunks(embeddings);

        if (docSnap.exists()) {
          await updateDoc(docRef, {
            transcript: transcriptContent,
            embeddings: embeddings,
          });
        } else {
          await setDoc(docRef, {
            transcript: transcriptContent,
            embeddings: embeddings,
          });
        }
      }
    };

    fetchData();
  }, [transcriptContent]);

  useEffect(() => {
    if (!embeddingwithChunks) return;
    console.log('Embedding with chunks', embeddingwithChunks);
  }, [embeddingwithChunks]);

  // Function to handle message submission
  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    setInput('');
    try {
      let prompt, reader;
      setMessages((prevMessages) => [
        ...prevMessages,
        { content: input, role: 'user' },
      ]);

      if (mode === 'google') {
        const googleResults = await performGoogleSearch(input, 10);
        links = googleResults['links'];
        console.log('Here are the google results', googleResults);
        prompt = `You are provided with incomplete snippets extracted from internet and user question:
        QUESTION: ${input}
      SNIPPETS: ${googleResults['snippets']};
1. Present your response in a checklist format.
2. Use the same language as the user's question.
`;
        //3. List the following links as the sources of the snippets above after you are done answering questions:
        //LINKS: ${googleResults['links']}

        reader = await fetchResponse(
          [...messages, { content: prompt, role: 'user' }],
          auth?.currentUser?.uid,
        );
      } else if (!embeddingwithChunks) {
        //Remove the user message
        setMessages((prevMessages) => [...prevMessages.slice(0, -1)]);
        toast.error('Please wait for the transcript to load');
        return;
      } else {
        const context = await contextRetriever(embeddingwithChunks, input);
        prompt = `
      Based on youtube transcript below,  please answer the user question, following this next 3 instructions:

1. Respond to the user's question according to requirements of user, be very precise. 
2. Present your response in a checklist format.
3. In the response you give ,use the same language used from the user's question.
    
      User question: ${input}
      YouTube transcript: ${context}
      
      And again remember to reply in the same language that user used in the question and not in the language used in the transcript.`;

        reader = await fetchResponse(
          [...messages, { content: prompt, role: 'user' }],
          auth?.currentUser?.uid,
        );
      }

      let assistantMessage = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          //We need to add line breaks to the links and ensure they are listed separate from the snippets and one another
          links = links.map((x) => x + '\n');
          links = links.join('\n');
          assistantMessage += '\n\n' + links;
          // Update the last message in the message thread
          setMessages((prevMessages) => {
            // Clone the previous messages array
            let updatedMessages = [...prevMessages];
              // Update the content of the last message
              let lastMessageIndex = updatedMessages.length - 1;
              updatedMessages[lastMessageIndex] = {
                ...updatedMessages[lastMessageIndex],
                content:
                   assistantMessage,
              };
            return updatedMessages;
          });
          await updateUserWordCount(prompt, auth?.currentUser?.uid);
          await updateUserWordCount(assistantMessage, auth?.currentUser?.uid);
          break;
        }

        const textChunk = new TextDecoder().decode(value);
        const match = textChunk.match(/data: (.*?})\s/);

        if (match?.[1]) {
          const { choices } = JSON.parse(match[1]);
          const content = choices?.[0]?.delta?.content;

          if (content) {
            assistantMessage += content;
            setMessages((prevMessages) => {
              const lastMessage = prevMessages[prevMessages.length - 1];
              const newMessage = {
                content: assistantMessage,
                role: 'assistant',
              };

              return lastMessage?.role === 'assistant'
                ? [...prevMessages.slice(0, -1), newMessage]
                : [...prevMessages, newMessage];
            });
          }
        }
      }
    } catch (error) {
      console.error('Error in handleMessageSubmit:', error);
    }
  };

  useEffect(() => {
    console.log('Transcript content', transcriptContent);
  }, [transcriptContent]);

  // Fetch messages when chatId changes
  useEffect(() => {
    const fetchMessages = async () => {
      // Implement your message fetching logic here
    };
    fetchMessages();
  }, [chatId]);

  // Additional logic for updating word count
  useEffect(() => {
    if (messages[messages.length - 1]?.role === 'user') {
      // Additional logic for updating word count can go here
    }
  }, [messages]);

  // Theme-related variables
  const isDarkTheme = theme === 'dark';
  const textColorClass = isDarkTheme ? 'text-white' : 'text-black';

  // JSX for rendering the component
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
