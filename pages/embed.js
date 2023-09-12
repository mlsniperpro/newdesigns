import React, { useMemo, useReducer, useState } from 'react';
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
  editableLabels: {
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
  },
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'TOGGLE_SELECTED_FIELD':
      const currentSelectedFields = { ...state.selectedFields };
      if (currentSelectedFields[action.payload.name]) {
        delete currentSelectedFields[action.payload.name];
      } else {
        currentSelectedFields[action.payload.name] =
          state.editableLabels[action.payload.name];
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
    case 'SET_EDITABLE_LABEL':
      return {
        ...state,
        editableLabels: {
          ...state.editableLabels,
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
  const [selectedScript, setSelectedScript] = useState('chatWidget.js');

  const isDarkTheme = useMemo(() => theme === 'dark', [theme]);
  const textColorClass = useMemo(
    () => (isDarkTheme ? 'text-white' : 'text-black'),
    [isDarkTheme],
  );

  const toggleScript = () => {
    const newScript =
      selectedScript === 'chatWidget.js'
        ? 'chatWidgetIframe.js'
        : 'chatWidget.js';
    setSelectedScript(newScript);
    toast.success(
      `Mode switched to ${
        newScript === 'chatWidget.js' ? 'Script Injection' : 'Iframe'
      } mode`,
    );
  };

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
    )};</script>`;
  }, [state, fileName, selectedScript]);

  const handleInputChange = (e) => {
    const { name, type } = e.target;
    const payload = { name };
    dispatch({
      type: 'TOGGLE_SELECTED_FIELD',
      payload,
    });
  };

  const handleLabelChange = (e) => {
    const { name, value } = e.target;
    dispatch({
      type: 'SET_EDITABLE_LABEL',
      payload: { name, value },
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
        <button
          onClick={toggleScript}
          className="mt-4 p-2 bg-green-500 text-white rounded-md"
        >
          Toggle Script
        </button>
        <div className="mt-4 flex flex-col">
          <div className="flex flex-col bg-gray-100 p-2 rounded-md">
            <span className="font-bold mb-2">Select Fields:</span>
            {['name', 'email', 'phone'].map((field) => (
              <label key={field} className="flex items-center">
                <input
                  type="checkbox"
                  name={field}
                  checked={!!state.selectedFields[field]}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <input
                  type="text"
                  name={field}
                  value={state.editableLabels[field]}
                  onChange={handleLabelChange}
                  className="p-2 border rounded-md"
                />
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
