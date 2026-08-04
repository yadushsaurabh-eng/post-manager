import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { fetchPosts } from '../features/posts/postsSlice';
import { fetchPlatforms } from '../features/platforms/platformSlice';
import { selectFilteredAndSortedPosts, selectTotalPosts } from '../features/posts/postsSelectors';
import { openPostModal } from '../features/ui/uiSlice';
import { PostFilterBar } from '../features/posts/PostFilterBar';
import { PostList } from '../features/posts/PostList';
import { FileText, Plus } from 'lucide-react';
import './PostsPage.css';

export const PostsPage = () => {
  const dispatch = useAppDispatch();
  const totalPosts = useAppSelector(selectTotalPosts);
  const filteredPosts = useAppSelector(selectFilteredAndSortedPosts);

  useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchPlatforms());
  }, [dispatch]);

  return (
    <div className="page-container posts-page animate-fade-in">
      <div className="page-header">
        <div className="page-header-text">
          <div className="page-title-row">
            <FileText size={24} className="page-title-icon" />
            <h2>Social Media Content</h2>
            <span className="count-badge">{filteredPosts.length} of {totalPosts} Posts</span>
          </div>
          <p className="page-subtitle">
            Search, filter, edit, schedule and manage social media posts across all platforms.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => dispatch(openPostModal({ mode: 'create' }))}
        >
          <Plus size={18} />
          <span>Add New Post</span>
        </button>
      </div>

      <PostFilterBar />
      <PostList />
    </div>
  );
};
