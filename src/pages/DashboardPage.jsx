import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { fetchPosts } from '../features/posts/postsSlice';
import { fetchPlatforms } from '../features/platforms/platformSlice';
import {
  selectTotalPosts,
  selectDraftPostsCount,
  selectPublishedPostsCount,
  selectScheduledPostsCount,
  selectAnalytics,
  selectPostsLoading,
} from '../features/posts/postsSelectors';
import { selectTotalPlatformsCount, selectConnectedPlatformsCount } from '../features/platforms/platformSelectors';
import { openPostModal } from '../features/ui/uiSlice';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import {
  FileText,
  FileEdit,
  Send,
  Calendar,
  Share2,
  Plus,
  BarChart2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
} from 'lucide-react';
import './DashboardPage.css';

export const DashboardPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const loading = useAppSelector(selectPostsLoading);
  const totalPosts = useAppSelector(selectTotalPosts);
  const draftPosts = useAppSelector(selectDraftPostsCount);
  const publishedPosts = useAppSelector(selectPublishedPostsCount);
  const scheduledPosts = useAppSelector(selectScheduledPostsCount);
  const totalPlatforms = useAppSelector(selectTotalPlatformsCount);
  const connectedPlatforms = useAppSelector(selectConnectedPlatformsCount);
  const analytics = useAppSelector(selectAnalytics);

  useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchPlatforms());
  }, [dispatch]);

  if (loading && totalPosts === 0) {
    return (
      <div className="page-container">
        <LoadingSkeleton type="stat" count={5} />
      </div>
    );
  }

  return (
    <div className="page-container dashboard-page animate-fade-in">
      {/* Welcome Banner */}
      <div className="welcome-banner glass-card">
        <div className="welcome-text">
          <div className="welcome-pill">
            <Sparkles size={14} /> Executive Content Hub
          </div>
          <h2>Social Media Performance Dashboard</h2>
          <p>
            Centralized state management powered by Redux Toolkit 2.0. Monitor posts, schedule feeds, and analyze platform engagement.
          </p>
        </div>
        <div className="welcome-actions">
          <button className="btn btn-primary" onClick={() => dispatch(openPostModal({ mode: 'create' }))}>
            <Plus size={18} />
            <span>Create New Post</span>
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/analytics')}>
            <BarChart2 size={18} />
            <span>View Analytics</span>
          </button>
        </div>
      </div>

      {/* Metrics Stat Cards Section */}
      <div className="stat-cards-grid">
        <div className="stat-card glass-card">
          <div className="stat-card-header">
            <div className="stat-icon-wrapper primary">
              <FileText size={22} />
            </div>
            <span className="stat-trend positive">
              <TrendingUp size={14} /> Active
            </span>
          </div>
          <div className="stat-card-body">
            <span className="stat-number">{totalPosts}</span>
            <span className="stat-label">Total Posts</span>
          </div>
        </div>

        <div className="stat-card glass-card">
          <div className="stat-card-header">
            <div className="stat-icon-wrapper published">
              <Send size={22} />
            </div>
            <span className="stat-badge published">{analytics.publishedRatio}%</span>
          </div>
          <div className="stat-card-body">
            <span className="stat-number">{publishedPosts}</span>
            <span className="stat-label">Published Posts</span>
          </div>
        </div>

        <div className="stat-card glass-card">
          <div className="stat-card-header">
            <div className="stat-icon-wrapper draft">
              <FileEdit size={22} />
            </div>
          </div>
          <div className="stat-card-body">
            <span className="stat-number">{draftPosts}</span>
            <span className="stat-label">Draft Posts</span>
          </div>
        </div>

        <div className="stat-card glass-card">
          <div className="stat-card-header">
            <div className="stat-icon-wrapper scheduled">
              <Calendar size={22} />
            </div>
          </div>
          <div className="stat-card-body">
            <span className="stat-number">{scheduledPosts}</span>
            <span className="stat-label">Scheduled Posts</span>
          </div>
        </div>

        <div className="stat-card glass-card">
          <div className="stat-card-header">
            <div className="stat-icon-wrapper platform">
              <Share2 size={22} />
            </div>
            <span className="stat-badge connected">{connectedPlatforms} Active</span>
          </div>
          <div className="stat-card-body">
            <span className="stat-number">{totalPlatforms}</span>
            <span className="stat-label">Platforms Configured</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Activity + Platform Breakdown */}
      <div className="dashboard-content-grid">
        {/* Recent Activity Section */}
        <div className="dashboard-section glass-card">
          <div className="section-header">
            <div className="section-title">
              <Clock size={18} className="title-icon" />
              <h3>Recent Posts Activity</h3>
            </div>
            <button className="btn-link" onClick={() => navigate('/posts')}>
              View All <ArrowRight size={14} />
            </button>
          </div>

          <div className="activity-list">
            {analytics.recentActivity.map((post) => (
              <div key={post.id} className="activity-item">
                <div className={`activity-status-dot ${post.status}`} />
                <div className="activity-details">
                  <h4 className="activity-title">{post.title}</h4>
                  <span className="activity-sub">
                    {post.platform} • {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <span className={`status-pill ${post.status}`}>{post.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Distribution Card */}
        <div className="dashboard-section glass-card">
          <div className="section-header">
            <div className="section-title">
              <Share2 size={18} className="title-icon" />
              <h3>Posts Per Platform</h3>
            </div>
            <button className="btn-link" onClick={() => navigate('/platforms')}>
              Manage <ArrowRight size={14} />
            </button>
          </div>

          <div className="platform-distribution-list">
            {Object.entries(analytics.postsPerPlatform).map(([platform, count]) => {
              const percentage = totalPosts ? Math.round((count / totalPosts) * 100) : 0;
              return (
                <div key={platform} className="platform-bar-item">
                  <div className="platform-bar-header">
                    <span className="platform-bar-name">{platform}</span>
                    <span className="platform-bar-count">{count} posts ({percentage}%)</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
