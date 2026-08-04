import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useRedux';
import { selectTotalPosts, selectDraftPostsCount } from '../../features/posts/postsSelectors';
import { selectConnectedPlatformsCount } from '../../features/platforms/platformSelectors';
import { selectSidebarOpen } from '../../features/ui/uiSelectors';
import {
  LayoutDashboard,
  FileText,
  Share2,
  BarChart3,
  Sparkles,
  Zap,
} from 'lucide-react';
import './Sidebar.css';

export const Sidebar = () => {
  const sidebarOpen = useAppSelector(selectSidebarOpen);
  const totalPosts = useAppSelector(selectTotalPosts);
  const draftPosts = useAppSelector(selectDraftPostsCount);
  const connectedPlatforms = useAppSelector(selectConnectedPlatformsCount);

  return (
    <aside className={`sidebar-container ${sidebarOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="logo-icon">
            <Sparkles size={20} className="sparkle-icon" />
          </div>
          <div className="logo-text">
            <span className="brand-name">PostManager</span>
            <span className="brand-badge">RTK 2.0</span>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">MAIN MENU</div>
        
        <NavLink
          to="/"
          end
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <LayoutDashboard size={19} />
          <span className="nav-label">Dashboard</span>
        </NavLink>

        <NavLink
          to="/posts"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <FileText size={19} />
          <span className="nav-label">Posts</span>
          <div className="nav-badges">
            {draftPosts > 0 && <span className="badge badge-warning" title={`${draftPosts} Drafts`}>{draftPosts}</span>}
            <span className="badge badge-primary">{totalPosts}</span>
          </div>
        </NavLink>

        <NavLink
          to="/platforms"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <Share2 size={19} />
          <span className="nav-label">Platforms</span>
          <span className="badge badge-success">{connectedPlatforms}</span>
        </NavLink>

        <NavLink
          to="/analytics"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <BarChart3 size={19} />
          <span className="nav-label">Analytics</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="system-status-card glass-card">
          <div className="status-header">
            <Zap size={15} className="status-icon" />
            <span>Redux Normalized</span>
          </div>
          <p className="status-desc">State synchronized with createEntityAdapter & Reselect</p>
        </div>
      </div>
    </aside>
  );
};
