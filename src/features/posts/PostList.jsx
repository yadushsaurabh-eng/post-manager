import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import {
  selectPaginatedPosts,
  selectPostsLoading,
  selectPostsError,
  selectCurrentPage,
  selectTotalPages,
  selectInfiniteScroll,
  selectFilteredAndSortedPosts,
} from './postsSelectors';
import { setCurrentPage } from './postsSlice';
import { openPostModal } from '../ui/uiSlice';
import { selectViewMode } from '../ui/uiSelectors';
import { PostCard } from './PostCard';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { Pagination } from '../../components/common/Pagination';
import { FileSearch, Plus } from 'lucide-react';
import './PostList.css';

export const PostList = () => {
  const dispatch = useAppDispatch();
  const posts = useAppSelector(selectPaginatedPosts);
  const totalFilteredPosts = useAppSelector(selectFilteredAndSortedPosts);
  const loading = useAppSelector(selectPostsLoading);
  const error = useAppSelector(selectPostsError);
  const currentPage = useAppSelector(selectCurrentPage);
  const totalPages = useAppSelector(selectTotalPages);
  const viewMode = useAppSelector(selectViewMode);
  const infiniteScroll = useAppSelector(selectInfiniteScroll);

  // Infinite Scroll Listener
  useEffect(() => {
    if (!infiniteScroll) return;

    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 100 >=
        document.documentElement.offsetHeight
      ) {
        if (currentPage < totalPages && !loading) {
          dispatch(setCurrentPage(currentPage + 1));
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [infiniteScroll, currentPage, totalPages, loading, dispatch]);

  if (loading && posts.length === 0) {
    return <LoadingSkeleton type="card" count={6} />;
  }

  if (error) {
    return (
      <div className="error-card glass-card">
        <h3>Unable to load posts</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="empty-posts-card glass-card animate-fade-in">
        <div className="empty-icon-wrapper">
          <FileSearch size={36} className="empty-icon" />
        </div>
        <h3>No social posts found</h3>
        <p>Try adjusting your search query, filters, or create a brand new post.</p>
        <button
          className="btn btn-primary"
          onClick={() => dispatch(openPostModal({ mode: 'create' }))}
        >
          <Plus size={18} />
          <span>Create Post</span>
        </button>
      </div>
    );
  }

  return (
    <div className="post-list-container">
      <div className={`posts-grid-wrapper mode-${viewMode}`}>
        {posts.map((post) => (
          <PostCard key={post.id} post={post} viewMode={viewMode} />
        ))}
      </div>

      {!infiniteScroll && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => dispatch(setCurrentPage(page))}
        />
      )}

      {infiniteScroll && currentPage < totalPages && (
        <div className="infinite-load-more">
          <button
            className="btn btn-secondary"
            onClick={() => dispatch(setCurrentPage(currentPage + 1))}
          >
            Load More Posts ({totalFilteredPosts.length - posts.length} remaining)
          </button>
        </div>
      )}
    </div>
  );
};
