import React from 'react';
import { Box, Typography, Paper, Chip } from '@mui/material';
import { Favorite as FavoriteIcon } from '@mui/icons-material';

interface FavoriteFilterProps {
  showOnlyFavorites: boolean;
  filteredCount: number;
  onToggle: () => void;
}

export const FavoriteFilter: React.FC<FavoriteFilterProps> = ({
  showOnlyFavorites,
  filteredCount,
  onToggle,
}) => {
  return (
    <Paper sx={{ p: 1.5, mb: 2, borderRadius: 2, boxShadow: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
        <FavoriteIcon sx={{ mr: 1, color: 'error.main' }} />
        <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
          お気に入りでフィルター
        </Typography>
      </Box>
      <Chip
        icon={<FavoriteIcon />}
        label={showOnlyFavorites ? 'お気に入りのみ' : 'すべて'}
        onClick={onToggle}
        sx={{
          fontWeight: 600,
          ...(showOnlyFavorites
            ? {
                bgcolor: 'error.main',
                color: 'white',
                '&:hover': {
                  bgcolor: 'error.dark',
                },
              }
            : {
                borderColor: 'error.main',
                color: 'error.main',
                borderWidth: 1,
                borderStyle: 'solid',
                '&:hover': {
                  bgcolor: 'error.lighter',
                },
              }),
        }}
      />
      {showOnlyFavorites && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          {filteredCount}件のURLが見つかりました
        </Typography>
      )}
    </Paper>
  );
};

