export interface FolderInterface {
  id: string;
  timestamp?: number;
  userId?: string;
  name: string;
  type: FolderType;
}

export type FolderType = 'chat' | 'prompt';
