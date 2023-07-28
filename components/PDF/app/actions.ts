"use client";

import { Chat } from '../lib/types';



import { auth, db } from '@/config/firebase';
import { collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';


// Replace this with the path to your `Chat` type


export async function getChats(userId?: string | null) {
  if (!userId) {
    return [];
  }

  try {
    const q = query(collection(db, `chat`), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const chats = querySnapshot.docs.map((doc) => doc.data());

    return chats as Chat[];
  } catch (error) {
    return [];
  }
}

export async function getChat(id: string, userId: string) {
  const chatDoc = doc(db, `chat`, id);
  const chatSnap = await getDoc(chatDoc);

  if (!chatSnap.exists() || chatSnap.data().userId !== userId) {
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

  const chatDoc = doc(db, `chat`, id);
  const chatSnap = await getDoc(chatDoc);

  if (!chatSnap.exists() || chatSnap.data().userId !== uid) {
    return {
      error: 'Unauthorized',
    };
  }

  await deleteDoc(chatDoc);

  window.location.href = '/pdf';
}

export async function clearChats() {
  const uid = auth.currentUser?.uid;

  if (!uid) {
    return {
      error: 'Unauthorized',
    };
  }

  const q = query(collection(db, `chat`), where('userId', '==', uid));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    window.location.href = '/pdf';
    return;
  }

  // Create an array to hold all delete promises
  const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));

  // Wait for all delete operations to complete
  await Promise.all(deletePromises);

  window.location.href = '/pdf';
}

export async function getSharedChat(id: string) {
  const chatRef = doc(db, `chat`, id);
  const chatSnap = await getDoc(chatRef);

  if (!chatSnap.exists() || !chatSnap.data().sharePath) {
    return null;
  }

  return chatSnap.data() as Chat;
}

export async function shareChat(chat: Chat) {
  const uid = auth.currentUser?.uid;

  if (!uid || uid !== chat.userId) {
    return {
      error: 'Unauthorized',
    };
  }

  const payload = {
    ...chat,
    sharePath: `/share/${chat.id}`,
  };

  const chatRef = doc(db, `chat`, chat.id);
  await updateDoc(chatRef, payload);

  return payload;
}