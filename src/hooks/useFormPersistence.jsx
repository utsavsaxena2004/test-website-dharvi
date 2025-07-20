import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for persisting form state in localStorage
 * @param {string} formId - Unique identifier for the form
 * @param {Object} initialData - Initial form data
 * @returns {Array} [formData, setFormData, clearFormData]
 */
export const useFormPersistence = (formId, initialData = {}) => {
  const storageKey = `form_${formId}`;
  
  // Get initial state from localStorage or use provided initial data
  const getInitialState = useCallback(() => {
    try {
      const savedData = localStorage.getItem(storageKey);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        // Merge saved data with initial data to handle new fields
        return { ...initialData, ...parsed };
      }
    } catch (error) {
      console.warn('Failed to parse saved form data:', error);
    }
    return initialData;
  }, [storageKey, initialData]);

  const [formData, setFormDataState] = useState(getInitialState);

  // Save to localStorage whenever formData changes
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(formData));
    } catch (error) {
      console.warn('Failed to save form data:', error);
    }
  }, [formData, storageKey]);

  // Enhanced setter that merges with existing data
  const setFormData = useCallback((updates) => {
    if (typeof updates === 'function') {
      setFormDataState(updates);
    } else {
      setFormDataState(prev => ({ ...prev, ...updates }));
    }
  }, []);

  // Clear form data from state and localStorage
  const clearFormData = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
      setFormDataState(initialData);
    } catch (error) {
      console.warn('Failed to clear form data:', error);
    }
  }, [storageKey, initialData]);

  // Update specific field
  const updateField = useCallback((fieldName, value) => {
    setFormData({ [fieldName]: value });
  }, [setFormData]);

  return {
    formData,
    setFormData,
    clearFormData,
    updateField
  };
};