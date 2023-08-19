import { useChat } from 'ai/react';
import { useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';



import { getSimilarDocsFromChunks } from '@/utils/similarDocs';


export default function PDFChat({ theme = 'light', embeddingData }) {
  const [contextState, setContextState] = useState(null);
  const contextRef = useRef(null);
  const updateContext = (value) => {
    contextRef.current = value;
    setContextState(value);
  };
  const contextRetriever = async () => {
    let texts;
    const docs = await getSimilarDocsFromChunks(embeddingData, input, 15);
    console.log('THE DOCS ARE: ', docs);
    texts = docs.map((doc) => doc.doc);
    texts = texts.join(' ');

    updateContext(texts);

    return texts;
  };
  
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat',
    body: {
      context: contextRef.current,
    },
  });

  const isDarkTheme = theme === 'dark';

  const textColorClass = isDarkTheme ? 'text-white' : 'text-black';
  const handleFormWithRetrieval = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    await contextRetriever(); // Wait for contextRetriever to complete
    handleSubmit(e); // Now call handleSubmit
  };
  return (
    <div
      className={`flex flex-col h-screen p-4 ${
        isDarkTheme ? 'bg-gray-900' : 'bg-gray-50'
      } ${textColorClass}`}
      style={{
        fontFamily:
          'Söhne,ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif,Helvetica Neue,Arial,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji',
        backgroundColor: isDarkTheme ? 'rgba(52,53,65,1)' : '#f7f7f8',
      }}
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
        onSubmit={handleFormWithRetrieval}
        className={`flex items-center w-full border-t p-4 ${textColorClass} ${
          isDarkTheme ? 'bg-gray-700' : 'bg-gray-200'
        }`}
      >
        <input
          value={input}
          onChange={handleInputChange}
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