import { auth, db } from '../config/firebase';

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';

const updateUserWordCount = async (data) => {
  // Assuming data is passed as an argument
  console.log('The data is as passed to wordcount updator: ', data);
  try {
    console.log('Now testing the new function');
    const userDocRef = doc(db, 'wordsgenerated', auth.currentUser.uid);
    console.log('The userDocRef is: ', userDocRef);
    const userDocSnapshot = await getDoc(userDocRef);
    console.log('The userDocSnapshot is: ', userDocSnapshot);

    if (userDocSnapshot.exists()) {
        console.log("")
      await updateDoc(userDocRef, {
        count:
          userDocSnapshot.data().count + data.choices[0].message.content.length,
      });
    } else {
      await setDoc(userDocRef, {
        userId: auth.currentUser.uid,
        count: data.choices[0].message.content.length,
      });
    }
  } catch (error) {
    console.log('Error updating user word count:', error);
  }
};

export default updateUserWordCount;
