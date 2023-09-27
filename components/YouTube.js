import React, { useState } from 'react';

const YouTube = ({ onUrlChange }) => {
  const [videoUrl, setVideoUrl] = useState('');

  const handleInputChange = (e) => {
    const newUrl = e.target.value;
    setVideoUrl(newUrl);
    onUrlChange(newUrl); // Notify the parent component
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600">
      <input
        type="text"
        placeholder="Enter YouTube video URL"
        value={videoUrl}
        onChange={handleInputChange}
        className="p-4 mb-8 text-black placeholder-black bg-white bg-opacity-80 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out"
      />
      {videoUrl && (
        <iframe
          width="560"
          height="315"
          src={`https://www.youtube.com/embed/${
            videoUrl.split('v=')[1]?.split('&')[0]
          }`}
          allowFullScreen
          className="border-0 rounded-lg shadow-lg"
        ></iframe>
      )}
    </div>
  );
};

export default YouTube;
