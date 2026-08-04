import { configureStore } from '@reduxjs/toolkit';
import postsReducer from '../features/posts/postsSlice';
import platformReducer from '../features/platforms/platformSlice';
import uiReducer from '../features/ui/uiSlice';

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    platforms: platformReducer,
    ui: uiReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore non-serializable payload checks for toast functions if any
        ignoredActionPaths: ['payload.onConfirmAction'],
      },
    }),
});

export default store;
