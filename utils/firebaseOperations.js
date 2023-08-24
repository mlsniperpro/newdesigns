import { auth, db, googleProvider } from '../config/firebase';



import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';


export const signInUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password,
  );
  return userCredential.user;
};

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
};

export const checkIfUserDisabled = async (user, router) => {
  const disabledQuery = query(
    collection(db, 'deactivatedUsers'),
    where('userId', '==', user.uid),
  );
  const disabledDocs = await getDocs(disabledQuery);
  if (disabledDocs.empty) {
    
    router.push({
      pathname: '/chat',
      query: { userId: user.uid },
    });
  } else {
    alert('You have been disabled from using Vioniko');
    throw new Error('User Disabled from using Vioniko');
  }
};

const retrieveUsers = async () => {
    const usersQuerySnapshot = await getDocs(collection(db, 'users'));
    const usersData = usersQuerySnapshot.docs
      .map((doc) => doc.data())
      .filter((user) => user.name && user.name.trim() !== '');
    return usersData;
  };
  //Fetch stripe subscriptions
  const retrieveStripeSubs = async () => {
    const userIds = (
      await Promise.all(
        (
          await getDocs(collection(db, 'users'))
        ).docs
          .map((doc) => doc.data().userId)
          .filter(Boolean)
          .map(async (id) =>
            (
              await getDocs(
                query(
                  collection(db, 'users', id, 'subscriptions'),
                  where('status', 'in', ['trialing', 'active']),
                ),
              )
            ).docs.length > 0
              ? id
              : null,
          ),
      )
    ).filter(Boolean);

    const subscriptionsRefs = userIds.map((id) =>
      query(
        collection(db, 'users', id, 'subscriptions'),
        where('status', 'in', ['trialing', 'active']),
      ),
    );

    const stripeProducts = {
      prod_Njtrgy9W8UwGW7: 'Monthly',
      prod_NjtvxM9XlsH2c6: 'Yearly',
    };

    const subscriptionsData = Object.fromEntries(
      await Promise.all(
        subscriptionsRefs.map(async (q, index) => {
          const snap = await getDocs(q);
          const productID = snap.docs.map(
            (doc) => doc.data().items[0]['plan']['product'],
          );
          return [userIds[index], stripeProducts[productID]];
        }),
      ),
    );
    setSubscribers((prevSubscribers) => ({
      ...prevSubscribers,
      ...subscriptionsData,
    }));
  };
  //Fetch paypal subscriptions
  const retrievePaypalSubs = async () => {
    const subsData = (
      await getDocs(
        query(
          collection(db, 'subscribers'),
          where('subscriptionEndDate', '>', Date.now()),
        ),
      )
    ).docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    setSubscribers((prevSubscribers) => {
      let newSubscribers = { ...prevSubscribers };
      subsData.forEach((sub) => {
        newSubscribers[sub.userId] = sub.plan || sub.subscriptionPlan;
      });
      return newSubscribers;
    });
  };
  // Function to retrieve words generated
  const fetchWordsGenerated = async () => {
    const wordsSnap = await getDocs(collection(db, 'wordsgenerated'));
    const wordsData = wordsSnap.docs.map((doc) => doc.data());
    setWordsgen(
      Object.fromEntries(wordsData.map((word) => [word.userId, word.count])),
    );
  };