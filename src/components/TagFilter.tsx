import React from 'react';
import { Box, Typography, Paper, Chip, Stack } from '@mui/material';
import { LocalOffer as TagIcon, Close as CloseIcon } from '@mui/icons-material';

interface TagFilterProps {
  allTags: string[];
  selectedTags: string[];
  filteredCount: number;
  onToggleTag: (tag: string) => void;
  onDeleteTag: (tag: string) => void;
}

export const TagFilter: React.FC<TagFilterProps> = ({
  allTags,
  selectedTags,
  filteredCount,
  onToggleTag,
  onDeleteTag,
}) => {
  if (allTags.length === 0) return null;

  return (
    <Paper sx={{ p: 2.5, mb: 3, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TagIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            タグでフィルター
          </Typography>
        </Box>
        <Typography variant="caption" color="text.secondary">
          クリックでフィルター / ×ボタンで削除
        </Typography>
      </Box>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        <Chip
          label="すべて"
          onClick={() => selectedTags.forEach(tag => onToggleTag(tag))}
          color={selectedTags.length === 0 ? 'primary' : 'default'}
          sx={{
            fontWeight: 600,
            mb: 1,
          }}
        />
        {allTags.map((tag) => (
          <Chip
            key={tag}
            label={tag}
            onClick={() => onToggleTag(tag)}
            onDelete={() => onDeleteTag(tag)}
            deleteIcon={
              <CloseIcon
                sx={{
                  fontSize: '18px !important',
                  '&:hover': {
                    color: 'error.main',
                  },
                }}
              />
            }
            color={selectedTags.includes(tag) ? 'primary' : 'default'}
            sx={{
              fontWeight: 600,
              mb: 1,
            }}
          />
        ))}
      </Stack>
      {selectedTags.length > 0 && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          {filteredCount}件のURLが見つかりました
        </Typography>
      )}
    </Paper>
  );
};

