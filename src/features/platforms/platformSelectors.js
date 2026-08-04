import { createSelector } from '@reduxjs/toolkit';
import { platformsAdapter } from './platformSlice';

// Base entity adapter selectors
export const {
  selectAll: selectAllPlatforms,
  selectById: selectPlatformById,
  selectIds: selectPlatformIds,
  selectEntities: selectPlatformEntities,
  selectTotal: selectTotalPlatformsCount,
} = platformsAdapter.getSelectors((state) => state.platforms);

export const selectPlatformsLoading = (state) => state.platforms.loading;
export const selectPlatformsError = (state) => state.platforms.error;

// Memoized derived selectors
export const selectConnectedPlatforms = createSelector(
  [selectAllPlatforms],
  (platforms) => platforms.filter((p) => p.status === 'connected')
);

export const selectConnectedPlatformsCount = createSelector(
  [selectConnectedPlatforms],
  (connected) => connected.length
);

export const selectPlatformMapById = createSelector(
  [selectAllPlatforms],
  (platforms) => {
    return platforms.reduce((acc, p) => {
      acc[p.id] = p;
      return acc;
    }, {});
  }
);
