import React from 'react';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import {auth} from "@/config/firebase"

import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const CodeSnippetComponent = ({ theme = 'light' }) => {
  const router = useRouter();
  const { fileName } = router.query; // Access the fileName from query parameters

  const isDarkTheme = theme === 'dark';
  const textColorClass = isDarkTheme ? 'text-white' : 'text-black';
  const codeSnippet = `
  \`\`\`javascript
  <script>
    window.vionikoaiChat = {
      userId: "${auth.currentUser.uid}",
      fileName: "${fileName}", // Use the dynamic fileName value here
    }
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

  // Check if fileName is available (it might be undefined during client-side navigation)
  if (!fileName) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className={`flex flex-col justify-center items-center h-screen ${
        isDarkTheme ? 'bg-gray-900' : 'bg-gray-50'
      } ${textColorClass}`}
      style={{
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
