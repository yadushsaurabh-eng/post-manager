import React from 'react';
import './LoadingSkeleton.css';

export const LoadingSkeleton = ({ type = 'card', count = 3 }) => {
  const items = Array.from({ length: count });

  if (type === 'card') {
    return (
      <div className="skeleton-grid">
        {items.map((_, index) => (
          <div key={index} className="skeleton-card glass-card">
            <div className="skeleton-header">
              <div className="skeleton-badge shimmer" />
              <div className="skeleton-badge shimmer" />
            </div>
            <div className="skeleton-title shimmer" />
            <div className="skeleton-text shimmer" />
            <div className="skeleton-text short shimmer" />
            <div className="skeleton-footer">
              <div className="skeleton-btn shimmer" />
              <div className="skeleton-btn shimmer" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'stat') {
    return (
      <div className="skeleton-stat-grid">
        {items.map((_, index) => (
          <div key={index} className="skeleton-stat-card glass-card">
            <div className="skeleton-icon shimmer" />
            <div className="skeleton-stat-body">
              <div className="skeleton-text short shimmer" />
              <div className="skeleton-number shimmer" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="skeleton-container">
      {items.map((_, index) => (
        <div key={index} className="skeleton-line shimmer" />
      ))}
    </div>
  );
};
