import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { selectPlatformModalState } from '../ui/uiSelectors';
import { closePlatformModal, addToast } from '../ui/uiSlice';
import { updatePlatform } from './platformSlice';
import { X, Settings, Check } from 'lucide-react';
import './PlatformFormModal.css';

export const PlatformFormModal = () => {
  const dispatch = useAppDispatch();
  const modalState = useAppSelector(selectPlatformModalState);

  const [formData, setFormData] = useState({
    name: '',
    handle: '',
    followers: '',
    color: '#6366F1',
  });

  useEffect(() => {
    if (modalState.platformToEdit) {
      setFormData({
        name: modalState.platformToEdit.name || '',
        handle: modalState.platformToEdit.handle || '',
        followers: modalState.platformToEdit.followers || '',
        color: modalState.platformToEdit.color || '#6366F1',
      });
    }
  }, [modalState.platformToEdit]);

  if (!modalState.isOpen || !modalState.platformToEdit) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedPlatform = {
      ...modalState.platformToEdit,
      ...formData,
    };
    dispatch(updatePlatform(updatedPlatform));
    dispatch(addToast({ message: `${formData.name} settings updated!`, type: 'success' }));
    dispatch(closePlatformModal());
  };

  return (
    <div className="modal-backdrop animate-fade-in" onClick={() => dispatch(closePlatformModal())}>
      <div className="modal-card platform-form-card glass-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-form-header">
          <div className="form-header-title">
            <Settings size={20} className="sparkle-icon" />
            <h2>Configure {formData.name} Platform</h2>
          </div>
          <button className="icon-btn close-modal-btn" onClick={() => dispatch(closePlatformModal())}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="platform-form-body">
          <div className="form-group">
            <label className="form-label">Platform Handle</label>
            <input
              type="text"
              className="form-input"
              value={formData.handle}
              onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
              placeholder="@brand_official"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Audience / Followers Count</label>
            <input
              type="text"
              className="form-input"
              value={formData.followers}
              onChange={(e) => setFormData({ ...formData, followers: e.target.value })}
              placeholder="e.g. 125.4K"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Brand Highlight Color</label>
            <div className="color-picker-row">
              <input
                type="color"
                className="color-input"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              />
              <span className="color-hex-text">{formData.color}</span>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => dispatch(closePlatformModal())}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Check size={16} />
              <span>Save Configuration</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
