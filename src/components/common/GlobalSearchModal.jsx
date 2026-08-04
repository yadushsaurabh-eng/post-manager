import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { selectIsGlobalSearchOpen } from '../../features/ui/uiSelectors';
import { closeGlobalSearch, openPostModal } from '../../features/ui/uiSlice';
import { selectAllPosts } from '../../features/posts/postsSelectors';
import { selectAllPlatforms } from '../../features/platforms/platformSelectors';
import { Search, X, FileText, Share2, ArrowRight } from 'lucide-react';
import './GlobalSearchModal.css';

export const GlobalSearchModal = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isOpen = useAppSelector(selectIsGlobalSearchOpen);
  const posts = useAppSelector(selectAllPosts);
  const platforms = useAppSelector(selectAllPlatforms);

  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    if (!query.trim()) return { posts: [], platforms: [] };

    const q = query.toLowerCase().trim();
    const matchedPosts = posts.filter(
      (p) => p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q)
    );
    const matchedPlatforms = platforms.filter(
      (p) => p.name.toLowerCase().includes(q) || p.handle.toLowerCase().includes(q)
    );

    return { posts: matchedPosts, platforms: matchedPlatforms };
  }, [query, posts, platforms]);

  if (!isOpen) return null;

  const handleSelectPost = (post) => {
    dispatch(closeGlobalSearch());
    dispatch(openPostModal({ mode: 'edit', post }));
    navigate('/posts');
  };

  const handleSelectPlatform = () => {
    dispatch(closeGlobalSearch());
    navigate('/platforms');
  };

  return (
    <div className="modal-backdrop animate-fade-in" onClick={() => dispatch(closeGlobalSearch())}>
      <div className="modal-card search-modal-card glass-card" onClick={(e) => e.stopPropagation()}>
        <div className="search-input-header">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            className="global-search-input"
            placeholder="Type to search posts, content, or platforms..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <button className="icon-btn search-close-btn" onClick={() => dispatch(closeGlobalSearch())}>
            <X size={18} />
          </button>
        </div>

        <div className="search-results-body">
          {!query.trim() && (
            <div className="search-prompt">
              <p>Type keywords to search across posts and social channels</p>
              <div className="quick-hints">
                <span>Try searching: <strong>"React"</strong>, <strong>"LinkedIn"</strong>, <strong>"Redux"</strong></span>
              </div>
            </div>
          )}

          {query.trim() && searchResults.posts.length === 0 && searchResults.platforms.length === 0 && (
            <div className="search-empty">
              <p>No results matching "{query}"</p>
            </div>
          )}

          {searchResults.platforms.length > 0 && (
            <div className="result-group">
              <h4 className="group-title">
                <Share2 size={15} /> Platforms ({searchResults.platforms.length})
              </h4>
              <div className="results-list">
                {searchResults.platforms.map((platform) => (
                  <div
                    key={platform.id}
                    className="result-item"
                    onClick={handleSelectPlatform}
                  >
                    <span className="platform-indicator" style={{ background: platform.color }} />
                    <div className="result-info">
                      <span className="result-title">{platform.name}</span>
                      <span className="result-sub">{platform.handle}</span>
                    </div>
                    <ArrowRight size={16} className="arrow-icon" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {searchResults.posts.length > 0 && (
            <div className="result-group">
              <h4 className="group-title">
                <FileText size={15} /> Posts ({searchResults.posts.length})
              </h4>
              <div className="results-list">
                {searchResults.posts.map((post) => (
                  <div
                    key={post.id}
                    className="result-item"
                    onClick={() => handleSelectPost(post)}
                  >
                    <div className="result-info">
                      <span className="result-title">{post.title}</span>
                      <span className="result-sub">{post.content.slice(0, 70)}...</span>
                    </div>
                    <span className={`status-pill ${post.status}`}>{post.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
