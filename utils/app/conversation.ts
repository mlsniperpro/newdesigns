import { Conversation } from '@/types/chat';



import { db } from '@/config/firebase';
import { getAuth } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';


const auth = getAuth();

export const updateConversation = (
  updatedConversation: Conversation,
  allConversations: Conversation[],
) => {
  const updatedConversations = allConversations.map((c) => {
    if (c.id === updatedConversation.id) {
      return updatedConversation;
    }

    return c;
  });

  saveConversation(updatedConversation);
  saveConversations(updatedConversations);

  return {
    single: updatedConversation,
    all: updatedConversations,
  };
};

export const saveConversation = async (conversation: Conversation) => {
  // Add userId and timestamp
  conversation.userId = auth.currentUser?.uid;
  conversation.timestamp = Date.now();

  // Save to Firebase
  await setDoc(doc(db, 'conversations', conversation.id), conversation);
};

export const saveConversations = async (conversations: Conversation[]) => {
  conversations = conversations.map((conversation) => {
    // Add userId and timestamp
    conversation.userId = auth.currentUser?.uid;
    conversation.timestamp = Date.now();

    return conversation;
  });
  // Save to Firebase
  for (let conversation of conversations) {
    await setDoc(doc(db, 'conversations', conversation.id), conversation);
  }
};