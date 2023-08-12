import { useEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { deleteDoc } from 'firebase/firestore';

import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';

import { useCreateReducer } from '@/hooks/useCreateReducer';

import useErrorService from '@/services/errorService';
import useApiService from '@/services/useApiService';

import {
  cleanConversationHistory,
  cleanSelectedConversation,
} from '@/utils/app/clean';
import { DEFAULT_SYSTEM_PROMPT, DEFAULT_TEMPERATURE } from '@/utils/app/const';
import {
  saveConversation,
  saveConversations,
  updateConversation,
} from '@/utils/app/conversation';
import { saveFolders } from '@/utils/app/folders';
import { savePrompts } from '@/utils/app/prompts';
import { getSettings } from '@/utils/app/settings';

import { Conversation } from '@/types/chat';
import { KeyValuePair } from '@/types/data';
import { FolderInterface, FolderType } from '@/types/folder';
import { OpenAIModelID, OpenAIModels, fallbackModelID } from '@/types/openai';
import { Prompt } from '@/types/prompt';

import { Chat } from '@/components/Chat/Chat';
import { Chatbar } from '@/components/Chatbar/Chatbar';
import { Navbar } from '@/components/Mobile/Navbar';
import Promptbar from '@/components/Promptbar';

import HomeContext from './home.context';
import { HomeInitialState, initialState } from './home.state';

import { auth, db } from '@/config/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  serverSideApiKeyIsSet: boolean;
  serverSidePluginKeysSet: boolean;
  defaultModelId: OpenAIModelID;
}

const Home = ({
  serverSideApiKeyIsSet,
  serverSidePluginKeysSet,
  defaultModelId,
}: Props) => {
  const { t } = useTranslation('chat');
  const { getModels } = useApiService();
  const { getModelsError } = useErrorService();
  const [initialRender, setInitialRender] = useState<boolean>(true);

  const contextValue = useCreateReducer<HomeInitialState>({
    initialState,
  });

  const {
    state: {
      apiKey,
      lightMode,
      folders,
      conversations,
      selectedConversation,
      prompts,
      temperature,
    },
    dispatch,
  } = contextValue;

  const stopConversationRef = useRef<boolean>(false);

  const { data, error, refetch } = useQuery(
    ['GetModels', apiKey, serverSideApiKeyIsSet],
    ({ signal }) => {
      if (!apiKey && !serverSideApiKeyIsSet) return null;

      return getModels(
        {
          key: apiKey,
        },
        signal,
      );
    },
    { enabled: true, refetchOnMount: false },
  );

  useEffect(() => {
    if (data) dispatch({ field: 'models', value: data });
  }, [data, dispatch]);

  useEffect(() => {
    dispatch({ field: 'modelError', value: getModelsError(error) });
  }, [dispatch, error, getModelsError]);

  // FETCH MODELS ----------------------------------------------

  const handleSelectConversation = (conversation: Conversation) => {
    dispatch({
      field: 'selectedConversation',
      value: conversation,
    });

    saveConversation(conversation);
  };

  // FOLDER OPERATIONS  --------------------------------------------

  const handleCreateFolder = (name: string, type: FolderType) => {
    const newFolder: FolderInterface = {
      id: uuidv4(),
      name,
      type,
    };

    const updatedFolders = [...folders, newFolder];
    console.log("The create folder is clicked")
    dispatch({ field: 'folders', value: updatedFolders });
    saveFolders(updatedFolders);
  };

 

const handleDeleteFolder = async (folderId: string) => {
  const updatedFolders = folders.filter((f) => f.id !== folderId);
  dispatch({ field: 'folders', value: updatedFolders });
  saveFolders(updatedFolders);
  console.log("The Id of the folder deleted is: " + folderId)

  const updatedConversations: Conversation[] = conversations.map((c) => {
    if (c.folderId === folderId) {
      return {
        ...c,
        folderId: null,
      };
    }

    return c;
  });

  dispatch({ field: 'conversations', value: updatedConversations });
  saveConversations(updatedConversations);

  const updatedPrompts: Prompt[] = prompts.map((p) => {
    if (p.folderId === folderId) {
      return {
        ...p,
        folderId: null,
      };
    }

    return p;
  });

  dispatch({ field: 'prompts', value: updatedPrompts });
  savePrompts(updatedPrompts);

  // Get a document reference
  const docRef = doc(db, "folders", folderId);

  // Delete the document
  await deleteDoc(docRef);
};

  const handleUpdateFolder = (folderId: string, name: string) => {
    const updatedFolders = folders.map((f) => {
      if (f.id === folderId) {
        return {
          ...f,
          name,
        };
      }

      return f;
    });

    dispatch({ field: 'folders', value: updatedFolders });

    saveFolders(updatedFolders);
  };

  // CONVERSATION OPERATIONS  --------------------------------------------

  const handleNewConversation = () => {
    const lastConversation = conversations[conversations.length - 1];

    const newConversation: Conversation = {
      id: uuidv4(),
      name: t('New Conversation'),
      messages: [],
      model: lastConversation?.model || {
        id: OpenAIModels[defaultModelId].id,
        name: OpenAIModels[defaultModelId].name,
        maxLength: OpenAIModels[defaultModelId].maxLength,
        tokenLimit: OpenAIModels[defaultModelId].tokenLimit,
      },
      prompt: DEFAULT_SYSTEM_PROMPT,
      temperature: lastConversation?.temperature ?? DEFAULT_TEMPERATURE,
      folderId: null,
    };

    const updatedConversations = [...conversations, newConversation];

    dispatch({ field: 'selectedConversation', value: newConversation });
    dispatch({ field: 'conversations', value: updatedConversations });

    saveConversation(newConversation);
    saveConversations(updatedConversations);

    dispatch({ field: 'loading', value: false });
  };

  const handleUpdateConversation = (
    conversation: Conversation,
    data: KeyValuePair,
  ) => {
    const updatedConversation = {
      ...conversation,
      [data.key]: data.value,
    };

    const { single, all } = updateConversation(
      updatedConversation,
      conversations,
    );

    dispatch({ field: 'selectedConversation', value: single });
    dispatch({ field: 'conversations', value: all });
  };

  // EFFECTS  --------------------------------------------

  useEffect(() => {
    if (window.innerWidth < 640) {
      dispatch({ field: 'showChatbar', value: false });
    }
  }, [selectedConversation]);

  useEffect(() => {
    defaultModelId &&
      dispatch({ field: 'defaultModelId', value: defaultModelId });
    serverSideApiKeyIsSet &&
      dispatch({
        field: 'serverSideApiKeyIsSet',
        value: serverSideApiKeyIsSet,
      });
    serverSidePluginKeysSet &&
      dispatch({
        field: 'serverSidePluginKeysSet',
        value: serverSidePluginKeysSet,
      });
  }, [defaultModelId, serverSideApiKeyIsSet, serverSidePluginKeysSet]);

  // ON LOAD --------------------------------------------

  useEffect(() => {
    const settings = getSettings();
    if (settings.theme) {
      dispatch({
        field: 'lightMode',
        value: settings.theme,
      });
    }

    const apiKey = localStorage.getItem('apiKey');

    if (serverSideApiKeyIsSet) {
      dispatch({ field: 'apiKey', value: '' });

      localStorage.removeItem('apiKey');
    } else if (apiKey) {
      dispatch({ field: 'apiKey', value: apiKey });
    }

    const pluginKeys = localStorage.getItem('pluginKeys');
    if (serverSidePluginKeysSet) {
      dispatch({ field: 'pluginKeys', value: [] });
      localStorage.removeItem('pluginKeys');
    } else if (pluginKeys) {
      dispatch({ field: 'pluginKeys', value: pluginKeys });
    }

    if (window.innerWidth < 640) {
      dispatch({ field: 'showChatbar', value: false });
      dispatch({ field: 'showPromptbar', value: false });
    }

    const showChatbar = localStorage.getItem('showChatbar');
    if (showChatbar) {
      dispatch({ field: 'showChatbar', value: showChatbar === 'true' });
    }

    const showPromptbar = localStorage.getItem('showPromptbar');
    if (showPromptbar) {
      dispatch({ field: 'showPromptbar', value: showPromptbar === 'true' });
    }

    const getFolders = async () => {
      const foldersQuery = query(
        collection(db, 'folders'),
        where('userId', '==', auth.currentUser?.uid),
      );
      const foldersSnapshot = await getDocs(foldersQuery);
      const folders = foldersSnapshot.docs.map((doc) => doc.data());
      return folders;
    };

    // Usage
    getFolders().then((folders) => {
      if (folders) {
        dispatch({ field: 'folders', value: folders });
      }
    });

    async function fetchPrompts(userId: string | undefined) {
      const promptsRef = collection(db, 'promptsPrivate');
      const q = query(promptsRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      const prompts = querySnapshot.docs.map((doc) => doc.data());
      return prompts;
    }

    // Usage
    const userId = auth.currentUser?.uid; // Replace with actual user ID
    fetchPrompts(userId)
      .then((prompts) => {
        dispatch({ field: 'prompts', value: prompts });
      })
      .catch(console.error);

    const fetchConversationHistory = async () => {
      if (!userId) {
        console.log('No user ID!');
        return;
      }

      const conversationHistoryRef = collection(db, 'conversations');
      const q = query(conversationHistoryRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      const conversationHistory = querySnapshot.docs.map((doc) => doc.data());

      if (conversationHistory) {
        const cleanedConversationHistory =
          cleanConversationHistory(conversationHistory);
        dispatch({ field: 'conversations', value: cleanedConversationHistory });
      }
    };

    fetchConversationHistory().catch(console.error);

    const fetchSelectedConversation = async (userId: string | undefined) => {
      const selectedConversationRef = collection(db, 'selectedConversation');
      const q = query(selectedConversationRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      const selectedConversations = querySnapshot.docs.map((doc) => doc.data());

      if (selectedConversations.length > 0) {
        // Assuming each user only has one selected conversation,
        // take the first one from the array.
        return selectedConversations[0];
      } else {
        console.log('No selected conversation for this user!');
        return null;
      }
    };

    fetchSelectedConversation(userId)
      .then((selectedConversationData) => {
        if (selectedConversationData) {
          const selectedConversation = selectedConversationData as Conversation;
          const cleanedSelectedConversation =
            cleanSelectedConversation(selectedConversation);
          dispatch({
            field: 'selectedConversation',
            value: cleanedSelectedConversation,
          });
        } else {
          const lastConversation = conversations[conversations.length - 1];
          dispatch({
            field: 'selectedConversation',
            value: {
              id: uuidv4(),
              name: t('New Conversation'),
              messages: [],
              model: OpenAIModels[defaultModelId],
              prompt: DEFAULT_SYSTEM_PROMPT,
              temperature: lastConversation?.temperature ?? DEFAULT_TEMPERATURE,
              folderId: null,
            },
          });
        }
      })
      .catch(console.error);
  }, [
    defaultModelId,
    dispatch,
    serverSideApiKeyIsSet,
    serverSidePluginKeysSet,
  ]);

  return (
    <HomeContext.Provider
      value={{
        ...contextValue,
        handleNewConversation,
        handleCreateFolder,
        handleDeleteFolder,
        handleUpdateFolder,
        handleSelectConversation,
        handleUpdateConversation,
      }}
    >
      <Head>
        <title>Vioniko AI</title>
        <meta name="description" content="ChatGPT but better." />
        <meta
          name="viewport"
          content="height=device-height ,width=device-width, initial-scale=1, user-scalable=no"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {selectedConversation && (
        <main
          className={`flex h-screen w-screen flex-col text-sm text-white dark:text-white ${lightMode}`}
        >
          <div className="fixed top-0 w-full sm:hidden">
            <Navbar
              selectedConversation={selectedConversation}
              onNewConversation={handleNewConversation}
            />
          </div>

          <div className="flex h-full w-full pt-[48px] sm:pt-0">
            <Chatbar />

            <div className="flex flex-1">
              <Chat stopConversationRef={stopConversationRef} />
            </div>

            <Promptbar />
          </div>
        </main>
      )}
    </HomeContext.Provider>
  );
};
export default Home;

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const defaultModelId =
    (process.env.DEFAULT_MODEL &&
      Object.values(OpenAIModelID).includes(
        process.env.DEFAULT_MODEL as OpenAIModelID,
      ) &&
      process.env.DEFAULT_MODEL) ||
    fallbackModelID;

  let serverSidePluginKeysSet = false;

  const googleApiKey = process.env.GOOGLE_API_KEY;
  const googleCSEId = process.env.GOOGLE_CSE_ID;

  if (googleApiKey && googleCSEId) {
    serverSidePluginKeysSet = true;
  }

  return {
    props: {
      serverSideApiKeyIsSet: !!process.env.NEXT_PUBLIC_API_KEY,
      defaultModelId,
      serverSidePluginKeysSet,
      ...(await serverSideTranslations(locale ?? 'en', [
        'common',
        'chat',
        'sidebar',
        'markdown',
        'promptbar',
        'settings',
      ])),
    },
  };
};
