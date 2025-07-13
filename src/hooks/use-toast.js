import { useState, useCallback } from 'react';

const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback(({ title, description, variant = 'default' }) => {
    const id = Date.now();
    const newToast = { id, title, description, variant };
    
    setToasts(current => [...current, newToast]);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      setToasts(current => current.filter(toast => toast.id !== id));
    }, 3000);
  }, []);

  const dismiss = useCallback((id) => {
    setToasts(current => current.filter(toast => toast.id !== id));
  }, []);

  return { toast, toasts, dismiss };
};

export { useToast };