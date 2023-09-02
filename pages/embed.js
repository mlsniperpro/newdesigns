import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';



import Link from 'next/link';
import { useRouter } from 'next/router';



import { auth } from '@/config/firebase';


const CodeSnippetComponent = ({ theme = 'light' }) => {
  const router = useRouter();
  const { fileName } = router.query;

  const [selectedFields, setSelectedFields] = useState({
    name: false,
    email: false,
    phone: false,
  });

  const [textInputFields, setTextInputFields] = useState({
    firstMessage: '',
    inputPlaceholder: '',
    chatName: '',
  });

  const isDarkTheme = theme === 'dark';
  const textColorClass = isDarkTheme ? 'text-white' : 'text-black';

  const vionikoaiChat = {
    userId: auth.currentUser.uid,
    fileName,
    ...selectedFields,
    ...Object.fromEntries(
      Object.entries(textInputFields).filter(([_, value]) => value),
    ),
  };

  const codeSnippet = `
  \`\`\`javascript
  <script>
    window.vionikoaiChat = ${JSON.stringify(vionikoaiChat, null, 2)}
  </script>
  <script src="https://mlsniperpro.github.io/vionikoaichatbox/client/chatWidget.js"></script>
  \`\`\`
  `;

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(
        codeSnippet.replace(/\\`\\`\\`/g, '```'),
      );
      toast.success('Code copied to clipboard');
    } catch (err) {
      toast.error('Failed to copy code to clipboard');
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setSelectedFields((prev) => ({ ...prev, [name]: checked }));
  };

  const handleTextInputChange = (e) => {
    const { name, value } = e.target;
    setTextInputFields((prev) => ({ ...prev, [name]: value }));
  };

  if (!fileName) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className={`flex flex-col justify-center items-center h-screen ${textColorClass}`}
      style={{
        background: 'linear-gradient(to right, #1e3c72, #2a5298)',
        fontFamily:
          'Söhne,ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif,Helvetica Neue,Arial,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji',
      }}
    >
      <div
        className={`prose prose-sm ${textColorClass} p-4 rounded-lg shadow-md bg-white`}
      >
        <ReactMarkdown>{codeSnippet}</ReactMarkdown>
        <button
          onClick={handleCopyToClipboard}
          className="mt-4 p-2 bg-blue-500 text-white rounded-md"
        >
          Copy to Clipboard
        </button>
        <div className="mt-4 flex flex-col">
          {/* Checkbox Fields */}
          <div className="flex flex-col bg-gray-100 p-2 rounded-md">
            <span className="font-bold mb-2">Select Fields:</span>
            {['name', 'email', 'phone'].map((field) => (
              <label key={field} className="flex items-center">
                <input
                  type="checkbox"
                  name={field}
                  checked={selectedFields[field]}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
            ))}
          </div>
          {/* Text Input Fields */}
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
                  value={textInputFields[field]}
                  onChange={handleTextInputChange}
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
