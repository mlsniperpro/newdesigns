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