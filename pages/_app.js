import React, { useEffect, useState } from "react";
import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

function App({ Component, pageProps }) {
  const [rewardfulReady, setRewardfulReady] = useState(false);
  const [displayErrorMessage, setDisplayErrorMessage] = useState(false);

  useEffect(() => {
    const handleRewardfulReady = () => {
      console.log("Rewardful Ready!");
      setRewardfulReady(true);
    };

    if (typeof window.rewardful === "function") {
      window.rewardful("ready", handleRewardfulReady);
    } else {
      console.error("Rewardful function not found in the global scope.");
    }

    // Set a timeout to display an error message after 5 seconds
    const timeoutId = setTimeout(() => {
      if (!rewardfulReady) {
        console.log("Rewardful not ready after 5 seconds. Displaying error message.");
        setDisplayErrorMessage(true);
      }
    }, 5000);

    // Clear the timeout if the component unmounts before the timeout fires
    return () => clearTimeout(timeoutId);
  }, []);

  if (displayErrorMessage) {
    return (
      <div>
        Your browser does not support the required script. Please switch to another browser or enable JavaScript execution.
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
