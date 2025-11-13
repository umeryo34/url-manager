import React, { useState, useEffect } from 'react';
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
import { URLItem } from '../types';
import { getColorFromTag } from '../utils/colors';

interface EditUrlDialogProps {
  open: boolean;
  urlItem: URLItem | null;
  allTags: string[];
  onClose: () => void;
  onUpdate: (urlItem: URLItem) => void;
}

export const EditUrlDialog: React.FC<EditUrlDialogProps> = ({
  open,
  urlItem,
  allTags,
  onClose,
  onUpdate,
}) => {
  const [editingUrl, setEditingUrl] = useState<URLItem | null>(null);
  const [editTagInput, setEditTagInput] = useState('');

  useEffect(() => {
    if (urlItem) {
      setEditingUrl(urlItem);
    }
  }, [urlItem]);

  const handleAddEditTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && editingUrl && !editingUrl.tags.includes(trimmedTag)) {
      setEditingUrl({ ...editingUrl, tags: [...editingUrl.tags, trimmedTag] });
      setEditTagInput('');
    }
  };

  const handleRemoveEditTag = (tagToRemove: string) => {
    if (editingUrl) {
      setEditingUrl({ ...editingUrl, tags: editingUrl.tags.filter(tag => tag !== tagToRemove) });
    }
  };

  const handleUpdate = () => {
    if (editingUrl) {
      onUpdate(editingUrl);
      setEditTagInput('');
    }
  };

  const handleClose = () => {
    setEditingUrl(null);
    setEditTagInput('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>URLを編集</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <TextField
            autoFocus
            label="タイトル"
            fullWidth
            variant="outlined"
            value={editingUrl?.title || ''}
            onChange={(e) => editingUrl && setEditingUrl({ ...editingUrl, title: e.target.value })}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            label="URL"
            fullWidth
            variant="outlined"
            value={editingUrl?.url || ''}
            onChange={(e) => editingUrl && setEditingUrl({ ...editingUrl, url: e.target.value })}
            sx={{ mb: 2 }}
            required
            disabled
            helperText="URLは変更できません"
          />
          <TextField
            label="説明"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={editingUrl?.description || ''}
            onChange={(e) =>
              editingUrl && setEditingUrl({ ...editingUrl, description: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              タグ
            </Typography>

            {/* 選択されたタグの表示 */}
            {editingUrl && editingUrl.tags.length > 0 && (
              <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {editingUrl.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => handleRemoveEditTag(tag)}
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
                    .filter(tag => !editingUrl?.tags.includes(tag))
                    .map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        onClick={() => handleAddEditTag(tag)}
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
                value={editTagInput}
                onChange={(e) => setEditTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddEditTag(editTagInput);
                  }
                }}
                placeholder="新しいタグを入力"
                helperText="入力して「追加」ボタンを押す、またはEnter"
              />
              <Button
                variant="outlined"
                onClick={() => handleAddEditTag(editTagInput)}
                disabled={!editTagInput.trim()}
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
        <Button variant="contained" onClick={handleUpdate} disabled={!editingUrl?.title}>
          更新
        </Button>
      </DialogActions>
    </Dialog>
  );
};

