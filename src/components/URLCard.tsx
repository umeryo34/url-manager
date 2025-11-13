import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  Button,
  IconButton,
  Stack,
} from '@mui/material';
import {
  OpenInNew as OpenInNewIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  BookmarkBorder as UnreadIcon,
  AutoStories as ReadingIcon,
  CheckCircle as CompletedIcon,
} from '@mui/icons-material';
import { URLItem, ReadingStatus } from '../types';
import { getCardGradient, getColorFromTag, getStatusColor } from '../utils/colors';
import { formatDate } from '../utils/formatters';

interface URLCardProps {
  urlItem: URLItem;
  onEdit: (urlItem: URLItem) => void;
  onDelete: (id: string) => void;
  onOpenUrl: (url: string) => void;
  onChangeStatus: (id: string, status: ReadingStatus) => void;
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

export const URLCard: React.FC<URLCardProps> = ({
  urlItem,
  onEdit,
  onDelete,
  onOpenUrl,
  onChangeStatus,
}) => {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
        '&:hover': {
          transform: 'translateY(-8px) scale(1.02)',
          boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
        },
      }}
    >
      <Box
        sx={{
          height: 8,
          background: getCardGradient(urlItem),
        }}
      />
      <CardContent sx={{ flexGrow: 1, p: 3, position: 'relative' }}>
        <IconButton
          size="small"
          onClick={() => onEdit(urlItem)}
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            bgcolor: 'rgba(255,255,255,0.9)',
            boxShadow: 1,
            '&:hover': {
              bgcolor: 'primary.main',
              color: 'white',
            },
          }}
        >
          <EditIcon sx={{ fontSize: 18 }} />
        </IconButton>
        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{
            fontWeight: 700,
            color: 'text.primary',
            mb: 2,
            lineHeight: 1.3,
            pr: 5,
          }}
        >
          {urlItem.title}
        </Typography>
        {urlItem.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              lineHeight: 1.6,
            }}
          >
            {urlItem.description}
          </Typography>
        )}
        {urlItem.tags.length > 0 && (
          <Box sx={{ mb: 2 }}>
            {urlItem.tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                sx={{
                  mr: 0.5,
                  mb: 0.5,
                  fontWeight: 600,
                  background: getColorFromTag(tag),
                  color: 'white',
                  '&:hover': {
                    opacity: 0.9,
                  },
                }}
              />
            ))}
          </Box>
        )}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
          <Chip
            icon={getStatusIcon(urlItem.status)}
            label={urlItem.status}
            size="small"
            sx={{
              bgcolor: getStatusColor(urlItem.status),
              color: 'white',
              fontWeight: 600,
            }}
          />
          <Typography variant="caption" sx={{ color: 'text.disabled' }}>
            {formatDate(urlItem.createdAt)}
          </Typography>
        </Box>
      </CardContent>
      <CardActions
        sx={{
          flexDirection: 'column',
          gap: 1.5,
          px: 3,
          pb: 2.5,
          pt: 0,
        }}
      >
        <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
          <Button
            variant="contained"
            size="small"
            startIcon={<OpenInNewIcon />}
            onClick={() => onOpenUrl(urlItem.url)}
            sx={{
              flex: 1,
              background: getCardGradient(urlItem),
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              },
            }}
          >
            開く
          </Button>
          <IconButton
            size="small"
            onClick={() => onDelete(urlItem.id)}
            sx={{
              color: 'error.main',
              '&:hover': {
                bgcolor: 'error.lighter',
              },
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>

        <Stack direction="row" spacing={0.5} sx={{ width: '100%' }}>
          {(['未読', '読書中', '完読'] as ReadingStatus[]).map((status) => (
            <Button
              key={status}
              size="small"
              variant={urlItem.status === status ? 'contained' : 'outlined'}
              onClick={() => onChangeStatus(urlItem.id, status)}
              startIcon={getStatusIcon(status)}
              sx={{
                flex: 1,
                fontSize: '0.7rem',
                py: 0.5,
                minWidth: 0,
                textTransform: 'none',
                ...(urlItem.status === status && {
                  bgcolor: getStatusColor(status),
                  '&:hover': {
                    bgcolor: getStatusColor(status),
                    opacity: 0.9,
                  },
                }),
                ...(urlItem.status !== status && {
                  borderColor: getStatusColor(status),
                  color: getStatusColor(status),
                  '&:hover': {
                    borderColor: getStatusColor(status),
                    bgcolor: `${getStatusColor(status)}15`,
                  },
                }),
              }}
            >
              {status}
            </Button>
          ))}
        </Stack>
      </CardActions>
    </Card>
  );
};

