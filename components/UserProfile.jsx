import { useEffect, useState } from 'react';
import Avatar from 'react-avatar';
import { useAuthState } from 'react-firebase-hooks/auth';

import Image from 'next/image';

import { auth, db } from '../config/firebase';

import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [userAuth, loadingAuth] = useAuthState(auth);
  const [loading, setLoading] = useState(true);
  const [currentSubscription, setCurrentSubscription] = useState(null);

  const fetchUser = async (userAuth) => {
    if (userAuth) {
      const q = query(
        collection(db, 'users'),
        where('userId', '==', userAuth.uid),
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        if (!('stripeLink' in userData) || !('stripeId' in userData)) {
          setUser(userData);
        }
      });
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
      try {
        await fetchUser(userAuth);
      } catch (error) {
        console.error('Error fetching user data: ', error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchSubscription = () => {
    if (!userAuth) return;

    const stripeProducts = {
      prod_Njtrgy9W8UwGW7: 'Monthly',
      prod_NjtvxM9XlsH2c6: 'Yearly',
    };
    const subscriptionsRef = collection(
      db,
      'users',
      auth.currentUser?.uid,
      'subscriptions',
    );
    const q = query(
      subscriptionsRef,
      where('status', 'in', ['trialing', 'active']),
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const doc = snapshot.docs[0];
        if (doc) {
          const subscription = {
            userId: auth.currentUser?.uid,
            subscriptionEndDate: doc.data().current_period_end.seconds * 1000,
            subscriptionStartDate:
              doc.data().current_period_start.seconds * 1000,
            plan: stripeProducts[doc.data().items[0]['plan']['product']],
          };
          setCurrentSubscription(subscription);
        }
      },

      (error) => {
        console.error('Snapshot listener error:', error);
      },
    );

    setTimeout(unsubscribe, 10000);

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  };

  useEffect(fetchSubscription, [userAuth]);

  useEffect(() => {
    if (!userAuth) return;
    const checkPayPalSubscribers = async () => {
      const subscribersSnapshot = await getDocs(collection(db, 'subscribers'));
      const subscribers = subscribersSnapshot.docs.map((doc) => doc.data());
      const userSubscriptions = subscribers.filter(
        (subscriber) => subscriber.userId === auth.currentUser?.uid,
      );
      const latestSubscription = userSubscriptions.reduce(
        (a, b) => (a.subscriptionEndDate > b.subscriptionEndDate ? a : b),
        {},
      );

      if (latestSubscription.subscriptionEndDate > Date.now()) {
        setCurrentSubscription(latestSubscription);
      }
    };

    checkPayPalSubscribers();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="flex flex-col items-center bg-white p-6 my-4 w-full sm:w-3/4 lg:w-1/2 xl:w-3/8 xxl:w-1/4 rounded-xl shadow-md space-y-4">
        <div className="flex-shrink-0">
          {user?.photo ? (
            <Image
              src={user.photo}
              alt="User Avatar"
              width={50}
              height={50}
              priority
              className="rounded-full"
            />
          ) : (
            <Avatar name={user?.name || 'User'} size="50" round={true} />
          )}
        </div>
        <div className="text-center space-y-2">
          <div className="text-xl font-medium text-black">{user?.name}</div>
          <p className="text-gray-500">{user?.email}</p>
          {user?.phoneNumber && (
            <p className="text-gray-500">{user?.phoneNumber}</p>
          )}
          <p className="text-gray-500">Signed up with: {user?.authProvider}</p>
          {user && user.dateSignedUp && (
            <p className="text-gray-500">
              Joined on: {new Date(user.dateSignedUp).toLocaleDateString()}
            </p>
          )}
          {currentSubscription && (
            <p className="text-gray-500">
              Subscription: {currentSubscription.plan}
            </p>
          )}
          {currentSubscription && (
            <p className="text-gray-500">
              Subscription ends on:{' '}
              {new Date(
                currentSubscription.subscriptionEndDate,
              ).toLocaleDateString()}
            </p>
          )}
          {currentSubscription && (
            <p className="text-gray-500">
              Subscription started on:{' '}
              {new Date(
                currentSubscription.subscriptionStartDate,
              ).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
