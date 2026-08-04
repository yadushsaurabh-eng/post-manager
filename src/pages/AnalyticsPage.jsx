import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { fetchPosts } from '../features/posts/postsSlice';
import { fetchPlatforms } from '../features/platforms/platformSlice';
import { selectAnalytics } from '../features/posts/postsSelectors';
import {
  BarChart3,
  ThumbsUp,
  Share2,
  MessageSquare,
  Sparkles,
  PieChart,
  Activity,
  Layers,
  Send,
  FileEdit,
  Calendar,
} from 'lucide-react';
import './AnalyticsPage.css';

export const AnalyticsPage = () => {
  const dispatch = useAppDispatch();
  // Computed using Reselect createSelector memoization - zero redundant state stored in Redux!
  const analytics = useAppSelector(selectAnalytics);

  useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchPlatforms());
  }, [dispatch]);

  return (
    <div className="page-container analytics-page animate-fade-in">
      <div className="page-header">
        <div className="page-header-text">
          <div className="page-title-row">
            <BarChart3 size={24} className="page-title-icon" />
            <h2>Content Analytics & Intelligence</h2>
            <span className="count-badge selector-badge">
              <Sparkles size={13} /> Derived via Reselect
            </span>
          </div>
          <p className="page-subtitle">
            All analytics metrics are computed dynamically on-the-fly using memoized Redux Toolkit selectors without mutating global state.
          </p>
        </div>
      </div>

      {/* Overview Metric Bar */}
      <div className="analytics-metrics-grid">
        <div className="metric-card glass-card">
          <div className="metric-header">
            <ThumbsUp size={20} className="metric-icon likes" />
            <span className="metric-tag">Total Engagement</span>
          </div>
          <span className="metric-value">{analytics.totalLikes.toLocaleString()}</span>
          <span className="metric-sub">Likes & Reactions</span>
        </div>

        <div className="metric-card glass-card">
          <div className="metric-header">
            <Share2 size={20} className="metric-icon shares" />
            <span className="metric-tag">Amplification</span>
          </div>
          <span className="metric-value">{analytics.totalShares.toLocaleString()}</span>
          <span className="metric-sub">Total Shares</span>
        </div>

        <div className="metric-card glass-card">
          <div className="metric-header">
            <MessageSquare size={20} className="metric-icon comments" />
            <span className="metric-tag">Audience Voice</span>
          </div>
          <span className="metric-value">{analytics.totalComments.toLocaleString()}</span>
          <span className="metric-sub">Total Comments</span>
        </div>

        <div className="metric-card glass-card">
          <div className="metric-header">
            <Layers size={20} className="metric-icon ratio" />
            <span className="metric-tag">Publishing Velocity</span>
          </div>
          <span className="metric-value">{analytics.publishedRatio}%</span>
          <span className="metric-sub">Published to Total Ratio</span>
        </div>
      </div>

      {/* Main Analytics Panels Grid */}
      <div className="analytics-content-grid">
        {/* Status Distribution Panel */}
        <div className="analytics-panel glass-card">
          <div className="panel-header">
            <PieChart size={18} className="panel-icon" />
            <h3>Post Status Breakdown</h3>
          </div>

          <div className="status-progress-grid">
            <div className="status-box published">
              <div className="status-box-header">
                <Send size={16} />
                <span>Published</span>
              </div>
              <span className="status-box-count">{analytics.publishedCount}</span>
              <div className="progress-track">
                <div
                  className="progress-fill published"
                  style={{
                    width: `${analytics.totalPosts ? (analytics.publishedCount / analytics.totalPosts) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            <div className="status-box draft">
              <div className="status-box-header">
                <FileEdit size={16} />
                <span>Drafts</span>
              </div>
              <span className="status-box-count">{analytics.draftCount}</span>
              <div className="progress-track">
                <div
                  className="progress-fill draft"
                  style={{
                    width: `${analytics.totalPosts ? (analytics.draftCount / analytics.totalPosts) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            <div className="status-box scheduled">
              <div className="status-box-header">
                <Calendar size={16} />
                <span>Scheduled</span>
              </div>
              <span className="status-box-count">{analytics.scheduledCount}</span>
              <div className="progress-track">
                <div
                  className="progress-fill scheduled"
                  style={{
                    width: `${analytics.totalPosts ? (analytics.scheduledCount / analytics.totalPosts) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Platform Share Breakdown */}
        <div className="analytics-panel glass-card">
          <div className="panel-header">
            <Share2 size={18} className="panel-icon" />
            <h3>Posts Per Platform Distribution</h3>
          </div>

          <div className="platform-analytics-list">
            {Object.entries(analytics.postsPerPlatform).map(([platform, count]) => {
              const pct = analytics.totalPosts ? Math.round((count / analytics.totalPosts) * 100) : 0;
              return (
                <div key={platform} className="platform-analytic-row">
                  <div className="platform-label-row">
                    <span className="platform-name-text">{platform}</span>
                    <span className="platform-pct">{count} Posts ({pct}%)</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill platform" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Activity Timeline Panel */}
      <div className="analytics-panel glass-card">
        <div className="panel-header">
          <Activity size={18} className="panel-icon" />
          <h3>Recent Content Stream & Timelines</h3>
        </div>

        <div className="timeline-list">
          {analytics.recentActivity.map((post) => (
            <div key={post.id} className="timeline-item">
              <div className="timeline-badge" />
              <div className="timeline-content">
                <div className="timeline-title-row">
                  <h4 className="timeline-title">{post.title}</h4>
                  <span className={`status-pill ${post.status}`}>{post.status}</span>
                </div>
                <p className="timeline-snippet">{post.content}</p>
                <div className="timeline-meta">
                  <span>Platform: <strong>{post.platform}</strong></span>
                  <span>Created: <strong>{new Date(post.createdAt).toLocaleDateString()}</strong></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
