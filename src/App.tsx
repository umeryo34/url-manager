import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  AppBar,
  Toolbar,
  Paper,
  Tabs,
  Tab,
} from '@mui/material';
import { Add as AddIcon, CheckCircle as CompletedIcon } from '@mui/icons-material';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import './App.css';

// Types
import { URLItem, ReadingStatus } from './types';

// Hooks
import { useUrlManager } from './hooks/useUrlManager';

// Components
import { URLCard } from './components/URLCard';
import { TagFilter } from './components/TagFilter';
import { StatusFilter } from './components/StatusFilter';
import { FavoriteFilter } from './components/FavoriteFilter';
import { AddUrlDialog } from './components/AddUrlDialog';
import { EditUrlDialog } from './components/EditUrlDialog';
import { CompleteDialog } from './components/CompleteDialog';
import { EmptyState } from './components/EmptyState';

function App() {
  const { urls, allTags, addUrl, updateUrl, deleteUrl, changeStatus, deleteTag, toggleFavorite, incrementClickCount } = useUrlManager();

  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openCompleteDialog, setOpenCompleteDialog] = useState(false);
  const [editingUrl, setEditingUrl] = useState<URLItem | null>(null);
  const [completingUrl, setCompletingUrl] = useState<URLItem | null>(null);
  const [selectedFilterTags, setSelectedFilterTags] = useState<string[]>([]);
  const [selectedFilterStatus, setSelectedFilterStatus] = useState<ReadingStatus | null>(null);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  const [sortOption, setSortOption] = useState<string>('created_desc');

  // アクティブなURL（未読・読書中）と完読したURLを分離
  const activeUrls = urls.filter(url => url.status !== '完読');
  const completedUrls = urls.filter(url => url.status === '完読');

  // フィルタリングされたURLリスト
  const filteredUrls = (activeTab === 'active' ? activeUrls : completedUrls).filter(url => {
    const matchesTags =
      selectedFilterTags.length === 0 || selectedFilterTags.every(tag => url.tags.includes(tag));
    const matchesStatus = !selectedFilterStatus || url.status === selectedFilterStatus;
    const matchesFavorite = !showOnlyFavorites || url.isFavorite === true;
    return matchesTags && matchesStatus && matchesFavorite;
  });

  // ソート処理
  const sortedUrls = [...filteredUrls].sort((a, b) => {
    const [key, order] = sortOption.split('_') as [string, 'asc' | 'desc'];
    const dir = order === 'asc' ? 1 : -1;
    const getTime = (s?: string) => (s ? new Date(s).getTime() : 0);
    switch (key) {
      case 'created':
        return (getTime(a.createdAt) - getTime(b.createdAt)) * dir;
      case 'updated':
        return (getTime(a.updatedAt) - getTime(b.updatedAt)) * dir;
      case 'completed':
        return (getTime(a.completedAt) - getTime(b.completedAt)) * dir;
      case 'title':
        return a.title.localeCompare(b.title, 'ja') * dir;
      case 'clicks':
        return (((a.clickCount ?? 0) - (b.clickCount ?? 0)) * dir);
      default:
        return 0;
    }
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

  const handleOpenUrl = (item: URLItem) => {
    window.open(item.url, '_blank', 'noopener,noreferrer');
    incrementClickCount(item.id);
  };

  const handleCompleteClick = (urlItem: URLItem) => {
    setCompletingUrl(urlItem);
    setOpenCompleteDialog(true);
  };

  const handleComplete = (memo: string, completedDate: string) => {
    if (completingUrl) {
      changeStatus(completingUrl.id, '完読', memo, completedDate);
      setOpenCompleteDialog(false);
      setCompletingUrl(null);
    }
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
          <Select
            size="small"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as string)}
            sx={{
              minWidth: 220,
              bgcolor: 'rgba(255,255,255,0.9)',
              borderRadius: 1,
              mr: 1,
            }}
          >
            <MenuItem value="created_desc">作成日が新しい順</MenuItem>
            <MenuItem value="created_asc">作成日が古い順</MenuItem>
            <MenuItem value="updated_desc">更新日が新しい順</MenuItem>
            <MenuItem value="updated_asc">更新日が古い順</MenuItem>
            <MenuItem value="completed_desc" disabled={activeTab !== 'completed'}>完了日が新しい順</MenuItem>
            <MenuItem value="completed_asc" disabled={activeTab !== 'completed'}>完了日が古い順</MenuItem>
            <MenuItem value="title_asc">タイトル A → Z</MenuItem>
            <MenuItem value="title_desc">タイトル Z → A</MenuItem>
            <MenuItem value="clicks_desc">クリック数 多い順</MenuItem>
            <MenuItem value="clicks_asc">クリック数 少ない順</MenuItem>
          </Select>
          <Button
            color="inherit"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
            sx={{
              bgcolor: 'rgba(255,255,255,0.9)',
              borderRadius: 1,
              color: 'text.primary',
              px: 2.5,
              py: 1,
              fontWeight: 600,
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.95)',
              },
            }}
          >
            新規追加
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: 'flex', mt: 4, mb: 4 }}>
        {/* 左サイドバー - フィルター */}
        <Paper
          sx={{
            width: { xs: '100%', md: 240 },
            minWidth: 240,
            maxHeight: 'calc(100vh - 120px)',
            overflowY: 'auto',
            p: 1.5,
            mr: { xs: 0, md: 3 },
            mb: { xs: 3, md: 0 },
            position: { xs: 'static', md: 'sticky' },
            top: 20,
            alignSelf: 'flex-start',
            borderRadius: 2,
          }}
        >
          {/* お気に入りフィルター */}
          {urls.length > 0 && (
            <FavoriteFilter
              showOnlyFavorites={showOnlyFavorites}
              filteredCount={filteredUrls.length}
              onToggle={() => setShowOnlyFavorites(!showOnlyFavorites)}
            />
          )}

          {/* 状態でフィルター */}
          {urls.length > 0 && activeTab === 'active' && (
            <StatusFilter
              selectedStatus={selectedFilterStatus}
              filteredCount={filteredUrls.length}
              onSelectStatus={setSelectedFilterStatus}
            />
          )}

          {/* タグフィルター */}
          <TagFilter
            allTags={allTags}
            selectedTags={selectedFilterTags}
            filteredCount={filteredUrls.length}
            onToggleTag={handleToggleTag}
            onDeleteTag={handleDeleteTag}
          />
        </Paper>

        {/* メインコンテンツ - URLリスト */}
        <Container maxWidth="lg" sx={{ flex: 1, p: 0 }}>
          {/* タブ */}
          <Paper sx={{ mb: 2, borderRadius: 2 }}>
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => {
                setActiveTab(newValue);
                setSelectedFilterTags([]);
                setSelectedFilterStatus(null);
                setShowOnlyFavorites(false);
                setSortOption(newValue === 'completed' ? 'completed_desc' : 'created_desc');
              }}
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                },
              }}
            >
              <Tab
                label={`未読・読書中 (${activeUrls.length})`}
                value="active"
              />
              <Tab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CompletedIcon sx={{ fontSize: 18 }} />
                    完読 ({completedUrls.length})
                  </Box>
                }
                value="completed"
              />
            </Tabs>
          </Paper>
          

          {activeTab === 'active' && urls.length === 0 ? (
            <EmptyState type="no-urls" onAction={() => setOpenDialog(true)} />
          ) : filteredUrls.length === 0 ? (
            <EmptyState
              type="no-filtered-results"
              onAction={() => {
                setSelectedFilterTags([]);
                setSelectedFilterStatus(null);
                setShowOnlyFavorites(false);
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
              {sortedUrls.map(urlItem => (
                <URLCard
                  key={urlItem.id}
                  urlItem={urlItem}
                  onEdit={handleEditUrl}
                  onDelete={deleteUrl}
                  onOpenUrl={handleOpenUrl}
                  onChangeStatus={changeStatus}
                  onCompleteClick={handleCompleteClick}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </Box>
          )}
        </Container>
      </Box>

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

      {/* 完読ダイアログ */}
      <CompleteDialog
        open={openCompleteDialog}
        urlItem={completingUrl}
        onClose={() => {
          setOpenCompleteDialog(false);
          setCompletingUrl(null);
        }}
        onComplete={handleComplete}
      />
    </Box>
  );
}

export default App;
