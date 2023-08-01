import React, { useEffect , useState} from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';


import Head from 'next/head';
import { useRouter } from 'next/router';



import useSubscription from '@/hooks/useSubscription';



import Dashboard from '../components/dashboard';
import Loader from '@/components/Loader';
import PlanSelection from '@/components/PlanSelection';



import { auth } from '../config/firebase';



import { parseCookies } from 'nookies';


function Index() {
  const [user, loadingAuth] = useAuthState(auth);
  const [upgrade, setUpgrade] = useState(false);
  const { loading, subscribed } = useSubscription(user); // use custom hook
  const router = useRouter();

  const handleValueChange = (newValue) => {
    setUpgrade(newValue);
  };

  useEffect(() => {
    if (
      !auth?.currentUser?.uid &&
      typeof window !== 'undefined' &&
      !window.history.state?.fromLink
    ) {
      router.replace('/home');
    }
  }, [user, loadingAuth]);

  return (
    <div>
      <Head>
        <title>Vionko Marketing AI</title>
      </Head>
      <div className="bg-[#1A232E] flex flex-col items-center justify-center min-h-screen py-2">
        <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
          {loading ? (
            <Loader />
          ) : subscribed && !upgrade ? (
            <Dashboard onValueChange={handleValueChange} />
          ) : (
            <PlanSelection />
          )}
        </main>
      </div>
    </div>
  );
}

export default Index;


export async function getServerSideProps(context) {
  const cookies = parseCookies(context);

  // Check if the user is authenticated
  if (!cookies.auth) {
    return {
      redirect: {
        destination: '/home',
        permanent: false,
      },
    };
  }

  // If the user is authenticated, return the default props
  return {
    props: {},
  };
}