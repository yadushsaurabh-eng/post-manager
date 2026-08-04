import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { selectPostModalState } from '../ui/uiSelectors';
import { closePostModal, addToast } from '../ui/uiSlice';
import { createPost, updatePost } from './postsSlice';
import { selectAllPlatforms } from '../platforms/platformSelectors';
import { X, Sparkles, Send, FileText, Calendar } from 'lucide-react';
import './PostFormModal.css';

export const PostFormModal = () => {
  const dispatch = useAppDispatch();
  const modalState = useAppSelector(selectPostModalState);
  const platforms = useAppSelector(selectAllPlatforms);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    platform: 'linkedin',
    status: 'published',
    scheduledFor: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (modalState.postToEdit) {
      setFormData({
        title: modalState.postToEdit.title || '',
        content: modalState.postToEdit.content || '',
        platform: modalState.postToEdit.platform || 'linkedin',
        status: modalState.postToEdit.status || 'published',
        scheduledFor: modalState.postToEdit.scheduledFor || '',
      });
    } else {
      setFormData({
        title: '',
        content: '',
        platform: platforms[0]?.id || 'linkedin',
        status: 'published',
        scheduledFor: '',
      });
    }
    setErrors({});
  }, [modalState, platforms]);

  if (!modalState.isOpen) return null;

  const isEdit = modalState.mode === 'edit';

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Title is required';
    if (!formData.content.trim()) errs.content = 'Post content is required';
    if (formData.status === 'scheduled' && !formData.scheduledFor) {
      errs.scheduledFor = 'Schedule date and time are required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (isEdit) {
      const updatedData = {
        ...modalState.postToEdit,
        ...formData,
      };
      dispatch(updatePost(updatedData));
      dispatch(addToast({ message: 'Post updated successfully!', type: 'success' }));
    } else {
      const newPostData = {
        ...formData,
        id: `post-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      dispatch(createPost(newPostData));
      dispatch(addToast({ message: 'New post created successfully!', type: 'success' }));
    }

    dispatch(closePostModal());
  };

  return (
    <div className="modal-backdrop animate-fade-in" onClick={() => dispatch(closePostModal())}>
      <div className="modal-card post-form-card glass-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-form-header">
          <div className="form-header-title">
            <Sparkles size={20} className="sparkle-icon" />
            <h2>{isEdit ? 'Edit Social Post' : 'Create New Post'}</h2>
          </div>
          <button className="icon-btn close-modal-btn" onClick={() => dispatch(closePostModal())}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="post-form-body">
          <div className="form-group">
            <label className="form-label">Post Title *</label>
            <input
              type="text"
              className={`form-input ${errors.title ? 'has-error' : ''}`}
              placeholder="e.g. 5 React 19 Performance Optimization Hacks"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            {errors.title && <span className="error-text">{errors.title}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Platform *</label>
              <select
                className="form-select"
                value={formData.platform}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
              >
                {platforms.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.handle})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Status *</label>
              <select
                className="form-select"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>
          </div>

          {formData.status === 'scheduled' && (
            <div className="form-group animate-fade-in">
              <label className="form-label">Scheduled Date & Time *</label>
              <input
                type="datetime-local"
                className={`form-input ${errors.scheduledFor ? 'has-error' : ''}`}
                value={formData.scheduledFor ? formData.scheduledFor.slice(0, 16) : ''}
                onChange={(e) => setFormData({ ...formData, scheduledFor: e.target.value })}
              />
              {errors.scheduledFor && <span className="error-text">{errors.scheduledFor}</span>}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Post Content *</label>
            <textarea
              className={`form-textarea ${errors.content ? 'has-error' : ''}`}
              rows={5}
              placeholder="Write your social post content here..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            />
            {errors.content && <span className="error-text">{errors.content}</span>}
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => dispatch(closePostModal())}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {formData.status === 'published' && <Send size={16} />}
              {formData.status === 'draft' && <FileText size={16} />}
              {formData.status === 'scheduled' && <Calendar size={16} />}
              <span>{isEdit ? 'Save Changes' : 'Create Post'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
