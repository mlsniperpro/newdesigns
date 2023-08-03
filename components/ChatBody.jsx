import React, { useEffect, useRef } from 'react';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';

import autoAnimate from '@formkit/auto-animate';

const ChatBody = ({ chat }) => {
  const parent = useRef(null);
  const bottomRef = useRef(null);

  const aiStyle =
    'bg-white bg-opacity-40 backdrop-blur-lg dropshadow-md mr-auto';

  // Auto animations
  useEffect(() => {
    if (parent.current) {
      autoAnimate(parent.current);
    }
  }, [parent]);

  // Scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  return (
    <div className="flex flex-col gap-4" ref={parent}>
      {chat.map((message, i) => (
        <div
          key={i}
          className={`border-[#999999] break-words border-2 rounded-xl self-end px-3 py-3 max-w-[80%] ${
            message.role === 'assistant' ? aiStyle : ''
          }`}
          style={{ background: '#272727' }}
        >
          <pre
            className="whitespace-pre-wrap"
            style={{ background: '1 1 1 0.2', border: 'none' }}
          >
            <span
              style={{
                color: 'white',
                fontSize: '14px',
                fontFamily: 'Monospace',
                fontSize: '16px',
              }}
            >
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </span>
          </pre>
        </div>
      ))}
      <div ref={bottomRef} className="h-3"></div>
    </div>
  );
};

export default ChatBody;
