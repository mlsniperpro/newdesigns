import React, { useState } from 'react';

import YouGoogleChat from '../components/YouGoogleChat';
import YouGoogleSideBar from '../components/YouGoogleSidebar';
import YouTube from '../components/YouTube';

function Youtube() {
  const [mode, setMode] = useState('youtube');
  const [currentUrl, setCurrentUrl] = useState(''); // State to hold the current YouTube URL

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === 'youtube' ? 'google' : 'youtube'));
  };

  const handleUrlChange = (newUrl) => {
    setCurrentUrl(newUrl); // Update the current URL
    // Do something with the new URL if needed
  };

  return (
    <div className="flex h-screen bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600">
      <div className="w-64 bg-blue-700 mr-10 max-h-screen overflow-y-auto">
        <YouGoogleSideBar />
      </div>
      <div className="flex flex-col flex-1">
        <div className="flex justify-end p-4 bg-blue-700">
          <button
            onClick={toggleMode}
            className="px-4 py-2 text-white rounded-lg hover:bg-blue-800"
          >
            {mode === 'youtube' ? 'Google' : 'YouTube'}
          </button>
        </div>
        {mode === 'youtube' ? (
          <div className="flex flex-row flex-1">
            <div style={{ width: '560px' }}>
              <YouTube onUrlChange={handleUrlChange}/>{' '}
              {/* Pass the callback */}
            </div>
            <div className="flex-1 bg-white">
              <YouGoogleChat currentUrl={currentUrl} mode={mode}/>
            </div>
          </div>
        ) : (
          <div className="flex-1 bg-white">
            <YouGoogleChat mode={mode}/>
          </div>
        )}
      </div>
    </div>
  );
}

export default Youtube;
