import React, { useEffect, useState } from "react";
import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "react-query";

// Initialize the query client outside of the component so it doesn't get recreated on every render
const queryClient = new QueryClient();

function App({ Component, pageProps }) {
  const [rewardfulReady, setRewardfulReady] = useState(false);

  useEffect(() => {
    // 'rewardful' function should be added to the window object by the external script
    const handleRewardfulReady = () => {
      console.log("Rewardful Ready!");
      setRewardfulReady(true);
    };

    // Check if the 'rewardful' function is available in the global scope
    if (typeof window.rewardful === "function") {
      window.rewardful("ready", handleRewardfulReady);
    } else {
      console.error("Rewardful function not found in the global scope.");
      // handle error scenario here, e.g., show an error message to the user, retry loading the script, etc.
    }
  }, []);

  // Here we could potentially render something different or show an error message if Rewardful isn't ready
  return (
    <QueryClientProvider client={queryClient}>
      {rewardfulReady ? <Component {...pageProps} /> : <div>Loading...</div>}
    </QueryClientProvider>
  );
}

export default App;

