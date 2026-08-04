import React from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { togglePlatformStatus } from './platformSlice';
import { selectPostsByPlatform } from '../posts/postsSelectors';
import { openPlatformModal, addToast } from '../ui/uiSlice';
import {
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  Share2,
  Users,
  FileText,
  Power,
  Settings,
} from 'lucide-react';
import './PlatformCard.css';

const platformIconMap = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  twitter: Twitter,
  youtube: Youtube,
};

export const PlatformCard = ({ platform }) => {
  const dispatch = useAppDispatch();
  const platformPosts = useAppSelector((state) => selectPostsByPlatform(state, platform.id));

  const IconComponent = platformIconMap[platform.id?.toLowerCase()] || Share2;
  const isConnected = platform.status === 'connected';

  const handleToggleStatus = () => {
    dispatch(togglePlatformStatus(platform.id));
    dispatch(
      addToast({
        message: `${platform.name} status updated to ${!isConnected ? 'Connected' : 'Disconnected'}`,
        type: !isConnected ? 'success' : 'info',
      })
    );
  };

  const handleEdit = () => {
    dispatch(openPlatformModal(platform));
  };

  return (
    <div className={`platform-card glass-card animate-fade-in ${!isConnected ? 'disconnected' : ''}`}>
      <div className="platform-card-header">
        <div className="platform-brand-info">
          <div className="platform-icon-circle" style={{ backgroundColor: `${platform.color}20`, color: platform.color }}>
            <IconComponent size={22} />
          </div>
          <div className="platform-names">
            <h3 className="platform-title">{platform.name}</h3>
            <span className="platform-handle">{platform.handle}</span>
          </div>
        </div>

        <span className={`connection-badge ${platform.status}`}>
          <span className="dot" />
          {platform.status}
        </span>
      </div>

      <div className="platform-metrics-row">
        <div className="metric-box">
          <Users size={16} className="metric-icon" />
          <div className="metric-info">
            <span className="metric-value">{platform.followers || '0'}</span>
            <span className="metric-label">Audience</span>
          </div>
        </div>

        <div className="metric-box">
          <FileText size={16} className="metric-icon" />
          <div className="metric-info">
            <span className="metric-value">{platformPosts.length}</span>
            <span className="metric-label">Total Posts</span>
          </div>
        </div>
      </div>

      <div className="platform-card-footer">
        <button className="icon-btn edit-platform-btn" onClick={handleEdit} title="Configure Platform Settings">
          <Settings size={16} />
        </button>

        <button
          className={`btn-toggle-connection ${isConnected ? 'connected' : 'disconnected'}`}
          onClick={handleToggleStatus}
        >
          <Power size={15} />
          <span>{isConnected ? 'Disconnect' : 'Connect Account'}</span>
        </button>
      </div>
    </div>
  );
};
