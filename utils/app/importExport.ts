import { Conversation } from '@/types/chat';
import {
  ExportFormatV1,
  ExportFormatV2,
  ExportFormatV3,
  ExportFormatV4,
  LatestExportFormat,
  SupportedExportFormats,
} from '@/types/export';
import { FolderInterface } from '@/types/folder';
import { Prompt } from '@/types/prompt';

import { cleanConversationHistory } from './clean';

import { db } from '@/config/firebase';
import { getAuth } from 'firebase/auth';
import { collection, doc, getDocs, query, setDoc } from 'firebase/firestore';

export function isExportFormatV1(obj: any): obj is ExportFormatV1 {
  return Array.isArray(obj);
}

export function isExportFormatV2(obj: any): obj is ExportFormatV2 {
  return !('version' in obj) && 'folders' in obj && 'history' in obj;
}

export function isExportFormatV3(obj: any): obj is ExportFormatV3 {
  return obj.version === 3;
}

export function isExportFormatV4(obj: any): obj is ExportFormatV4 {
  return obj.version === 4;
}

export const isLatestExportFormat = isExportFormatV4;

export function cleanData(data: SupportedExportFormats): LatestExportFormat {
  if (isExportFormatV1(data)) {
    return {
      version: 4,
      history: cleanConversationHistory(data),
      folders: [],
      prompts: [],
    };
  }

  if (isExportFormatV2(data)) {
    return {
      version: 4,
      history: cleanConversationHistory(data.history || []),
      folders: (data.folders || []).map((chatFolder) => ({
        id: chatFolder.id.toString(),
        name: chatFolder.name,
        type: 'chat',
      })),
      prompts: [],
    };
  }

  if (isExportFormatV3(data)) {
    return { ...data, version: 4, prompts: [] };
  }

  if (isExportFormatV4(data)) {
    return data;
  }

  throw new Error('Unsupported data format');
}

function currentDate() {
  const date = new Date();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}-${day}`;
}
const auth = getAuth();
export const exportData = async () => {
  const historyQuery = query(collection(db, 'conversations'));
  const historySnapshot = await getDocs(historyQuery);
  const history = historySnapshot.docs.map((doc) => doc.data());

  const foldersQuery = query(collection(db, 'folders'));
  const foldersSnapshot = await getDocs(foldersQuery);
  const folders = foldersSnapshot.docs.map((doc) => doc.data());

  const promptsQuery = query(collection(db, 'promptsPrivate'));
  const promptsSnapshot = await getDocs(promptsQuery);
  const prompts = promptsSnapshot.docs.map((doc) => doc.data());

  const data = {
    version: 4,
    history,
    folders,
    prompts,
  } as LatestExportFormat;

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = `chatbot_ui_history_${currentDate()}.json`;
  link.href = url;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const importData = async (
  data: SupportedExportFormats,
): Promise<LatestExportFormat> => {
  const { history, folders, prompts } = cleanData(data);

  // Save to Firestore
  for (let conversation of history) {
    conversation.userId = auth.currentUser?.uid;
    conversation.timestamp = Date.now();
    await setDoc(doc(db, 'conversations', conversation.id), conversation);
  }

  for (let folder of folders) {
    folder.userId = auth.currentUser?.uid;
    folder.timestamp = Date.now();
    await setDoc(doc(db, 'folders', folder.id), folder);
  }

  for (let prompt of prompts) {
    prompt.userId = auth.currentUser?.uid;
    prompt.timestamp = Date.now();
    await setDoc(doc(db, 'promptsPrivate', prompt.id), prompt);
  }

  return {
    version: 4,
    history,
    folders,
    prompts,
  };
};
