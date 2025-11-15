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
} from '@mui/material';
import { CheckCircle as CompletedIcon } from '@mui/icons-material';
import { URLItem } from '../types';

interface CompleteDialogProps {
  open: boolean;
  urlItem: URLItem | null;
  onClose: () => void;
  onComplete: (memo: string, completedDate: string) => void;
}

export const CompleteDialog: React.FC<CompleteDialogProps> = ({
  open,
  urlItem,
  onClose,
  onComplete,
}) => {
  const [memo, setMemo] = useState('');
  const [completedDate, setCompletedDate] = useState('');

  useEffect(() => {
    if (open && urlItem) {
      // 既存のメモがあれば設定
      setMemo(urlItem.completedMemo || '');
      // 今日の日付をデフォルトに設定
      const today = new Date().toISOString().split('T')[0];
      setCompletedDate(urlItem.completedAt ? urlItem.completedAt.split('T')[0] : today);
    }
  }, [open, urlItem]);

  const handleComplete = () => {
    const dateToUse = completedDate || new Date().toISOString().split('T')[0];
    const dateTime = new Date(dateToUse + 'T00:00:00').toISOString();
    onComplete(memo, dateTime);
    setMemo('');
  };

  const handleClose = () => {
    setMemo('');
    setCompletedDate('');
    onClose();
  };

  if (!urlItem) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CompletedIcon sx={{ color: '#4caf50' }} />
          完読として登録
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Typography variant="body1" sx={{ mb: 2, fontWeight: 600 }}>
            {urlItem.title}
          </Typography>
          
          <TextField
            label="完了日"
            type="date"
            fullWidth
            variant="outlined"
            value={completedDate}
            onChange={(e) => setCompletedDate(e.target.value)}
            sx={{ mb: 2 }}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            label="メモ（任意）"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="読んだ感想やメモを入力してください..."
            helperText="完読時のメモを記録できます"
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose}>キャンセル</Button>
        <Button
          variant="contained"
          onClick={handleComplete}
          startIcon={<CompletedIcon />}
          sx={{
            bgcolor: '#4caf50',
            '&:hover': {
              bgcolor: '#388e3c',
            },
          }}
        >
          完読として登録
        </Button>
      </DialogActions>
    </Dialog>
  );
};

