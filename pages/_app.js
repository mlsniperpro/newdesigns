import React, { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from 'react-query';

import '@/styles/globals.css';
import { Inter } from '@next/font/google';

const queryClient = new QueryClient();
const inter = Inter({ subsets: ['latin'] });
function App({ Component, pageProps }) {
  const [rewardfulReady, setRewardfulReady] = useState(false);
  const [displayErrorMessage, setDisplayErrorMessage] = useState(false);

  useEffect(() => {
    let intervalId;
    let timeoutId;

    const checkRewardful = () => {
      if (typeof window.rewardful === 'function') {
        window.rewardful('ready', () => {
          console.log('Rewardful Ready!');
          setRewardfulReady(true);
          clearInterval(intervalId);
          clearTimeout(timeoutId);
        });
      }
    };

    // Check for 'rewardful' function every 500ms
    intervalId = setInterval(checkRewardful, 500);

    // Set a timeout to display an error message after 5 seconds
    timeoutId = setTimeout(() => {
      if (!rewardfulReady) {
        console.log(
          'Rewardful not ready after 5 seconds. Displaying error message.',
        );
        setDisplayErrorMessage(true);
      }
      clearInterval(intervalId);
    }, 5000);

    // Clear the interval and the timeout if the component unmounts
    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, []);

  if (displayErrorMessage) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="max-w-md p-6 m-4 bg-white rounded shadow-xl">
          <h2 className="text-2xl font-bold mb-2 text-gray-700">
            Browser Incompatibility
          </h2>
          <p className="text-gray-700">
            Your browser does not support the required script. Please switch to
            another browser or enable JavaScript execution.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={inter.className}>
      <Toaster />
      <QueryClientProvider client={queryClient}>
        {rewardfulReady ? <Component {...pageProps} /> : <div>Loading...</div>}
      </QueryClientProvider>
    </div>
  );
}

export default App;
