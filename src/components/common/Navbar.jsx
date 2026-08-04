import React from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { selectTheme, selectSidebarOpen } from '../../features/ui/uiSelectors';
import {
  toggleTheme,
  toggleSidebar,
  openGlobalSearch,
  openPostModal,
} from '../../features/ui/uiSlice';
import { Sun, Moon, Search, Plus, Menu, Bell } from 'lucide-react';
import './Navbar.css';

export const Navbar = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(selectTheme);
  const sidebarOpen = useAppSelector(selectSidebarOpen);

  return (
    <header className="navbar-container">
      <div className="navbar-left">
        <button
          className="icon-btn mobile-menu-btn"
          onClick={() => dispatch(toggleSidebar())}
          title="Toggle Navigation Menu"
        >
          <Menu size={20} />
        </button>
        <div className="navbar-brand">
          <span className="brand-dot" />
          <h1 className="navbar-title">Content Manager</h1>
        </div>
      </div>

      <div className="navbar-center">
        <button
          className="search-trigger-btn"
          onClick={() => dispatch(openGlobalSearch())}
          title="Search posts and platforms (Ctrl+K)"
        >
          <Search size={16} />
          <span className="search-placeholder">Search posts, platforms...</span>
          <kbd className="keyboard-shortcut">Ctrl K</kbd>
        </button>
      </div>

      <div className="navbar-right">
        <button
          className="btn btn-primary create-post-nav-btn"
          onClick={() => dispatch(openPostModal({ mode: 'create' }))}
        >
          <Plus size={18} />
          <span>New Post</span>
        </button>

        <button
          className="icon-btn theme-toggle-btn"
          onClick={() => dispatch(toggleTheme())}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={20} className="theme-icon sun" /> : <Moon size={20} className="theme-icon moon" />}
        </button>

        <div className="notification-wrapper">
          <button className="icon-btn notification-btn" title="System Alerts">
            <Bell size={20} />
            <span className="notification-badge" />
          </button>
        </div>
      </div>
    </header>
  );
};
