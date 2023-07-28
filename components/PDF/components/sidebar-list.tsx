import React, { useEffect, useState } from 'react';

import {Chat} from '../lib/types';
import { SidebarActions } from '../components/sidebar-actions';
import { SidebarItem } from '../components/sidebar-item';

import { getChats, removeChat, shareChat } from '../app/actions';

export interface SidebarListProps {
  userId?: string;
}

export function SidebarList({ userId }: SidebarListProps) {
  const [chats, setChats] = useState<Chat[] | null>(null);

  useEffect(() => {
    const fetchChats = async () => {
      if (userId) {
        const chatsData = await getChats(userId);
        setChats(chatsData);
      }
    };

    fetchChats();
  }, [userId]);

  if (!chats) {
    return null; // or a loading spinner, etc.
  }

  return (
    <div className="flex-1 overflow-auto">
      {chats.length ? (
        <div className="space-y-2 px-2">
          {chats.map(
            (chat) =>
              chat && (
                <SidebarItem key={chat.id} chat={chat}>
                  <SidebarActions
                    chat={chat}
                    removeChat={removeChat}
                    shareChat={shareChat}
                  />
                </SidebarItem>
              ),
          )}
        </div>
      ) : (
        <div className="p-8 text-center">
          <p className="text-sm text-muted-foreground">No chat history</p>
        </div>
      )}
    </div>
  );
}
