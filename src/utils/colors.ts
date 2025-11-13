import { gradients } from '../constants/gradients';
import { URLItem, ReadingStatus } from '../types';

// タグ名から一意の色を生成
export const getColorFromTag = (tag: string): string => {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
};

// URLのタグから色を決定（最初のタグを使用、なければデフォルト）
export const getCardGradient = (urlItem: URLItem): string => {
  if (urlItem.tags.length > 0) {
    return getColorFromTag(urlItem.tags[0]);
  }
  return gradients[0]; // デフォルトの色
};

// ステータスの色を取得
export const getStatusColor = (status: ReadingStatus): string => {
  switch (status) {
    case '未読':
      return '#9e9e9e';
    case '読書中':
      return '#ff9800';
    case '完読':
      return '#4caf50';
  }
};

