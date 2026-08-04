import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchPlatformsAPI, updatePlatformAPI } from './platformAPI';

// Entity Adapter for Normalized Platform Management
export const platformsAdapter = createEntityAdapter({
  selectId: (platform) => platform.id,
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

// Async Thunks
export const fetchPlatforms = createAsyncThunk(
  'platforms/fetchPlatforms',
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchPlatformsAPI();
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch platforms');
    }
  }
);

export const updatePlatform = createAsyncThunk(
  'platforms/updatePlatform',
  async (platform, { rejectWithValue }) => {
    try {
      const data = await updatePlatformAPI(platform);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to update platform');
    }
  }
);

const platformSlice = createSlice({
  name: 'platforms',
  initialState: platformsAdapter.getInitialState({
    loading: false,
    error: null,
  }),
  reducers: {
    togglePlatformStatus: (state, action) => {
      const id = action.payload;
      const entity = state.entities[id];
      if (entity) {
        entity.status = entity.status === 'connected' ? 'disconnected' : 'connected';
      }
    },
    updatePlatformLocal: (state, action) => {
      platformsAdapter.updateOne(state, {
        id: action.payload.id,
        changes: action.payload.changes,
      });
    },
  },
  extraReducers: (builder) => {
    builder
      /* fetchPlatforms */
      .addCase(fetchPlatforms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlatforms.fulfilled, (state, action) => {
        state.loading = false;
        platformsAdapter.setAll(state, action.payload);
      })
      .addCase(fetchPlatforms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      /* updatePlatform */
      .addCase(updatePlatform.fulfilled, (state, action) => {
        platformsAdapter.updateOne(state, {
          id: action.payload.id,
          changes: action.payload,
        });
      });
  },
});

export const { togglePlatformStatus, updatePlatformLocal } = platformSlice.actions;

export default platformSlice.reducer;
