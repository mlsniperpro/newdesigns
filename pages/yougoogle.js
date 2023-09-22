// 1. Import Dependencies
import React, { useState } from 'react';

import YouGoogleChat from '../components/YouGoogleChat';
import YouGoogleSideBar from '../components/YouGoogleSidebar';
import YouTube from '../components/YouTube';

function Youtube() {
  // Toggle State
  const [mode, setMode] = useState('youtube');

  // Toggle Button
  const toggleMode = () => {
    setMode((prevMode) => (prevMode === 'youtube' ? 'google' : 'youtube'));
  };

  return (
    <div className="flex h-screen bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600">
      {/* Fixed Sidebar */}
      <div className="fixed top-0 left-0 w-64 h-full bg-blue-700">
        <YouGoogleSideBar />
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 ml-64">
        {' '}
        {/* Non-Overlapping Layout */}
        {/* Right-Aligned Toggle Button */}
        <div className="flex justify-end p-4 bg-blue-700">
          <button
            onClick={toggleMode}
            className="px-4 py-2 text-white rounded-lg hover:bg-blue-800"
          >
            {mode === 'youtube' ? 'Google' : 'YouTube'}
          </button>
        </div>
        {/* Conditional Container Rendering */}
        {mode === 'youtube' ? (
          <div className="flex flex-row flex-1">
            {/* 1. Fixed YouTube Width */}
            <div style={{ width: '560px' }}>
              <YouTube />
            </div>
            <div className="flex-1 bg-white">
              <YouGoogleChat />
            </div>
          </div>
        ) : (
          <div className="flex-1 bg-white">
            <YouGoogleChat />
          </div>
        )}
      </div>
    </div>
  );
}

export default Youtube;
