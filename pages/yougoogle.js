// 1. Import Dependencies
import React, { useState } from 'react';

import YouGoogleChat from '../components/YouGoogleChat';
import YouGoogleSideBar from '../components/YouGoogleSidebar';
import YouTube from '../components/YouTube';

function Youtube() {
  // 2. Toggle State
  // State to manage the current mode (YouTube or Google Chat)
  const [mode, setMode] = useState('youtube');

  // 3. Toggle Button Function
  // Function to toggle between YouTube and Google Chat modes
  const toggleMode = () => {
    setMode((prevMode) => (prevMode === 'youtube' ? 'google' : 'youtube'));
  };

  // 4. Main Component Rendering
  return (
    <div className="flex h-screen bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600">
      {/* 5. Fixed Sidebar */}
      {/* Sidebar is fixed to the top-left corner of the screen */}
      <div className="fixed top-0 left-0 w-64 h-full bg-blue-700 z-10">
        <YouGoogleSideBar />
      </div>

      {/* 6. Main Content */}
      {/* Main content area that includes the toggle button and either YouTube or Google Chat */}
      <div className="flex flex-col flex-1 ml-64">
        {/* 7. Toggle Button */}
        {/* Button to toggle between YouTube and Google Chat */}
        <div className="flex justify-end p-4 bg-blue-700">
          <button
            onClick={toggleMode}
            className="px-4 py-2 text-white rounded-lg hover:bg-blue-800"
          >
            {mode === 'youtube' ? 'Google' : 'YouTube'}
          </button>
        </div>
        {/* 8. Conditional Container Rendering */}
        {/* Depending on the mode, render either YouTube alongside Google Chat or just Google Chat */}
        {mode === 'youtube' ? (
          <div className="flex flex-row flex-1">
            {/* 9. YouTube Component */}
            <div style={{ width: '560px' }}>
              <YouTube />
            </div>
            {/* 10. Google Chat Component */}
            <div className="flex-1 bg-white">
              <YouGoogleChat />
            </div>
          </div>
        ) : (
          <div className="flex-1 bg-white">
            {/* 11. Google Chat Component */}
            <YouGoogleChat />
          </div>
        )}
      </div>
    </div>
  );
}

export default Youtube;
