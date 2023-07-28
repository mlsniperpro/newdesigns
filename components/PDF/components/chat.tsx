'use client'

import { type Message, useChat } from 'ai/react';
import { toast } from 'react-hot-toast';
import {auth} from "@/config/firebase";

import { ChatList } from './chat-list';
import { ChatPanel } from './chat-panel';
import { ChatScrollAnchor } from './chat-scroll-anchor';
import { EmptyScreen } from './empty-screen';

import { cn } from '../lib/utils';
import { Dialog, DialogContent } from '@radix-ui/react-dialog';

export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[];
  id?: string;
}

export function Chat({ id,initialMessages, className }: ChatProps) {
  let { messages, append, reload, stop, isLoading, input, setInput } =
    useChat({
      initialMessages,
      id,
      body: {
        id,
        userId: auth.currentUser?.uid,
      },
      onResponse(response) {
        if (response.status === 401) {
          toast.error(response.statusText);
        }
      },
    });
  return (
    <>
      <div className={cn('pb-[200px] pt-4 md:pt-10', className)}>
        {messages.length ? (
          <>
            <ChatList messages={messages} />
            <ChatScrollAnchor trackVisibility={isLoading} />
          </>
        ) : (
          <EmptyScreen setInput={setInput} />
        )}
      </div>
      <ChatPanel
        id={id}
        isLoading={isLoading}
        stop={stop}
        append={append}
        reload={reload}
        messages={messages}
        input={input}
        setInput={setInput}
      />
      <Dialog>
        <DialogContent>
        </DialogContent>
      </Dialog>
    </>
  );
}
