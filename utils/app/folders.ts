import { FolderInterface } from '@/types/folder';

import { db } from '@/config/firebase';
import { getAuth } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const auth = getAuth();

export const saveFolders = async (folders: FolderInterface[]) => {
  folders = folders.map((folder) => {
    // Add userId and timestamp
    folder.userId = auth.currentUser?.uid;
    folder.timestamp = Date.now();

    return folder;
  });


  // Save to Firestore
  for (let folder of folders) {
    await setDoc(doc(db, 'folders', folder.id), folder);
  }
};
