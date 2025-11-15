import React from 'react';
import { Box, Typography, Paper, Chip, Stack } from '@mui/material';
import {
  AutoStories as ReadingIcon,
  BookmarkBorder as UnreadIcon,
  CheckCircle as CompletedIcon,
} from '@mui/icons-material';
import { ReadingStatus } from '../types';
import { getStatusColor } from '../utils/colors';

interface StatusFilterProps {
  selectedStatus: ReadingStatus | null;
  filteredCount: number;
  onSelectStatus: (status: ReadingStatus | null) => void;
}

const getStatusIcon = (status: ReadingStatus) => {
  switch (status) {
    case '未読':
      return <UnreadIcon sx={{ fontSize: 18 }} />;
    case '読書中':
      return <ReadingIcon sx={{ fontSize: 18 }} />;
    case '完読':
      return <CompletedIcon sx={{ fontSize: 18 }} />;
  }
};

export const StatusFilter: React.FC<StatusFilterProps> = ({
  selectedStatus,
  filteredCount,
  onSelectStatus,
}) => {
  return (
    <Paper sx={{ p: 1.5, mb: 2, borderRadius: 2, boxShadow: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
        <ReadingIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
          状態でフィルター
        </Typography>
      </Box>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        <Chip
          label="すべて"
          onClick={() => onSelectStatus(null)}
          color={!selectedStatus ? 'primary' : 'default'}
          sx={{
            fontWeight: 600,
            mb: 1,
          }}
        />
        {(['未読', '読書中'] as ReadingStatus[]).map((status) => (
          <Chip
            key={status}
            icon={getStatusIcon(status)}
            label={status}
            onClick={() => onSelectStatus(status)}
            sx={{
              fontWeight: 600,
              mb: 1,
              ...(selectedStatus === status
                ? {
                    bgcolor: getStatusColor(status),
                    color: 'white',
                    '&:hover': {
                      bgcolor: getStatusColor(status),
                      opacity: 0.9,
                    },
                  }
                : {
                    borderColor: getStatusColor(status),
                    color: getStatusColor(status),
                    borderWidth: 1,
                    borderStyle: 'solid',
                    '&:hover': {
                      bgcolor: `${getStatusColor(status)}15`,
                    },
                  }),
            }}
          />
        ))}
      </Stack>
      {selectedStatus && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          {filteredCount}件のURLが見つかりました
        </Typography>
      )}
    </Paper>
  );
};

