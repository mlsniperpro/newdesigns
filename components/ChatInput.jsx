import React, { useState } from 'react';

const ChatInput = ({ sendMessage, loading }) => {
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    if (value.trim() === '') return;
    sendMessage({ role: 'user', content: value });
    setValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full bg-white bg-opacity-10 max-h-40 rounded-lg px-4 py-4 overflow-auto relative">
      {loading ? (
        <img src="./loader.gif" className="w-8 m-auto" alt="loader" />
      ) : (
        <>
          <textarea
            onKeyDown={handleKeyDown}
            rows={1}
            className="border-0 bg-transparent outline-none w-11/12"
            value={value}
            type="text"
            onChange={(e) => setValue(e.target.value)}
          />

          <img
            onClick={handleSubmit}
            src="./send.png"
            width={20}
            alt="send-button"
            className="absolute top-4 right-3 hover:cursor-pointer ease-in duration-100 hover:scale-125"
          />
        </>
      )}
    </div>
  );
};

export default ChatInput;
