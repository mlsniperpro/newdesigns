import updateUserWordCount from '@/utils/updateWordCount';
import { DEFAULT_SYSTEM_PROMPT, DEFAULT_TEMPERATURE } from '@/utils/app/const';
import { OpenAIError, OpenAIStream } from '@/utils/server';
import { contextRetriever } from '@/utils/similarDocs';



import { ChatBody, Message } from '@/types/chat';



// @ts-expect-error
import wasm from '../../node_modules/@dqbd/tiktoken/lite/tiktoken_bg.wasm?module';



import { db } from '@/config/firebase';
import tiktokenModel from '@dqbd/tiktoken/encoders/cl100k_base.json';
import { Tiktoken, init } from '@dqbd/tiktoken/lite/init';
import { doc, setDoc } from 'firebase/firestore';
import { nanoid } from 'nanoid';


export const config = {
  runtime: 'edge',
};

const DEFAULT_MODEL = {
  id: 'gpt-3.5-turbo-16k',
  tokenLimit: 16384,
  name: 'GPT-3.5 Turbo',
  maxLength: 16384,
};

// Save chat data function
async function saveChatData(userId: string, payload: any) {
  try {
    const docRef = doc(db, `chat`, payload.id);
    console.log("the document is id is", payload.id)
    await setDoc(docRef, payload);
  } catch (e) {
    console.error('Error adding document: ', e);
  }
}

const handler = async (req: Request): Promise<Response> => {
  try {
    const json = await req.json();
    let { model, messages, key, prompt, temperature } = json as ChatBody;

    if (!model) {
      model = DEFAULT_MODEL;
    }

    if (model.tokenLimit === undefined) {
      return new Response('Token limit not specified', { status: 400 });
    }

    await init((imports) => WebAssembly.instantiate(wasm, imports));
    const encoding = new Tiktoken(
      tiktokenModel.bpe_ranks,
      tiktokenModel.special_tokens,
      tiktokenModel.pat_str,
    );
    let promptToSend = prompt || DEFAULT_SYSTEM_PROMPT;

    let temperatureToUse = temperature || DEFAULT_TEMPERATURE;

    const prompt_tokens = encoding.encode(promptToSend);
    let tokenCount = prompt_tokens.length;
    let messagesToSend: Message[] = [];

    for (let i = messages.length - 1; i >= 0; i--) {
      const message = messages[i];
      const tokens = encoding.encode(message.content);

      if (tokenCount + tokens.length + 1000 > model.tokenLimit) {
        break;
      }
      tokenCount += tokens.length;
      messagesToSend = [message, ...messagesToSend];
    }

    encoding.free();
    if (json.data) {
      const context = await contextRetriever(
        json.data,
        messagesToSend[messagesToSend.length - 1].content,
      );
      messagesToSend[messagesToSend.length - 1].content = `
  Here is the user question:
  Question: ${messages[messages.length - 1].content}
  Search for relevant information in the context below and use it to answer user questions exhaustively and deeply using numbered list and thorough analysis.
  If the context does not provide relevant answer to the question, mention that PDF provided is not relevant to question and try to relate the question to the context.
  Context: ${context}
  `;
      messagesToSend[messagesToSend.length - 1].content = messagesToSend[
        messagesToSend.length - 1
      ].content;
      updateUserWordCount(messagesToSend[messagesToSend.length - 1].content, json.userId);
      messagesToSend[messagesToSend.length - 1].role = 'system';
    };

    const stream = await OpenAIStream(
      model,
      promptToSend,
      temperatureToUse,
      key,
      messagesToSend,
    );

    if (model === DEFAULT_MODEL) {
      const userId = json.userId ?? nanoid();
      const modifiedMessages = messagesToSend.map((message) => ({
        ...message,
        content:
          (message.content.match(/Question: ([^\n]*)(\nContext:[^\n]*\n)?/) ||
            [])[1] || message.content,
      }));

      const title = modifiedMessages[0].content.substring(0, 100);
      const id = json.id ?? "Hello, this is the invalid id";
      const createdAt = Date.now();
      const payload = {
        id,
        title,
        userId,
        createdAt,
        messages: modifiedMessages,
      };

      await saveChatData(userId, payload);
    }

    return new Response(stream);
  } catch (error) {
    if (error instanceof OpenAIError) {
      return new Response('Error', { status: 500, statusText: error.message });
    } else {
      return new Response('Error', { status: 500 });
    }
  }
};

export default handler;