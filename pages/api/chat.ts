import { DEFAULT_SYSTEM_PROMPT, DEFAULT_TEMPERATURE } from '@/utils/app/const';
import { OpenAIError, OpenAIStream } from '@/utils/server';



import { ChatBody, Message } from '@/types/chat';



// @ts-expect-error
import wasm from '../../node_modules/@dqbd/tiktoken/lite/tiktoken_bg.wasm?module';



import { db } from '@/config/firebase';
import tiktokenModel from '@dqbd/tiktoken/encoders/cl100k_base.json';
import { Tiktoken, init } from '@dqbd/tiktoken/lite/init';
import { doc, setDoc } from 'firebase/firestore';
import { addDoc, collection } from 'firebase/firestore';
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
  console.log('Saving chat data to Firestore');
  try {
    // Log the payload to see what's being sent to Firestore
    console.log('Payload to Firestore:', JSON.stringify(payload, null, 2));

    // Check that payload.id is defined and not an empty string
    if (!payload.id || payload.id === '') {
      console.error('Payload ID is not correctly defined:', payload.id);
      return;
    }

    const docRef = doc(db, `chat`, payload.id);

    // Log the document reference to see if it's being constructed correctly
    console.log('Document reference:', JSON.stringify(docRef, null, 2));

    await setDoc(docRef, payload);

    console.log('Document written with ID: ', payload.id);
  } catch (e) {
    console.error('Error adding document: ', e);
  }
}

const handler = async (req: Request): Promise<Response> => {
  try {
    const json = await req.json();
    let { model, messages, key, prompt, temperature } = json as ChatBody;

    console.log('Received model:', model);

    if (!model) {
      console.log('Model not specified. Using default model:', DEFAULT_MODEL);
      model = DEFAULT_MODEL;
    }

    if (model.tokenLimit === undefined) {
      console.log('Token limit not specified');
      return new Response('Token limit not specified', { status: 400 });
    }

    await init((imports) => WebAssembly.instantiate(wasm, imports));
    const encoding = new Tiktoken(
      tiktokenModel.bpe_ranks,
      tiktokenModel.special_tokens,
      tiktokenModel.pat_str,
    );

    let promptToSend = prompt;
    if (!promptToSend) {
      promptToSend = DEFAULT_SYSTEM_PROMPT;
    }

    let temperatureToUse = temperature;
    if (temperatureToUse == null) {
      temperatureToUse = DEFAULT_TEMPERATURE;
    }

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

    const stream = await OpenAIStream(
      model,
      promptToSend,
      temperatureToUse,
      key,
      messagesToSend,
    );

    if (model === DEFAULT_MODEL) {
      console.log('The request received is , ', json);
      const userId = json.userId ?? nanoid();

      // Modify the messagesToSend array
      const modifiedMessages = messagesToSend.map((message, index) => {
        // Check if the index is odd (user message)
        if (index % 2 !== 0) {
          // Extract the actual question from the message
          const questionMatch = message.content.match(
            /Question: (.*)\nContext:/,
          );
          const question = questionMatch ? questionMatch[1] : message.content;

          // Return a new message object with the modified content
          return { ...message, content: question };
        }

        // If the index is even (model message), return the message as is
        return message;
      });

      const title = modifiedMessages[0].content.substring(0, 100);
      const id = json.id ?? nanoid();
      const createdAt = Date.now();
      const path = `/chatpdf/${id}`;
      const payload = {
        id,
        title,
        userId,
        createdAt,
        path,
        messages: modifiedMessages,
      };

      await saveChatData(userId, payload); // make sure to await here*/
    }

    return new Response(stream);
  } catch (error) {
    console.error('Error caught:', error);
    if (error instanceof OpenAIError) {
      return new Response('Error', { status: 500, statusText: error.message });
    } else {
      return new Response('Error', { status: 500 });
    }
  }
};

export default handler;