// 1. Import Dependencies
import React, { useState } from 'react';

// 2. State Management
const YouTube = () => {
  const [videoUrl, setVideoUrl] = useState('');

  // 3. Input Field
  const handleInputChange = (e) => {
    const newUrl = e.target.value;

    // 4. Update State
    setVideoUrl(newUrl);
  };

  // Extract video ID from URL
  const extractVideoId = (url) => {
    const videoId = url.split('v=')[1]?.split('&')[0];
    return videoId;
  };

  // 5. Render Video
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600">
      {' '}
      {/* Gradient Background */}
      <input
        type="text"
        placeholder="Enter YouTube video URL"
        value={videoUrl}
        onChange={handleInputChange}
        className="p-4 mb-8 text-black placeholder-black bg-white bg-opacity-80 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out" // Visible Input Text
      />
      {videoUrl && (
        <iframe
          width="560"
          height="315"
          src={`https://www.youtube.com/embed/${extractVideoId(videoUrl)}`}
          allowFullScreen
          className="border-0 rounded-lg shadow-lg" // 2. CSS Styling
        ></iframe>
      )}
    </div> // Container Styling
  );
};

export default YouTube;
