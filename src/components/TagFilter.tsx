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
    <Paper sx={{ p: 1.5, mb: 2, borderRadius: 2, boxShadow: 1 }}>
      <Box sx={{ mb: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
          <TagIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
            タグでフィルター
          </Typography>
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', ml: 4 }}>
          クリックでフィルター / ×で削除
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

