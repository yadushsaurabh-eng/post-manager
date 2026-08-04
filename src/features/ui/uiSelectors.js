import { createSelector } from '@reduxjs/toolkit';

const selectUiState = (state) => state.ui;

export const selectTheme = createSelector([selectUiState], (ui) => ui.theme);
export const selectSidebarOpen = createSelector([selectUiState], (ui) => ui.sidebarOpen);
export const selectViewMode = createSelector([selectUiState], (ui) => ui.viewMode);

export const selectIsGlobalSearchOpen = createSelector([selectUiState], (ui) => ui.isGlobalSearchOpen);
export const selectGlobalSearchQuery = createSelector([selectUiState], (ui) => ui.globalSearchQuery);

export const selectPostModalState = createSelector([selectUiState], (ui) => ui.postModal);
export const selectPlatformModalState = createSelector([selectUiState], (ui) => ui.platformModal);
export const selectConfirmModalState = createSelector([selectUiState], (ui) => ui.confirmModal);

export const selectToasts = createSelector([selectUiState], (ui) => ui.toasts);
export const selectLastDeletedPost = createSelector([selectUiState], (ui) => ui.lastDeletedPost);
