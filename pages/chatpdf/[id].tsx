import React, { useEffect, useState } from 'react';

import { notFound } from 'next/navigation';
import { useRouter } from 'next/router';

import { getChat } from '@/components/PDF/app/actions';
import { Chat as ChatComponent } from '@/components/PDF/components/chat';
import { Chat } from '@/components/PDF/lib/types';

import { auth } from '@/config/firebase';

export interface Metadata {
  title: string;
}

export const preferredRegion = 'home';

export async function generateMetadata(id: string): Promise<Metadata> {
  const chat = await getChat(id, auth.currentUser?.uid || '');
  return {
    title: chat?.title.toString().slice(0, 50) ?? 'Chat',
  };
}

export default function ChatPage() {
  const router = useRouter();
  const { id } = router.query;
  const [chat, setChat] = useState<Chat | null>(null);

  useEffect(() => {
    async function fetchChat() {
      if (id) {
        const fetchedChat = await getChat(
          id.toString(),
          auth.currentUser?.uid || '',
        );
        setChat(fetchedChat);
      }
    }

    fetchChat();
  }, [id]);

  if (!chat) {
    return <div>Loading...</div>;
  }

  return <ChatComponent id={chat.id} initialMessages={chat.messages} />;
}
