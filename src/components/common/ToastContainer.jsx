import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { selectToasts, selectLastDeletedPost } from '../../features/ui/uiSelectors';
import { removeToast, clearLastDeletedPost, addToast } from '../../features/ui/uiSlice';
import { restorePost } from '../../features/posts/postsSlice';
import { CheckCircle, AlertTriangle, Info, X, RotateCcw } from 'lucide-react';
import './ToastContainer.css';

export const ToastContainer = () => {
  const dispatch = useAppDispatch();
  const toasts = useAppSelector(selectToasts);
  const lastDeletedPost = useAppSelector(selectLastDeletedPost);

  const handleUndo = (toastId) => {
    if (lastDeletedPost) {
      dispatch(restorePost(lastDeletedPost));
      dispatch(clearLastDeletedPost());
      dispatch(addToast({ message: 'Post successfully restored!', type: 'success' }));
    }
    dispatch(removeToast(toastId));
  };

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onClose={() => dispatch(removeToast(toast.id))}
          onUndo={() => handleUndo(toast.id)}
        />
      ))}
    </div>
  );
};

const ToastItem = ({ toast, onClose, onUndo }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, toast.duration || 4000);

    return () => clearTimeout(timer);
  }, [toast, onClose]);

  const renderIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle size={18} className="toast-icon success" />;
      case 'error':
        return <AlertTriangle size={18} className="toast-icon error" />;
      default:
        return <Info size={18} className="toast-icon info" />;
    }
  };

  return (
    <div className={`toast-item glass-card toast-${toast.type}`}>
      {renderIcon()}
      <span className="toast-message">{toast.message}</span>

      {toast.undoable && (
        <button className="toast-undo-btn" onClick={onUndo}>
          <RotateCcw size={14} />
          <span>Undo</span>
        </button>
      )}

      <button className="toast-close-btn" onClick={onClose}>
        <X size={15} />
      </button>
    </div>
  );
};
