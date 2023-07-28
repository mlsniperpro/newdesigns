import { notFound, redirect } from 'next/navigation';

import { getChat } from '@/components/PDF/app/actions';
import { Chat } from '@/components/PDF/components/chat';

import { auth } from '@/config/firebase';

export interface Metadata {
  title: string;
  // other fields...
}

export const preferredRegion = 'home';

export interface ChatPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: ChatPageProps): Promise<Metadata> {
  const chat = await getChat(params.id, auth.currentUser?.uid || '');
  return {
    title: chat?.title.toString().slice(0, 50) ?? 'Chat',
  };
}

export default async function ChatPage({ params }: ChatPageProps) {
  const chat = await getChat(params.id, auth.currentUser?.uid || '');

  if (!chat) {
    notFound();
  }

  if (chat?.userId !== auth.currentUser?.uid) {
    notFound();
  }

  return <Chat id={chat.id} initialMessages={chat.messages} />;
}
