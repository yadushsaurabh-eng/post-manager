import React, { useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './hooks/useRedux';
import { selectTheme } from './features/ui/uiSelectors';
import {
  openGlobalSearch,
  closeGlobalSearch,
  openPostModal,
  closePostModal,
  closePlatformModal,
  closeConfirmModal,
  addToast,
  setLastDeletedPost,
} from './features/ui/uiSlice';
import { deletePost } from './features/posts/postsSlice';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

// Layout & Common Components
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { ToastContainer } from './components/common/ToastContainer';
import { ConfirmModal } from './components/common/ConfirmModal';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';

// Modals
import { PostFormModal } from './features/posts/PostFormModal';
import { PlatformFormModal } from './features/platforms/PlatformFormModal';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { PostsPage } from './pages/PostsPage';
import { PlatformsPage } from './pages/PlatformsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Styles
import './styles/global.css';

export function App() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(selectTheme);

  // Synchronize document theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Global Keyboard Shortcuts
  const handleOpenSearch = useCallback(() => {
    dispatch(openGlobalSearch());
  }, [dispatch]);

  const handleOpenNewPost = useCallback(() => {
    dispatch(openPostModal({ mode: 'create' }));
  }, [dispatch]);

  const handleCloseModals = useCallback(() => {
    dispatch(closeGlobalSearch());
    dispatch(closePostModal());
    dispatch(closePlatformModal());
    dispatch(closeConfirmModal());
  }, [dispatch]);

  useKeyboardShortcuts([
    { key: 'k', ctrlKey: true, action: handleOpenSearch },
    { key: 'n', ctrlKey: true, shiftKey: true, action: handleOpenNewPost },
    { key: 'Escape', action: handleCloseModals },
  ]);

  // Global Confirm Action Handler (Delete Post with Optimistic Update + Undo option)
  const handleConfirmAction = useCallback(
    (payload) => {
      if (payload && payload.id) {
        // Track last deleted post for Undo
        dispatch(setLastDeletedPost(payload));

        // Optimistically remove from Redux state & triggers async delete thunk
        dispatch(deletePost(payload.id));

        dispatch(
          addToast({
            message: `Post "${payload.title.slice(0, 30)}..." deleted`,
            type: 'info',
            undoable: true,
            duration: 6000,
          })
        );
      }
    },
    [dispatch]
  );

  return (
    <BrowserRouter>
      <div className="app-container">
        <Sidebar />

        <div className="main-content">
          <Navbar />
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/posts" element={<PostsPage />} />
            <Route path="/platforms" element={<PlatformsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>

        {/* Global Modals & Notifications */}
        <PostFormModal />
        <PlatformFormModal />
        <ConfirmModal onConfirm={handleConfirmAction} />
        <GlobalSearchModal />
        <ToastContainer />
      </div>
    </BrowserRouter>
  );
}

export default App;
