import React, { useEffect } from "react";
import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

function App({ Component, pageProps }) {
  useEffect(() => {
    const rewardfulReady = () => {
      console.log("Rewardful Ready!");
    };

    // Check if the 'rewardful' function is available in the global scope
    if (typeof window.rewardful === "function") {
      window.rewardful("ready", rewardfulReady);
    } else {
      console.error("Rewardful function not found in the global scope.");
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}

export default App;
