import React, { useState, useEffect, use } from 'react';



import YouGoogleChat from '../components/YouGoogleChat';
import YouGoogleSideBar from '../components/YouGoogleSidebar';
import YouTube from '../components/YouTube';


function Youtube() {
  const [transcript, setTranscript] = useState(null);
  const [mode, setMode] = useState('youtube');
  const [currentUrl, setCurrentUrl] = useState(''); // State to hold the current YouTube URL
  const [transcriptContent, setTranscriptContent] = useState(''); // State to hold the current YouTube URL

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === 'youtube' ? 'google' : 'youtube'));
  };

  const handleUrlChange = (newUrl) => {
    setCurrentUrl(newUrl); // Update the current URL
    // Do something with the new URL if needed
  };

  const queryGetTranscript = async (
    url,
    language = 'en',
    addVideoInfo = true,
  ) => {
    try {
      const requestBody = JSON.stringify({
        url,
        language,
        addVideoInfo,
      });

      const config = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: requestBody,
      };

      const response = await fetch(
        'https://us-central1-vioniko-82fcb.cloudfunctions.net/getTranscript',
        config,
      );
      const responseData = await response.json();

      if (response.status === 200) {
        console.log('Received transcript:', responseData);
        return responseData;
      } else {
        console.error('Error:', responseData.error);
        return null;
      }
    } catch (error) {
      console.error('An error occurred:', error);
      return null;
    }
  };

  const fetchAndCacheData = async () => {
    const cachedData = localStorage.getItem(currentUrl);
    const currentTime = new Date().getTime();

    if (cachedData) {
      const { data, expiry } = JSON.parse(cachedData);
      if (currentTime < expiry) {
        setTranscript(data);
        return;
      }
    }

    const transcriptData = await queryGetTranscript(currentUrl);
    if (transcriptData) {
      const expiry = currentTime + 5 * 60 * 60 * 1000; // Cache for 5 hours
      localStorage.setItem(
        currentUrl,
        JSON.stringify({ data: transcriptData, expiry }),
      );
      setTranscript(transcriptData);
    }
  };

  useEffect(() => {
    fetchAndCacheData();
  }, [currentUrl]);

  useEffect(() => {
    if(!transcript) return;
    const content = `
    Author: ${transcript[0].metadata.author}
    Title: ${transcript[0].metadata.title}
    Description: ${transcript[0].metadata.description}
    Source: ${transcript[0].metadata.source}
    Transcript: ${transcript[0].pageContent}
    `
    console.log('content', content);
    setTranscriptContent(content);
  }, [transcript]);
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
              <YouGoogleChat transcriptContent={transcriptContent} mode={mode} currentUrl={currentUrl}/>
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