import { useEffect, useState } from 'react';

import { auth, db } from '../config/firebase';

import usePremiumStatus from '@/stripe/usePremiumStatus';
import { collection, getDocs, query, where } from 'firebase/firestore';

function useSubscription(user) {
  const [loading, setLoading] = useState(true);
  const [subscribed, setSubscribed] = useState(false);
  const userIsPremium = usePremiumStatus(user);
  const [limit, setLimit] = useState(0); // [1

  const retrieveWordLimit = async () => {
    try {
      const limitDoc = await getDocs(collection(db, 'wordlimit'));
      const limit = limitDoc.docs[0]?.data()?.limit;
      if (limit) {
        setLimit(limit);
      }
    } catch (error) {
      console.error('Error retrieving prices: ', error);
    }
  };
  useEffect(() => {
    console.log('The subscription status is ', subscribed);
    console.log("The words limit is ", limit);
  }, [subscribed, limit]);
  const checkSubscription = async () => {

    try {
      const subscribersSnapshot = await getDocs(collection(db, 'subscribers'));
      const subscribers = subscribersSnapshot.docs.map((doc) => doc.data());
      const userSubscriptions = subscribers.filter(
        (subscriber) => subscriber.userId === user.uid,
      );
      const latestSubscription = userSubscriptions.reduce(
        (a, b) => (a.subscriptionEndDate > b.subscriptionEndDate ? a : b),
        {},
      );

      const wordsSnapshot = await getDocs(
        query(
          collection(db, 'wordsgenerated'),
          where('userId', '==', user.uid),
        ),
      );
      const wordsGenerated = wordsSnapshot.docs.map((doc) => doc.data());
      const currentUserWords = wordsGenerated[0] || { count: 0 };
      console.log('The current user words are ', currentUserWords.count)

      if (
        Date.now() < latestSubscription.subscriptionEndDate ||
        currentUserWords.count < limit ||
        userIsPremium ||
        auth.currentUser.uid === 'M8LwxAfm26SimGbDs4LDwf1HuCb2' ||
        auth.currentUser.uid === 'fcJAePkUVwV7fBR3uiGh5iyt2Tf1'
      ) {
        setSubscribed(true);
      } else {
        setSubscribed(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    retrieveWordLimit();
    checkSubscription();
  }, [user, userIsPremium, limit]);

  return { loading, subscribed };
}

export default useSubscription;
