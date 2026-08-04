import React from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import {
  selectSearchQuery,
  selectPlatformFilter,
  selectStatusFilter,
  selectSortBy,
  selectInfiniteScroll,
} from './postsSelectors';
import {
  setSearchQuery,
  setPlatformFilter,
  setStatusFilter,
  setSortBy,
  toggleInfiniteScroll,
  resetFilters,
} from './postsSlice';
import { selectAllPlatforms } from '../platforms/platformSelectors';
import { selectViewMode } from '../ui/uiSelectors';
import { setViewMode } from '../ui/uiSlice';
import {
  Search,
  Filter,
  ArrowUpDown,
  LayoutGrid,
  List,
  RotateCcw,
  Infinity as InfinityIcon,
} from 'lucide-react';
import './PostFilterBar.css';

export const PostFilterBar = () => {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector(selectSearchQuery);
  const platformFilter = useAppSelector(selectPlatformFilter);
  const statusFilter = useAppSelector(selectStatusFilter);
  const sortBy = useAppSelector(selectSortBy);
  const viewMode = useAppSelector(selectViewMode);
  const infiniteScroll = useAppSelector(selectInfiniteScroll);
  const platforms = useAppSelector(selectAllPlatforms);

  return (
    <div className="filter-bar-container glass-card">
      <div className="filter-row top-row">
        <div className="search-input-wrapper">
          <Search size={18} className="filter-search-icon" />
          <input
            type="text"
            className="filter-search-input"
            placeholder="Search by title, content or platform..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          />
        </div>

        <div className="status-tabs">
          {['all', 'published', 'draft', 'scheduled'].map((status) => (
            <button
              key={status}
              className={`status-tab ${statusFilter === status ? 'active' : ''}`}
              onClick={() => dispatch(setStatusFilter(status))}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-row bottom-row">
        <div className="filter-controls">
          <div className="select-wrapper">
            <Filter size={15} className="select-icon" />
            <select
              value={platformFilter}
              onChange={(e) => dispatch(setPlatformFilter(e.target.value))}
              className="filter-select"
            >
              <option value="all">All Platforms</option>
              {platforms.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="select-wrapper">
            <ArrowUpDown size={15} className="select-icon" />
            <select
              value={sortBy}
              onChange={(e) => dispatch(setSortBy(e.target.value))}
              className="filter-select"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Alphabetical (Title)</option>
            </select>
          </div>

          {(searchQuery || platformFilter !== 'all' || statusFilter !== 'all' || sortBy !== 'newest') && (
            <button
              className="btn-reset-filters"
              onClick={() => dispatch(resetFilters())}
              title="Reset all filters"
            >
              <RotateCcw size={14} /> Reset
            </button>
          )}
        </div>

        <div className="view-toggle-controls">
          <button
            className={`btn-infinite-toggle ${infiniteScroll ? 'active' : ''}`}
            onClick={() => dispatch(toggleInfiniteScroll())}
            title={infiniteScroll ? 'Disable Infinite Scroll' : 'Enable Infinite Scroll'}
          >
            <InfinityIcon size={16} />
            <span>{infiniteScroll ? 'Infinite' : 'Paginated'}</span>
          </button>

          <div className="view-mode-group">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => dispatch(setViewMode('grid'))}
              title="Grid View"
            >
              <LayoutGrid size={17} />
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => dispatch(setViewMode('list'))}
              title="List View"
            >
              <List size={17} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
