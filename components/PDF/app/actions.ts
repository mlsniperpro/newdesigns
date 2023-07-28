 'use client';

//import { revalidatePath } from 'next/cache';
import { useRouter } from 'next/router';



// Get the router instance
import { type Chat } from '../lib/types';



import { auth } from '@/config/firebase';
import { updateDoc } from "firebase/firestore";
import { collection, deleteDoc, doc, getDoc, getDocs, getFirestore, query, setDoc, where } from 'firebase/firestore';





const db = getFirestore();

export async function getChats(userId?: string | null) {
  if (!userId) {
    return [];
  }

  try {
    const q = query(collection(db, 'chats'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);

    const chats = querySnapshot.docs.map((doc) => doc.data());

    return chats as Chat[];
  } catch (error) {
    return [];
  }
}

export async function getChat(id: string, userId: string) {
  const chatDoc = doc(db, 'chats', id);
  const chatSnap = await getDoc(chatDoc);

  if (!chatSnap.exists() || (userId && chatSnap.data().userId !== userId)) {
    return null;
  }

  return chatSnap.data() as Chat | null;
}


export async function removeChat({ id, path }: { id: string; path: string }) {
  const uid = auth.currentUser?.uid;

  if (!uid) {
    return {
      error: 'Unauthorized',
    };
  }

  const chatDoc = doc(db, 'chats', id);
  const chatSnap = await getDoc(chatDoc);

  if (!chatSnap.exists() || chatSnap.data().userId !== uid) {
    return {
      error: 'Unauthorized',
    };
  }

  await deleteDoc(chatDoc);

  //revalidatePath('/');
  window.location.href = '/';
  return 
}
// Clear chats
export async function clearChats() {
 
  const uid = auth.currentUser?.uid;

  if (!uid) {
    return {
      error: 'Unauthorized',
    };
  }

  const q = query(collection(db, 'chats'), where('userId', '==', uid));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    window.location.href = '/';
    return 
  }

  querySnapshot.forEach((doc) => deleteDoc(doc.ref));


  window.location.href = '/';
  return 
}

// Get shared chat
export async function getSharedChat(id: string) {
  const chatRef = doc(db, 'chats', id);
  const chatSnap = await getDoc(chatRef);

  if (!chatSnap.exists() || !chatSnap.data().sharePath) {
    return null;
  }

  return chatSnap.data() as Chat;
}

// Share chat
// Share chat
export async function shareChat(chat: Chat) {
  const uid = auth.currentUser?.uid;

  if (!uid || uid !== chat.userId) {
    return {
      error: 'Unauthorized'
    }
  }

  const payload = {
    ...chat,
    sharePath: `/share/${chat.id}`
  }

  const chatRef = doc(db, 'chats', chat.id);
  await updateDoc(chatRef, payload);

  return payload;
}