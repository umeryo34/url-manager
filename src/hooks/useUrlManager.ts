import { useState, useEffect } from 'react';
import { URLItem, ReadingStatus } from '../types';
import { useLocalStorage } from './useLocalStorage';

export function useUrlManager() {
  const [urls, setUrls, isUrlsLoaded] = useLocalStorage<URLItem[]>('urlManager', []);
  const [allTags, setAllTags, isTagsLoaded] = useLocalStorage<string[]>('urlManagerTags', []);

  // URLからタグを抽出（初回ロード時のみ）
  useEffect(() => {
    if (isUrlsLoaded && isTagsLoaded && allTags.length === 0 && urls.length > 0) {
      const extractedTags = new Set<string>();
      urls.forEach(url => {
        // statusがない場合は'未読'を設定
        if (!url.status) {
          url.status = '未読';
        }
        url.tags.forEach(tag => extractedTags.add(tag));
      });
      const tagsArray = Array.from(extractedTags);
      if (tagsArray.length > 0) {
        setAllTags(tagsArray);
        console.log('URLからタグを抽出しました:', tagsArray.length, '件');
      }
    }
  }, [isUrlsLoaded, isTagsLoaded, urls, allTags.length, setAllTags]);

  const addUrl = (newUrl: Omit<URLItem, 'id' | 'createdAt' | 'status'>) => {
    const urlItem: URLItem = {
      ...newUrl,
      id: Date.now().toString(),
      status: '未読',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      clickCount: 0,
    };
    setUrls([urlItem, ...urls]);

    // 新しいタグをallTagsに追加
    const newTags = newUrl.tags.filter(tag => !allTags.includes(tag));
    if (newTags.length > 0) {
      setAllTags([...allTags, ...newTags]);
    }
  };

  const updateUrl = (updatedUrl: URLItem) => {
    const now = new Date().toISOString();
    setUrls(urls.map(url => (url.id === updatedUrl.id ? { ...updatedUrl, updatedAt: now } : url)));

    // 新しいタグをallTagsに追加
    const newTags = updatedUrl.tags.filter(tag => !allTags.includes(tag));
    if (newTags.length > 0) {
      setAllTags([...allTags, ...newTags]);
    }
  };

  const deleteUrl = (id: string) => {
    setUrls(urls.filter(url => url.id !== id));
  };

  const changeStatus = (id: string, newStatus: ReadingStatus, memo?: string, completedAt?: string) => {
    setUrls(urls.map(url => {
      if (url.id === id) {
        const updated: URLItem = { ...url, status: newStatus, updatedAt: new Date().toISOString() };
        if (newStatus === '完読') {
          updated.completedAt = completedAt || new Date().toISOString();
          if (memo !== undefined) {
            updated.completedMemo = memo;
          }
        } else {
          // 完読以外の状態に戻す場合は、メモと完了日時をクリア
          if (url.status === '完読') {
            updated.completedAt = undefined;
            updated.completedMemo = undefined;
          }
        }
        return updated;
      }
      return url;
    }));
  };

  const toggleFavorite = (id: string) => {
    setUrls(urls.map(url =>
      url.id === id ? { ...url, isFavorite: !url.isFavorite, updatedAt: new Date().toISOString() } : url
    ));
  };

  const deleteTag = (tagToDelete: string) => {
    const urlsWithTag = urls.filter(url => url.tags.includes(tagToDelete));
    if (urlsWithTag.length > 0) {
      const confirm = window.confirm(
        `「${tagToDelete}」タグは${urlsWithTag.length}件のURLで使用されています。\nタグを削除すると、これらのURLからもタグが削除されます。\n本当に削除しますか？`
      );
      if (!confirm) return;

      // URLからタグを削除
      setUrls(
        urls.map(url => ({
          ...url,
          tags: url.tags.filter(tag => tag !== tagToDelete),
          updatedAt: url.tags.includes(tagToDelete) ? new Date().toISOString() : url.updatedAt,
        }))
      );
    }

    // allTagsからタグを削除
    setAllTags(allTags.filter(tag => tag !== tagToDelete));
  };

  const incrementClickCount = (id: string) => {
    setUrls(urls.map(url => url.id === id ? { ...url, clickCount: (url.clickCount || 0) + 1, updatedAt: new Date().toISOString() } : url));
  };

  return {
    urls,
    allTags,
    addUrl,
    updateUrl,
    deleteUrl,
    changeStatus,
    deleteTag,
    toggleFavorite,
    incrementClickCount,
  };
}

