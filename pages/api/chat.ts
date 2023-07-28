import { DEFAULT_SYSTEM_PROMPT, DEFAULT_TEMPERATURE } from '@/utils/app/const';
import { OpenAIError, OpenAIStream } from '@/utils/server';



import { ChatBody, Message } from '@/types/chat';



// @ts-expect-error
import wasm from '../../node_modules/@dqbd/tiktoken/lite/tiktoken_bg.wasm?module';



import tiktokenModel from '@dqbd/tiktoken/encoders/cl100k_base.json';
import { Tiktoken, init } from '@dqbd/tiktoken/lite/init';


export const config = {
  runtime: 'edge',
};

const DEFAULT_MODEL = {
  id: 'gpt-3.5-turbo-16k',
  tokenLimit: 16384, // Assuming the token limit for this model is 16384
  name: 'GPT-3.5 Turbo', // You may need to adjust this based on your model's name
  maxLength: 16384, // Assuming the max length for this model is 16384, adjust as needed
};

const handler = async (req: Request): Promise<Response> => {
  try {
    let { model, messages, key, prompt, temperature } =
      (await req.json()) as ChatBody;

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