import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import Head from 'next/head';
import { useRouter } from 'next/router';

import useSubscription from '@/hooks/useSubscription';

import Dashboard from '../components/dashboard';
import PlanSelection from '@/components/PlanSelection';

import { auth } from '../config/firebase';

import { parseCookies } from 'nookies';
import PropTypes from 'prop-types';

const MainContent = React.memo(
  ({ loading, subscriptionDetails, upgrade, onValueChange }) => {
    if (loading) {
      return <Dashboard />;
    }

    if (
      (subscriptionDetails.payPalStatus === 'ACTIVE' ||
        subscriptionDetails.subscribed ||
        subscriptionDetails.fairUse) &&
      !upgrade
    ) {
      return (
        <Dashboard
          onValueChange={onValueChange}
          subscriptionDetails={subscriptionDetails}
        />
      );
    }

    return <PlanSelection />;
  },
);

MainContent.displayName = 'MainContent';

MainContent.propTypes = {
  loading: PropTypes.bool.isRequired,
  subscriptionDetails: PropTypes.object.isRequired,
  upgrade: PropTypes.bool.isRequired,
  onValueChange: PropTypes.func.isRequired,
};

function Index() {
  const [user, loadingAuth] = useAuthState(auth);
  const [upgrade, setUpgrade] = useState(false);
  const { loading, subscriptionDetails } = useSubscription(user);
  const router = useRouter();

  const handleValueChange = useCallback((newValue) => {
    setUpgrade(newValue);
  }, []);

  useEffect(() => {
    if (
      !auth?.currentUser?.uid &&
      typeof window !== 'undefined' &&
      !window.history.state?.fromLink
    ) {
      router.replace('/home');
    }
  }, [user, loadingAuth]);

  const mainContentProps = useMemo(
    () => ({
      loading,
      subscriptionDetails,
      upgrade,
      onValueChange: handleValueChange,
    }),
    [loading, subscriptionDetails, upgrade, handleValueChange],
  );

  return (
    <div>
      <Head>
        <title>Vionko Marketing AI</title>
      </Head>
      <div className="bg-[#1A232E] flex flex-col items-center justify-center min-h-screen py-2">
        <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
          <MainContent {...mainContentProps} />
        </main>
      </div>
    </div>
  );
}

export default Index;

export async function getServerSideProps(context) {
  const cookies = parseCookies(context);

  if (!cookies.auth) {
    return {
      redirect: {
        destination: '/home',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
