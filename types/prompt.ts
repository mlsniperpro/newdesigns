import { OpenAIModel } from './openai';

export interface Prompt {
  id: string;
  userId?: string;
  timestamp?: number;
  name: string;
  description: string;
  content: string;
  model: OpenAIModel;
  folderId: string | null;
}
