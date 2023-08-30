import { useEffect, useState } from 'react';



import { auth, db } from '../config/firebase';



import usePremiumStatus from '@/stripe/usePremiumStatus';
import { collection, getDocs, query, where } from 'firebase/firestore';


function useSubscription(user) {
  const [loading, setLoading] = useState(true);
  const [fairUse, setFairUse] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const userIsPremium = usePremiumStatus(user);
  const [limit, setLimit] = useState(0);
  const [wordsgenerated, setWordsGenerated] = useState(0);
  const [paypalEmail, setPaypalEmail] = useState('');
  const [paypalStatus, setPaypalStatus] = useState('');
  const [paypalSubscriptionId, setPaypalSubscriptionId] = useState('');
  const [planId, setPlanId] = useState('');
  const [name, setName] = useState('');
  const [lastPayment, setLastPayment] = useState('');

  const plansMapperPayPal = {
    'P-5DY729820D282010XMQNAIRI': 'monthly',
    'P-8MS40752A79241224MQNAKFY': 'yearly',
  };

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

  const checkSubscription = async () => {
    console.log('Checking subscription');
    console.log("The userId is at checksubscription",user?.uid)
    try {
      const userSubscriptionQuery = query(
        collection(db, 'subscribers'),
        where('userId', '==', user.uid),
      );
      const subscribersSnapshot = await getDocs(userSubscriptionQuery);
      const userSubscriptions = subscribersSnapshot.docs.map((doc) =>
        doc.data(),
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
      setWordsGenerated(currentUserWords.count);

      if (latestSubscription.subscriptionId) {
        const headers = new Headers();
        headers.append('subscriptionid', latestSubscription.subscriptionId);
        console.log("the latest subscription id being passed is ",latestSubscription.subscriptionId)
        const response = await fetch(
          'https://vionikochat.onrender.com/subscriptionDetails',
          {
            method: 'GET',
            headers: headers,
          },
        );
        const data = await response.json();
        setPaypalEmail(data.subscriber.email_address);
        setPaypalStatus(data.status);
        setPaypalSubscriptionId(data.id);
        setPlanId(data.plan_id);
        setName(data.subscriber.name.given_name);
        setLastPayment(data.billing_info.last_payment.time);
      }

      if (
        Date.now() < latestSubscription.subscriptionEndDate ||
        auth.currentUser.uid === 'M8LwxAfm26SimGbDs4LDwf1HuCb2' ||
        userIsPremium ||
        auth.currentUser.uid === 'fcJAePkUVwV7fBR3uiGh5iyt2Tf1'
      ) {
        setSubscribed(true);
      } else if (wordsgenerated < limit) {
        setFairUse(true);
      } else {
        setSubscribed(false);
      }
    } catch (error) {
      console.error('Error in checkSubscription: ', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      retrieveWordLimit();
      checkSubscription();
    }
  }, [user]);

  const subscriptionDetails = {
    paypalEmail,
    paypalStatus,
    paypalSubscriptionId,
    planId: planId,
    name,
    wordsgenerated,
    limit,
    userIsPremium,
    subscribed,
    lastPayment,
    plan: plansMapperPayPal[planId],
    fairUse,
  };

  return { loading, subscriptionDetails };
}

export default useSubscription;