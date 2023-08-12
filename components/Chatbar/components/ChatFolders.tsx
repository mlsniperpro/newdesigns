import { useContext } from 'react';

import { FolderInterface } from '@/types/folder';

import HomeContext from '@/pages/api/home/home.context';

import Folder from '@/components/Folder';

import { ConversationComponent } from './Conversation';

interface Props {
  searchTerm: string;
}

export const ChatFolders = ({ searchTerm }: Props) => {
  const {
    state: { folders, conversations },
    handleUpdateConversation,
  } = useContext(HomeContext);

  const handleDrop = (e: any, folder: FolderInterface) => {
    if (e.dataTransfer) {
      const conversation = JSON.parse(e.dataTransfer.getData('conversation'));
      handleUpdateConversation(conversation, {
        key: 'folderId',
        value: folder.id,
      });
    }
  };

  const ChatFolders = (currentFolder: FolderInterface) => {
    return (
      conversations &&
      conversations
        .filter((conversation) => conversation.folderId === currentFolder.id)
        .filter((conversation) =>
          conversation.name.toLowerCase().includes(searchTerm.toLowerCase()),
        )
        .map((conversation, index) => (
          <div key={index} className="ml-5 gap-2 border-l pl-2">
            <ConversationComponent conversation={conversation} />
          </div>
        ))
    );
  };

  return (
    <div className="flex w-full flex-col pt-2">
      {folders
        .filter((folder) => folder.type === 'chat')
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((folder, index) => {
          const folderConversations = ChatFolders(folder);
          console.log(folder);
          return (
             (
              <Folder
                key={folder.id}
                searchTerm={searchTerm}
                currentFolder={folder}
                handleDrop={handleDrop}
                folderComponent={folderConversations}
              />
              
            )
          );
        })}
    </div>
  );
};
