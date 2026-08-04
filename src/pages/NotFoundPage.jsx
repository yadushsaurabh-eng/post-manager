import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Home } from 'lucide-react';
import './NotFoundPage.css';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container not-found-page animate-fade-in">
      <div className="not-found-card glass-card">
        <div className="not-found-icon-circle">
          <AlertCircle size={48} className="not-found-icon" />
        </div>
        <h1 className="not-found-code">404</h1>
        <h2 className="not-found-title">Page Not Found</h2>
        <p className="not-found-desc">
          The dashboard route you requested does not exist or has been moved.
        </p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          <Home size={18} />
          <span>Return to Dashboard</span>
        </button>
      </div>
    </div>
  );
};
