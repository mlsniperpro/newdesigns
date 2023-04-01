// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBHNQ1InFyZV0PP8uv1csggTF9D_Txj4bc",
  authDomain: "pedrofirabse.firebaseapp.com",
  projectId: "pedrofirabse",
  storageBucket: "pedrofirabse.appspot.com",
  messagingSenderId: "608372539725",
  appId: "1:608372539725:web:1fe867ff2c02eb6ecb7704",
  measurementId: "G-Y0GS820KV1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;