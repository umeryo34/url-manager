export type ReadingStatus = '未読' | '読書中' | '完読';

export interface URLItem {
  id: string;
  title: string;
  url: string;
  description: string;
  tags: string[];
  status: ReadingStatus;
  createdAt: string;
}

