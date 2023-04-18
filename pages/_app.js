import '@/styles/globals.css'
import { QueryClient, QueryClientProvider } from 'react-query';
// import './style.css';
const queryClient = new QueryClient();
export default function App({ Component, pageProps }) {

  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  )
}
