import React from 'react';
import { Paper, Typography, Button } from '@mui/material';
import { Add as AddIcon, Link as LinkIcon, LocalOffer as TagIcon } from '@mui/icons-material';

interface EmptyStateProps {
  type: 'no-urls' | 'no-filtered-results';
  onAction: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ type, onAction }) => {
  if (type === 'no-urls') {
    return (
      <Paper
        sx={{
          p: 6,
          textAlign: 'center',
          bgcolor: 'white',
        }}
      >
        <LinkIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          URLが登録されていません
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          「新規追加」ボタンから記事やWebサイトのURLを追加してください
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={onAction}>
          最初のURLを追加
        </Button>
      </Paper>
    );
  }

  return (
    <Paper
      sx={{
        p: 6,
        textAlign: 'center',
        bgcolor: 'white',
      }}
    >
      <TagIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
      <Typography variant="h6" color="text.secondary" gutterBottom>
        選択したタグに一致するURLがありません
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        別のタグを選択するか、「すべて」をクリックしてください
      </Typography>
      <Button variant="outlined" onClick={onAction}>
        フィルターをクリア
      </Button>
    </Paper>
  );
};

