import React from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { selectConfirmModalState } from '../../features/ui/uiSelectors';
import { closeConfirmModal } from '../../features/ui/uiSlice';
import { AlertTriangle, X } from 'lucide-react';
import './ConfirmModal.css';

export const ConfirmModal = ({ onConfirm }) => {
  const dispatch = useAppDispatch();
  const modalState = useAppSelector(selectConfirmModalState);

  if (!modalState.isOpen) return null;

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm(modalState.payload);
    }
    dispatch(closeConfirmModal());
  };

  return (
    <div className="modal-backdrop animate-fade-in" onClick={() => dispatch(closeConfirmModal())}>
      <div className="modal-card glass-card confirm-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-header">
          <div className="confirm-icon-wrapper">
            <AlertTriangle size={24} className="confirm-alert-icon" />
          </div>
          <button className="icon-btn modal-close" onClick={() => dispatch(closeConfirmModal())}>
            <X size={18} />
          </button>
        </div>

        <div className="confirm-body">
          <h3 className="confirm-title">{modalState.title}</h3>
          <p className="confirm-message">{modalState.message}</p>
        </div>

        <div className="confirm-footer">
          <button className="btn btn-secondary" onClick={() => dispatch(closeConfirmModal())}>
            Cancel
          </button>
          <button
            className={`btn ${modalState.confirmVariant === 'danger' ? 'btn-danger' : 'btn-primary'}`}
            onClick={handleConfirm}
          >
            {modalState.confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
