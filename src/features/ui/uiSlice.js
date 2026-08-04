import { createSlice } from '@reduxjs/toolkit';

const getInitialTheme = () => {
  try {
    const saved = localStorage.getItem('theme_preference');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  } catch (e) {
    return 'dark';
  }
};

const initialState = {
  theme: getInitialTheme(),
  sidebarOpen: true,
  viewMode: 'grid', // 'grid' | 'list'
  isGlobalSearchOpen: false,
  globalSearchQuery: '',
  postModal: {
    isOpen: false,
    mode: 'create', // 'create' | 'edit'
    postToEdit: null,
  },
  platformModal: {
    isOpen: false,
    platformToEdit: null,
  },
  confirmModal: {
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    confirmVariant: 'danger', // 'danger' | 'primary'
    onConfirmAction: null, // serializable descriptor or trigger identifier
    payload: null,
  },
  toasts: [], // array of { id, message, type: 'success'|'error'|'info', undoable: boolean }
  lastDeletedPost: null, // Holds last deleted post entity for Undo functionality
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('theme_preference', state.theme);
        document.documentElement.setAttribute('data-theme', state.theme);
      } catch (e) {
        console.warn('LocalStorage write error:', e);
      }
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      try {
        localStorage.setItem('theme_preference', state.theme);
        document.documentElement.setAttribute('data-theme', state.theme);
      } catch (e) {
        console.warn('LocalStorage write error:', e);
      }
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },
    openGlobalSearch: (state) => {
      state.isGlobalSearchOpen = true;
    },
    closeGlobalSearch: (state) => {
      state.isGlobalSearchOpen = false;
      state.globalSearchQuery = '';
    },
    setGlobalSearchQuery: (state, action) => {
      state.globalSearchQuery = action.payload;
    },
    openPostModal: (state, action) => {
      state.postModal.isOpen = true;
      state.postModal.mode = action.payload?.mode || 'create';
      state.postModal.postToEdit = action.payload?.post || null;
    },
    closePostModal: (state) => {
      state.postModal.isOpen = false;
      state.postModal.mode = 'create';
      state.postModal.postToEdit = null;
    },
    openPlatformModal: (state, action) => {
      state.platformModal.isOpen = true;
      state.platformModal.platformToEdit = action.payload || null;
    },
    closePlatformModal: (state) => {
      state.platformModal.isOpen = false;
      state.platformModal.platformToEdit = null;
    },
    openConfirmModal: (state, action) => {
      state.confirmModal = {
        isOpen: true,
        title: action.payload.title || 'Are you sure?',
        message: action.payload.message || '',
        confirmText: action.payload.confirmText || 'Confirm',
        confirmVariant: action.payload.confirmVariant || 'danger',
        payload: action.payload.payload || null,
      };
    },
    closeConfirmModal: (state) => {
      state.confirmModal.isOpen = false;
      state.confirmModal.payload = null;
    },
    addToast: (state, action) => {
      const newToast = {
        id: `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        message: action.payload.message,
        type: action.payload.type || 'info', // 'success' | 'error' | 'info'
        undoable: action.payload.undoable || false,
        duration: action.payload.duration || 4000,
      };
      state.toasts.push(newToast);
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    setLastDeletedPost: (state, action) => {
      state.lastDeletedPost = action.payload;
    },
    clearLastDeletedPost: (state) => {
      state.lastDeletedPost = null;
    },
  },
});

export const {
  toggleTheme,
  setTheme,
  toggleSidebar,
  setViewMode,
  openGlobalSearch,
  closeGlobalSearch,
  setGlobalSearchQuery,
  openPostModal,
  closePostModal,
  openPlatformModal,
  closePlatformModal,
  openConfirmModal,
  closeConfirmModal,
  addToast,
  removeToast,
  setLastDeletedPost,
  clearLastDeletedPost,
} = uiSlice.actions;

export default uiSlice.reducer;
