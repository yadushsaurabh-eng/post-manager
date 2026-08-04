import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchPostsAPI,
  createPostAPI,
  updatePostAPI,
  deletePostAPI,
  changePostStatusAPI,
} from './postsAPI';

// Entity Adapter for Normalized Posts State (Sorted by createdAt descending)
export const postsAdapter = createEntityAdapter({
  selectId: (post) => post.id,
  sortComparer: (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
});

// Async Thunks
export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchPostsAPI();
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch social posts');
    }
  }
);

export const createPost = createAsyncThunk(
  'posts/createPost',
  async (postData, { rejectWithValue }) => {
    try {
      const newPost = {
        ...postData,
        id: postData.id || `post-${Date.now()}`,
        createdAt: postData.createdAt || new Date().toISOString(),
        likes: postData.likes || 0,
        shares: postData.shares || 0,
        comments: postData.comments || 0,
      };
      const data = await createPostAPI(newPost);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to create post');
    }
  }
);

export const updatePost = createAsyncThunk(
  'posts/updatePost',
  async (postData, { rejectWithValue }) => {
    try {
      const data = await updatePostAPI(postData);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to update post');
    }
  }
);

export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (id, { rejectWithValue }) => {
    try {
      await deletePostAPI(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to delete post');
    }
  }
);

export const changePostStatus = createAsyncThunk(
  'posts/changePostStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const data = await changePostStatusAPI({ id, status });
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to change post status');
    }
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState: postsAdapter.getInitialState({
    loading: false,
    error: null,
    searchQuery: '',
    platformFilter: 'all',
    statusFilter: 'all',
    sortBy: 'newest', // 'newest' | 'oldest' | 'title'
    currentPage: 1,
    postsPerPage: 6,
    infiniteScroll: false,
  }),
  reducers: {
    // Synchronous entity reducers required by prompt specification
    addPost: (state, action) => {
      postsAdapter.addOne(state, action.payload);
    },
    updatePostLocal: (state, action) => {
      postsAdapter.updateOne(state, {
        id: action.payload.id,
        changes: action.payload,
      });
    },
    deletePostLocal: (state, action) => {
      postsAdapter.removeOne(state, action.payload);
    },
    publishPost: (state, action) => {
      const id = action.payload;
      if (state.entities[id]) {
        state.entities[id].status = 'published';
      }
    },
    draftPost: (state, action) => {
      const id = action.payload;
      if (state.entities[id]) {
        state.entities[id].status = 'draft';
      }
    },
    schedulePost: (state, action) => {
      const { id, scheduledFor } = action.payload;
      if (state.entities[id]) {
        state.entities[id].status = 'scheduled';
        if (scheduledFor) state.entities[id].scheduledFor = scheduledFor;
      }
    },
    restorePost: (state, action) => {
      if (action.payload) {
        postsAdapter.addOne(state, action.payload);
      }
    },

    // Filtering, Search & Pagination Reducers
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.currentPage = 1;
    },
    setPlatformFilter: (state, action) => {
      state.platformFilter = action.payload;
      state.currentPage = 1;
    },
    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload;
      state.currentPage = 1;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    toggleInfiniteScroll: (state) => {
      state.infiniteScroll = !state.infiniteScroll;
      state.currentPage = 1;
    },
    resetFilters: (state) => {
      state.searchQuery = '';
      state.platformFilter = 'all';
      state.statusFilter = 'all';
      state.sortBy = 'newest';
      state.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      /* fetchPosts */
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        postsAdapter.setAll(state, action.payload);
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      /* createPost */
      .addCase(createPost.fulfilled, (state, action) => {
        postsAdapter.addOne(state, action.payload);
      })

      /* updatePost */
      .addCase(updatePost.fulfilled, (state, action) => {
        postsAdapter.updateOne(state, {
          id: action.payload.id,
          changes: action.payload,
        });
      })

      /* deletePost */
      .addCase(deletePost.fulfilled, (state, action) => {
        postsAdapter.removeOne(state, action.payload);
      })

      /* changePostStatus */
      .addCase(changePostStatus.fulfilled, (state, action) => {
        postsAdapter.updateOne(state, {
          id: action.payload.id,
          changes: action.payload,
        });
      });
  },
});

export const {
  addPost,
  updatePostLocal,
  deletePostLocal,
  publishPost,
  draftPost,
  schedulePost,
  restorePost,
  setSearchQuery,
  setPlatformFilter,
  setStatusFilter,
  setSortBy,
  setCurrentPage,
  toggleInfiniteScroll,
  resetFilters,
} = postsSlice.actions;

export default postsSlice.reducer;
