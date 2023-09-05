import React, { useMemo, useReducer } from 'react';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';

import Link from 'next/link';
import { useRouter } from 'next/router';

import { auth } from '@/config/firebase';

const initialState = {
  selectedFields: {},
  textInputFields: {
    firstMessage: '',
    inputPlaceholder: '',
    chatName: '',
  },
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'TOGGLE_SELECTED_FIELD':
      const currentSelectedFields = { ...state.selectedFields };
      if (currentSelectedFields[action.payload.name]) {
        delete currentSelectedFields[action.payload.name];
      } else {
        currentSelectedFields[action.payload.name] = true;
      }
      return {
        ...state,
        selectedFields: currentSelectedFields,
      };
    case 'SET_TEXT_INPUT_FIELD':
      return {
        ...state,
        textInputFields: {
          ...state.textInputFields,
          [action.payload.name]: action.payload.value,
        },
      };
    default:
      return state;
  }
};

const CodeSnippetComponent = ({ theme = 'light' }) => {
  const router = useRouter();
  const { fileName } = router.query;
  const [state, dispatch] = useReducer(reducer, initialState);

  const isDarkTheme = useMemo(() => theme === 'dark', [theme]);
  const textColorClass = useMemo(
    () => (isDarkTheme ? 'text-white' : 'text-black'),
    [isDarkTheme],
  );

  const generateCodeSnippet = useMemo(() => {
    const vionikoaiChat = {
      userId: auth.currentUser.uid,
      fileName,
      ...state.selectedFields,
      ...Object.fromEntries(
        Object.entries(state.textInputFields).filter(([_, value]) => value),
      ),
    };
    return `<script type="application/javascript">window.vionikoaiChat = ${JSON.stringify(
      vionikoaiChat,
      null,
      2,
    )};(function(d, s, id) {var js, fjs = d.getElementsByTagName(s)[0];if (d.getElementById(id)) return;js = d.createElement(s);js.id = id;js.async = true;js.src = "https://mlsniperpro.github.io/vionikoaichatbox/client/chatWidget.js";fjs.parentNode.insertBefore(js, fjs);}(document, 'script', 'vionikoaiChat-jssdk'));</script>`;
  }, [state, fileName]);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    const payload = { name, value };
    dispatch({
      type:
        type === 'checkbox' ? 'TOGGLE_SELECTED_FIELD' : 'SET_TEXT_INPUT_FIELD',
      payload,
    });
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateCodeSnippet);
      toast.success('Code copied to clipboard');
    } catch (err) {
      toast.error('Failed to copy code to clipboard');
    }
  };

  if (!fileName) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className={`flex flex-col justify-center items-center h-screen ${textColorClass}`}
    >
      <div
        className={`prose prose-sm ${textColorClass} p-4 rounded-lg shadow-md bg-white`}
      >
        <ReactMarkdown>{`\`\`\`javascript\n${generateCodeSnippet}\n\`\`\``}</ReactMarkdown>
        <button
          onClick={handleCopyToClipboard}
          className="mt-4 p-2 bg-blue-500 text-white rounded-md"
        >
          Copy to Clipboard
        </button>
        <div className="mt-4 flex flex-col">
          <div className="flex flex-col bg-gray-100 p-2 rounded-md">
            <span className="font-bold mb-2">Select Fields:</span>
            {['name', 'email', 'phone'].map((field) => (
              <label key={field} className="flex items-center">
                <input
                  type="checkbox"
                  name={field}
                  checked={state.selectedFields[field]}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
            ))}
          </div>
          <div className="flex flex-col bg-gray-100 p-2 rounded-md mt-4">
            <span className="font-bold mb-2">Text Inputs:</span>
            {['firstMessage', 'inputPlaceholder', 'chatName'].map((field) => (
              <label key={field} className="flex flex-col mb-2">
                {field
                  .split(/(?=[A-Z])/)
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ')}
                <input
                  type="text"
                  name={field}
                  value={state.textInputFields[field]}
                  onChange={handleInputChange}
                  className="p-2 border rounded-md"
                />
              </label>
            ))}
          </div>
        </div>
        <div className="mt-4">
          <Link href="/pdf">
            <span className={`underline ${textColorClass}`}>Back to PDF</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CodeSnippetComponent;
