import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { fetchPlatforms } from '../features/platforms/platformSlice';
import { selectAllPlatforms, selectConnectedPlatformsCount } from '../features/platforms/platformSelectors';
import { PlatformCard } from '../features/platforms/PlatformCard';
import { Share2, Plus } from 'lucide-react';
import './PlatformsPage.css';

export const PlatformsPage = () => {
  const dispatch = useAppDispatch();
  const platforms = useAppSelector(selectAllPlatforms);
  const connectedCount = useAppSelector(selectConnectedPlatformsCount);

  useEffect(() => {
    dispatch(fetchPlatforms());
  }, [dispatch]);

  return (
    <div className="page-container platforms-page animate-fade-in">
      <div className="page-header">
        <div className="page-header-text">
          <div className="page-title-row">
            <Share2 size={24} className="page-title-icon" />
            <h2>Social Platforms</h2>
            <span className="count-badge">{connectedCount} of {platforms.length} Connected</span>
          </div>
          <p className="page-subtitle">
            Manage your connected social accounts, update brand parameters, and toggle streaming sync.
          </p>
        </div>
      </div>

      <div className="platforms-grid">
        {platforms.map((platform) => (
          <PlatformCard key={platform.id} platform={platform} />
        ))}
      </div>
    </div>
  );
};
