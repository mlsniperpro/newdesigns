import { useEffect, useState } from 'react';



import { auth, db } from '../config/firebase';



import usePremiumStatus from '@/stripe/usePremiumStatus';
import { collection, getDocs, query, where } from 'firebase/firestore';


function useSubscription (user) {
  const [loading, setLoading] = useState(true);
  const [fairUse, setFairUse] = useState(false); // [1
  const [subscribed, setSubscribed] = useState(false);
  const userIsPremium = usePremiumStatus(user);
  const [limit, setLimit] = useState(0); // [1
  const [wordsgenerated, setWordsGenerated] = useState(0); // [1
  const [paypalEmail, setPaypalEmail] = useState(''); // [1
  const [paypalStatus, setPaypalStatus] = useState(''); // [1
  const [paypalSubscriptionId, setPaypalSubscriptionId] = useState(''); // [1
  const [planId, setPlanId] = useState(''); // [1
  const [name, setName] = useState(''); // [1
  const [lastPayment, setLastPayment] = useState(''); // [1
  const subscriptionDetails = {};
  const plansMapperPayPal = {
    "P-5DY729820D282010XMQNAIRI": "monthly",
    "P-8MS40752A79241224MQNAKFY": "yearly",
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
      setWordsGenerated(currentUserWords.count);
          try{
      if (latestSubscription.subscriptionId) {
        const headers = new Headers();
        headers.append('subscriptionid', latestSubscription.subscriptionId);
        const response = await fetch("https://vionikochat.onrender.com/subscriptionDetails", {
          method: 'GET',
          headers: headers,
          }
        );
        const data = await response.json();
        const paypalEmail = data.subscriber.email_address;
        const paypalStatus = data.status;
        const paypalSubscriptionId = data.id;
        const planId = data.plan_id;
        const name = data.subscriber.name.given_name;
        const lastPayment = data.billing_info.last_payment.time;
        setPaypalEmail(paypalEmail);
        setPaypalStatus(paypalStatus);
        setPaypalSubscriptionId(paypalSubscriptionId);
        setPlanId(planId);
        setName(name);
        setLastPayment(lastPayment);
        }
      } catch (error) {
        console.error('Error retrieving subscription details paypal live: ', error);
      }


      if (
        Date.now() < latestSubscription.subscriptionEndDate ||
        auth.currentUser.uid === 'M8LwxAfm26SimGbDs4LDwf1HuCb2' ||
        userIsPremium ||
        auth.currentUser.uid === 'fcJAePkUVwV7fBR3uiGh5iyt2Tf1'
      ) 
      {
        setSubscribed(true);
      } else if(currentUserWords.count < limit) {
        setFairUse(true);
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
  subscriptionDetails.paypalEmail = paypalEmail;
  subscriptionDetails.paypalStatus = paypalStatus;
  subscriptionDetails.paypalSubscriptionId = paypalSubscriptionId;
  subscriptionDetails.planId = planId;
  subscriptionDetails.name = name;
  subscriptionDetails.wordsGenerated = wordsgenerated;
  subscriptionDetails.limit = limit;
  subscriptionDetails.userIsPremium = userIsPremium;
  subscriptionDetails.subscribed = subscribed;
  subscriptionDetails.lastPayment = lastPayment;
  subscriptionDetails.plan = plansMapperPayPal[planId];
  subscriptionDetails.fairUse = fairUse;
  return {loading, subscriptionDetails};
}

export default useSubscription;