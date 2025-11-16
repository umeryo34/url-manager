export type ReadingStatus = '未読' | '読書中' | '完読';

export interface URLItem {
  id: string;
  title: string;
  url: string;
  description: string;
  tags: string[];
  status: ReadingStatus;
  createdAt: string;
  updatedAt?: string; // 最終更新日時
  completedAt?: string; // 完読日時
  completedMemo?: string; // 完読時のメモ
  isFavorite?: boolean; // お気に入りフラグ
  clickCount?: number; // クリック回数
}

