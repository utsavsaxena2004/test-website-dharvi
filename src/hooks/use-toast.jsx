
import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback(({ title, description, variant = 'default' }) => {
    const id = Date.now() + Math.random(); // Make ID more unique
    const newToast = { id, title, description, variant };
    
    console.log('Adding toast:', newToast);
    setToasts(current => [...current, newToast]);
    
    // Auto remove after 5 seconds (increased from 3)
    setTimeout(() => {
      console.log('Auto-removing toast:', id);
      setToasts(current => current.filter(toast => toast.id !== id));
    }, 5000);
  }, []);

  const dismiss = useCallback((id) => {
    console.log('Manually dismissing toast:', id);
    setToasts(current => current.filter(toast => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast, toasts, dismiss }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
