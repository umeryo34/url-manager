import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Chip,
  Stack,
} from '@mui/material';
import { getColorFromTag } from '../utils/colors';
import { extractTitleFromUrl } from '../utils/formatters';

interface AddUrlDialogProps {
  open: boolean;
  allTags: string[];
  onClose: () => void;
  onAdd: (url: { title: string; url: string; description: string; tags: string[] }) => void;
}

export const AddUrlDialog: React.FC<AddUrlDialogProps> = ({ open, allTags, onClose, onAdd }) => {
  const [newUrl, setNewUrl] = useState({
    title: '',
    url: '',
    description: '',
    tags: [] as string[],
  });
  const [newTagInput, setNewTagInput] = useState('');

  const handleUrlChange = (url: string) => {
    setNewUrl({ ...newUrl, url });

    // URLが入力されたら自動的にタイトルを抽出
    if (url && !newUrl.title) {
      const extractedTitle = extractTitleFromUrl(url);
      if (extractedTitle) {
        setNewUrl({ ...newUrl, url, title: extractedTitle });
      }
    }
  };

  const handleAddTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !newUrl.tags.includes(trimmedTag)) {
      setNewUrl({ ...newUrl, tags: [...newUrl.tags, trimmedTag] });
      setNewTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setNewUrl({ ...newUrl, tags: newUrl.tags.filter(tag => tag !== tagToRemove) });
  };

  const handleAdd = () => {
    if (newUrl.title && newUrl.url) {
      onAdd(newUrl);
      setNewUrl({ title: '', url: '', description: '', tags: [] });
      setNewTagInput('');
    }
  };

  const handleClose = () => {
    setNewUrl({ title: '', url: '', description: '', tags: [] });
    setNewTagInput('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>新しいURLを追加</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <TextField
            autoFocus
            label="URL"
            fullWidth
            variant="outlined"
            value={newUrl.url}
            onChange={(e) => handleUrlChange(e.target.value)}
            sx={{ mb: 2 }}
            required
            placeholder="https://example.com"
          />
          <TextField
            label="タイトル"
            fullWidth
            variant="outlined"
            value={newUrl.title}
            onChange={(e) => setNewUrl({ ...newUrl, title: e.target.value })}
            sx={{ mb: 2 }}
            required
            helperText="URLから自動入力されます（編集可能）"
          />
          <TextField
            label="説明"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={newUrl.description}
            onChange={(e) => setNewUrl({ ...newUrl, description: e.target.value })}
            sx={{ mb: 2 }}
          />
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              タグ
            </Typography>

            {/* 選択されたタグの表示 */}
            {newUrl.tags.length > 0 && (
              <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {newUrl.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => handleRemoveTag(tag)}
                    sx={{
                      fontWeight: 600,
                      background: getColorFromTag(tag),
                      color: 'white',
                    }}
                  />
                ))}
              </Box>
            )}

            {/* 既存タグの選択 */}
            {allTags.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                  既存のタグから選択
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {allTags
                    .filter(tag => !newUrl.tags.includes(tag))
                    .map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        onClick={() => handleAddTag(tag)}
                        size="small"
                        sx={{
                          cursor: 'pointer',
                          '&:hover': {
                            bgcolor: 'primary.light',
                            color: 'white',
                          },
                        }}
                      />
                    ))}
                </Stack>
              </Box>
            )}

            {/* 新しいタグの入力 */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag(newTagInput);
                  }
                }}
                placeholder="新しいタグを入力"
                helperText="入力して「追加」ボタンを押す、またはEnter"
              />
              <Button
                variant="outlined"
                onClick={() => handleAddTag(newTagInput)}
                disabled={!newTagInput.trim()}
                sx={{
                  minWidth: 80,
                  height: 40,
                }}
              >
                追加
              </Button>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose}>キャンセル</Button>
        <Button variant="contained" onClick={handleAdd} disabled={!newUrl.title || !newUrl.url}>
          追加
        </Button>
      </DialogActions>
    </Dialog>
  );
};

