import { Prompt } from '@/types/prompt';

import { db } from '@/config/firebase';
import { getAuth } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const auth = getAuth();

export const updatePrompt = (updatedPrompt: Prompt, allPrompts: Prompt[]) => {
  const updatedPrompts = allPrompts.map((c) => {
    if (c.id === updatedPrompt.id) {
      return updatedPrompt;
    }

    return c;
  });

  savePrompts(updatedPrompts);

  return {
    single: updatedPrompt,
    all: updatedPrompts,
  };
};

export const savePrompts = async (prompts: Prompt[]) => {
  prompts = prompts.map((prompt) => {
    // Add userId and timestamp
    prompt.userId = auth.currentUser?.uid;
    prompt.timestamp = Date.now();

    return prompt;
  });

  // Save to Firestore
  for (let prompt of prompts) {
    await setDoc(doc(db, 'promptsPrivate', prompt.id), prompt);
  }
};
