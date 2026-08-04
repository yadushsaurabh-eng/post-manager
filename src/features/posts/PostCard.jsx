import React, { useMemo, useCallback } from 'react';
import { useAppDispatch } from '../../hooks/useRedux';
import {
  publishPost,
  draftPost,
  schedulePost,
} from './postsSlice';
import { openPostModal, openConfirmModal, addToast, setLastDeletedPost } from '../ui/uiSlice';
import {
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  Share2,
  Calendar,
  Clock,
  CheckCircle2,
  FileEdit,
  Trash2,
  Send,
  FileText,
} from 'lucide-react';
import './PostCard.css';

const platformIconMap = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  twitter: Twitter,
  youtube: Youtube,
};

const platformColorMap = {
  facebook: '#1877F2',
  instagram: '#E4405F',
  linkedin: '#0A66C2',
  twitter: '#1DA1F2',
  youtube: '#FF0000',
};

export const PostCardComponent = ({ post, viewMode = 'grid' }) => {
  const dispatch = useAppDispatch();

  // Memoized formatted date
  const formattedDate = useMemo(() => {
    if (!post.createdAt) return '';
    const date = new Date(post.createdAt);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }, [post.createdAt]);

  // Memoized Platform details
  const platformMeta = useMemo(() => {
    const IconComponent = platformIconMap[post.platform?.toLowerCase()] || Share2;
    const color = platformColorMap[post.platform?.toLowerCase()] || 'var(--primary)';
    return { IconComponent, color };
  }, [post.platform]);

  // Callbacks for actions to maintain stable function references
  const handleEdit = useCallback(() => {
    dispatch(openPostModal({ mode: 'edit', post }));
  }, [dispatch, post]);

  const handleDeleteTrigger = useCallback(() => {
    dispatch(
      openConfirmModal({
        title: 'Delete Post',
        message: `Are you sure you want to delete "${post.title}"? This action can be undone.`,
        confirmText: 'Delete Post',
        confirmVariant: 'danger',
        payload: post,
      })
    );
  }, [dispatch, post]);

  const handlePublish = useCallback(() => {
    dispatch(publishPost(post.id));
    dispatch(addToast({ message: 'Post published successfully!', type: 'success' }));
  }, [dispatch, post.id]);

  const handleDraft = useCallback(() => {
    dispatch(draftPost(post.id));
    dispatch(addToast({ message: 'Post moved to drafts', type: 'info' }));
  }, [dispatch, post.id]);

  const handleSchedule = useCallback(() => {
    dispatch(schedulePost({ id: post.id, scheduledFor: new Date(Date.now() + 86400000).toISOString() }));
    dispatch(addToast({ message: 'Post scheduled for tomorrow!', type: 'info' }));
  }, [dispatch, post.id]);

  const { IconComponent, color } = platformMeta;

  if (viewMode === 'list') {
    return (
      <div className="post-card-list glass-card animate-fade-in">
        <div className="platform-tag" style={{ color }}>
          <IconComponent size={18} />
          <span className="platform-name">{post.platform}</span>
        </div>

        <div className="post-list-main">
          <h3 className="post-title">{post.title}</h3>
          <p className="post-snippet">{post.content}</p>
        </div>

        <div className="post-list-meta">
          <span className={`status-badge ${post.status}`}>
            {post.status}
          </span>
          <span className="post-date">
            <Clock size={13} /> {formattedDate}
          </span>
        </div>

        <div className="post-actions">
          {post.status !== 'published' && (
            <button className="action-btn publish" onClick={handlePublish} title="Publish Now">
              <Send size={15} />
            </button>
          )}
          {post.status !== 'draft' && (
            <button className="action-btn draft" onClick={handleDraft} title="Convert to Draft">
              <FileText size={15} />
            </button>
          )}
          {post.status !== 'scheduled' && (
            <button className="action-btn schedule" onClick={handleSchedule} title="Schedule Post">
              <Calendar size={15} />
            </button>
          )}
          <button className="action-btn edit" onClick={handleEdit} title="Edit Post">
            <FileEdit size={15} />
          </button>
          <button className="action-btn delete" onClick={handleDeleteTrigger} title="Delete Post">
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="post-card glass-card animate-fade-in">
      <div className="post-card-header">
        <div className="platform-badge" style={{ backgroundColor: `${color}15`, color }}>
          <IconComponent size={16} />
          <span className="platform-name">{post.platform}</span>
        </div>

        <span className={`status-badge ${post.status}`}>
          {post.status === 'published' && <CheckCircle2 size={12} />}
          {post.status === 'scheduled' && <Calendar size={12} />}
          {post.status === 'draft' && <Clock size={12} />}
          {post.status}
        </span>
      </div>

      <div className="post-card-body">
        <h3 className="post-title">{post.title}</h3>
        <p className="post-content">{post.content}</p>
      </div>

      <div className="post-card-footer">
        <div className="post-meta-date">
          <Clock size={13} />
          <span>{formattedDate}</span>
        </div>

        <div className="post-actions">
          {post.status !== 'published' && (
            <button className="action-btn publish" onClick={handlePublish} title="Publish Now">
              <Send size={14} />
            </button>
          )}
          {post.status !== 'draft' && (
            <button className="action-btn draft" onClick={handleDraft} title="Draft">
              <FileText size={14} />
            </button>
          )}
          {post.status !== 'scheduled' && (
            <button className="action-btn schedule" onClick={handleSchedule} title="Schedule">
              <Calendar size={14} />
            </button>
          )}
          <button className="action-btn edit" onClick={handleEdit} title="Edit">
            <FileEdit size={14} />
          </button>
          <button className="action-btn delete" onClick={handleDeleteTrigger} title="Delete">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

// React.memo wrapping for strict re-render prevention
export const PostCard = React.memo(PostCardComponent);
