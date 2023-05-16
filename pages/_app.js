import React, { useEffect, useState } from "react";
import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

function App({ Component, pageProps }) {
  const [rewardfulReady, setRewardfulReady] = useState(false);
  const [displayErrorMessage, setDisplayErrorMessage] = useState(false);

  useEffect(() => {
    let timeoutId;

    const handleRewardfulReady = () => {
      console.log("Rewardful Ready!");
      setRewardfulReady(true);
      clearTimeout(timeoutId);
    };

    if (typeof window.rewardful === "function") {
      window.rewardful("ready", handleRewardfulReady);
    } else {
      console.error("Rewardful function not found in the global scope.");
    }

    // Set a timeout to display an error message after 5 seconds
    timeoutId = setTimeout(() => {
      if (!rewardfulReady) {
        console.log(
          "Rewardful not ready after 5 seconds. Displaying error message."
        );
        setDisplayErrorMessage(true);
      }
    }, 5000);

    // Clear the timeout if the component unmounts before the timeout fires
    return () => clearTimeout(timeoutId);
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
    <QueryClientProvider client={queryClient}>
      {rewardfulReady ? <Component {...pageProps} /> : <div>Loading...</div>}
    </QueryClientProvider>
  );
}

export default App;
