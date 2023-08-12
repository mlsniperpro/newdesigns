import { FolderInterface } from '@/types/folder';

import { db } from '@/config/firebase';
import { getAuth } from 'firebase/auth';
import { doc, writeBatch } from 'firebase/firestore';

const auth = getAuth();

export const saveFolders = async (folders: FolderInterface[]) => {
  if (!Array.isArray(folders)) {
    throw new Error('Folders must be an array');
  }

  const userId = auth.currentUser?.uid;
  const timestamp = Date.now();

  const batch = writeBatch(db);
  console.log("Now creating the new folders")
  folders.forEach((folder) => {
    // Add userId and timestamp
    console.log('folder', folder);
    folder.userId = userId;
    folder.timestamp = timestamp;

    // Add to batch
    const folderRef = doc(db, 'folders', folder.id);
    batch.set(folderRef, folder);
  });

  try {
    await batch.commit();
  } catch (error) {
    console.error('Error saving folders:', error);
    throw error; // or handle the error as needed
  }
};
