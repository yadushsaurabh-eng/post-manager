import { createSelector } from '@reduxjs/toolkit';
import { postsAdapter } from './postsSlice';

// Adapter base selectors
export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
  selectEntities: selectPostEntities,
  selectTotal: selectTotalPosts,
} = postsAdapter.getSelectors((state) => state.posts);

export const selectPostsLoading = (state) => state.posts.loading;
export const selectPostsError = (state) => state.posts.error;

export const selectSearchQuery = (state) => state.posts.searchQuery;
export const selectPlatformFilter = (state) => state.posts.platformFilter;
export const selectStatusFilter = (state) => state.posts.statusFilter;
export const selectSortBy = (state) => state.posts.sortBy;
export const selectCurrentPage = (state) => state.posts.currentPage;
export const selectPostsPerPage = (state) => state.posts.postsPerPage;
export const selectInfiniteScroll = (state) => state.posts.infiniteScroll;

/* Required Specific Selectors */

export const selectDraftPosts = createSelector(
  [selectAllPosts],
  (posts) => posts.filter((post) => post.status === 'draft')
);

export const selectPublishedPosts = createSelector(
  [selectAllPosts],
  (posts) => posts.filter((post) => post.status === 'published')
);

export const selectScheduledPosts = createSelector(
  [selectAllPosts],
  (posts) => posts.filter((post) => post.status === 'scheduled')
);

export const selectDraftPostsCount = createSelector(
  [selectDraftPosts],
  (drafts) => drafts.length
);

export const selectPublishedPostsCount = createSelector(
  [selectPublishedPosts],
  (published) => published.length
);

export const selectScheduledPostsCount = createSelector(
  [selectScheduledPosts],
  (scheduled) => scheduled.length
);

// Parameterized memoized selector for posts by platform
export const selectPostsByPlatform = createSelector(
  [selectAllPosts, (_, platformId) => platformId],
  (posts, platformId) => {
    if (!platformId || platformId === 'all') return posts;
    return posts.filter((post) => post.platform === platformId);
  }
);

// Advanced Memoized Filtering & Sorting Selector
export const selectFilteredAndSortedPosts = createSelector(
  [selectAllPosts, selectSearchQuery, selectPlatformFilter, selectStatusFilter, selectSortBy],
  (posts, searchQuery, platformFilter, statusFilter, sortBy) => {
    return posts.filter((post) => {
      // Search match
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        post.title.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        post.platform.toLowerCase().includes(query);

      // Platform filter
      const matchesPlatform = platformFilter === 'all' || post.platform === platformFilter;

      // Status filter
      const matchesStatus = statusFilter === 'all' || post.status === statusFilter;

      return matchesSearch && matchesPlatform && matchesStatus;
    }).sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }
);

// Paginated selector
export const selectPaginatedPosts = createSelector(
  [selectFilteredAndSortedPosts, selectCurrentPage, selectPostsPerPage, selectInfiniteScroll],
  (filteredPosts, currentPage, postsPerPage, infiniteScroll) => {
    if (infiniteScroll) {
      return filteredPosts.slice(0, currentPage * postsPerPage);
    }
    const startIndex = (currentPage - 1) * postsPerPage;
    return filteredPosts.slice(startIndex, startIndex + postsPerPage);
  }
);

export const selectTotalPages = createSelector(
  [selectFilteredAndSortedPosts, selectPostsPerPage],
  (filteredPosts, postsPerPage) => Math.ceil(filteredPosts.length / postsPerPage) || 1
);

// Comprehensive Analytics Derived Selector (Reselect Memoized - Zero Redundant State)
export const selectAnalytics = createSelector(
  [selectAllPosts],
  (posts) => {
    const totalPosts = posts.length;
    const publishedCount = posts.filter((p) => p.status === 'published').length;
    const draftCount = posts.filter((p) => p.status === 'draft').length;
    const scheduledCount = posts.filter((p) => p.status === 'scheduled').length;

    // Platform distribution
    const postsPerPlatform = posts.reduce((acc, post) => {
      acc[post.platform] = (acc[post.platform] || 0) + 1;
      return acc;
    }, {});

    // Engagement totals
    const totalLikes = posts.reduce((sum, p) => sum + (p.likes || 0), 0);
    const totalShares = posts.reduce((sum, p) => sum + (p.shares || 0), 0);
    const totalComments = posts.reduce((sum, p) => sum + (p.comments || 0), 0);

    // Recent Activity (Top 5 newest posts)
    const recentActivity = [...posts]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    return {
      totalPosts,
      publishedCount,
      draftCount,
      scheduledCount,
      postsPerPlatform,
      totalLikes,
      totalShares,
      totalComments,
      recentActivity,
      publishedRatio: totalPosts ? Math.round((publishedCount / totalPosts) * 100) : 0,
    };
  }
);
