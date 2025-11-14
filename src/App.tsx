import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  AppBar,
  Toolbar,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import './App.css';

// Types
import { URLItem, ReadingStatus } from './types';

// Hooks
import { useUrlManager } from './hooks/useUrlManager';

// Components
import { URLCard } from './components/URLCard';
import { TagFilter } from './components/TagFilter';
import { StatusFilter } from './components/StatusFilter';
import { AddUrlDialog } from './components/AddUrlDialog';
import { EditUrlDialog } from './components/EditUrlDialog';
import { EmptyState } from './components/EmptyState';

function App() {
  const { urls, allTags, addUrl, updateUrl, deleteUrl, changeStatus, deleteTag } = useUrlManager();

  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editingUrl, setEditingUrl] = useState<URLItem | null>(null);
  const [selectedFilterTags, setSelectedFilterTags] = useState<string[]>([]);
  const [selectedFilterStatus, setSelectedFilterStatus] = useState<ReadingStatus | null>(null);

  // フィルタリングされたURLリスト
  const filteredUrls = urls.filter(url => {
    const matchesTags =
      selectedFilterTags.length === 0 || selectedFilterTags.every(tag => url.tags.includes(tag));
    const matchesStatus = !selectedFilterStatus || url.status === selectedFilterStatus;
    return matchesTags && matchesStatus;
  });

  const handleToggleTag = (tag: string) => {
    if (selectedFilterTags.includes(tag)) {
      setSelectedFilterTags(selectedFilterTags.filter(t => t !== tag));
    } else {
      setSelectedFilterTags([...selectedFilterTags, tag]);
    }
  };

  const handleDeleteTag = (tag: string) => {
    deleteTag(tag);
    setSelectedFilterTags(selectedFilterTags.filter(t => t !== tag));
  };

  const handleEditUrl = (urlItem: URLItem) => {
    setEditingUrl(urlItem);
    setOpenEditDialog(true);
  };

  const handleOpenUrl = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg,rgb(232, 14, 46) 0%,rgb(21, 2, 2) 100%)',
          boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              bgcolor: 'rgba(255,255,255,0.15)',
              borderRadius: 2,
              px: 1.5,
              py: 0.5,
              mr: 2,
            }}
          >
            <img 
              src="/logo.png" 
              alt="URL Manager Logo" 
              style={{ 
                width: 28, 
                height: 28,
                objectFit: 'contain'
              }} 
            />
          </Box>
          <Typography
            variant="h5"
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              letterSpacing: 0.5,
            }}
          >
            URL Manager
          </Typography>
          <Button
            color="inherit"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              borderRadius: 2,
              px: 2.5,
              py: 1,
              fontWeight: 600,
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.3)',
              },
            }}
          >
            新規追加
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* タグフィルター */}
        <TagFilter
          allTags={allTags}
          selectedTags={selectedFilterTags}
          filteredCount={filteredUrls.length}
          onToggleTag={handleToggleTag}
          onDeleteTag={handleDeleteTag}
        />

        {/* 状態でフィルター */}
        {urls.length > 0 && (
          <StatusFilter
            selectedStatus={selectedFilterStatus}
            filteredCount={filteredUrls.length}
            onSelectStatus={setSelectedFilterStatus}
          />
        )}

        {/* URLリスト */}
        {urls.length === 0 ? (
          <EmptyState type="no-urls" onAction={() => setOpenDialog(true)} />
        ) : filteredUrls.length === 0 ? (
          <EmptyState
            type="no-filtered-results"
            onAction={() => {
              setSelectedFilterTags([]);
              setSelectedFilterStatus(null);
            }}
          />
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              },
              gap: 3,
            }}
          >
            {filteredUrls.map(urlItem => (
              <URLCard
                key={urlItem.id}
                urlItem={urlItem}
                onEdit={handleEditUrl}
                onDelete={deleteUrl}
                onOpenUrl={handleOpenUrl}
                onChangeStatus={changeStatus}
              />
            ))}
          </Box>
        )}
      </Container>

      {/* 新規追加ダイアログ */}
      <AddUrlDialog
        open={openDialog}
        allTags={allTags}
        onClose={() => setOpenDialog(false)}
        onAdd={newUrl => {
          addUrl(newUrl);
          setOpenDialog(false);
        }}
      />

      {/* 編集ダイアログ */}
      <EditUrlDialog
        open={openEditDialog}
        urlItem={editingUrl}
        allTags={allTags}
        onClose={() => {
          setOpenEditDialog(false);
          setEditingUrl(null);
        }}
        onUpdate={updatedUrl => {
          updateUrl(updatedUrl);
          setOpenEditDialog(false);
          setEditingUrl(null);
        }}
      />
    </Box>
  );
}

export default App;
