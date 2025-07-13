import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import statePersistence from '../utils/statePersistence';

/**
 * Custom hook to persist route state across page refreshes
 * Saves the current route and can restore it when needed
 */
export const useRouteState = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Save current route whenever location changes
  useEffect(() => {
    // Don't save auth routes or admin routes for security
    const excludedPaths = ['/login', '/auth', '/admin'];
    const shouldSave = !excludedPaths.some(path => 
      location.pathname.startsWith(path)
    );

    if (shouldSave) {
      statePersistence.saveLastRoute({
        pathname: location.pathname,
        search: location.search,
        hash: location.hash,
        state: location.state
      });
    }
  }, [location]);

  // Function to restore last route
  const restoreLastRoute = () => {
    const lastRoute = statePersistence.loadLastRoute();
    if (lastRoute && lastRoute.pathname !== location.pathname) {
      navigate(lastRoute.pathname + lastRoute.search + lastRoute.hash, {
        state: lastRoute.state,
        replace: true
      });
      return true;
    }
    return false;
  };

  // Function to clear saved route
  const clearLastRoute = () => {
    statePersistence.remove('last_route');
  };

  return {
    restoreLastRoute,
    clearLastRoute,
    currentRoute: location
  };
};

/**
 * Custom hook for form auto-save functionality
 * Automatically saves form data as user types and restores it on page load
 */
export const useFormAutoSave = (formId, formData, setFormData, options = {}) => {
  const { 
    autoSaveDelay = 1000, // Delay before saving (debounce)
    excludeFields = [], // Fields to exclude from auto-save
    enabled = true 
  } = options;

  // Load saved data on mount
  useEffect(() => {
    if (enabled) {
      const savedData = statePersistence.loadFormAutosave(formId);
      if (savedData) {
        // Only update fields that are currently empty to avoid overriding user input
        const updatedData = { ...formData };
        Object.keys(savedData).forEach(key => {
          if (!excludeFields.includes(key) && (!formData[key] || formData[key] === '')) {
            updatedData[key] = savedData[key];
          }
        });
        setFormData(updatedData);
      }
    }
  }, [formId, enabled]); // Intentionally omitting formData and setFormData to avoid infinite loops

  // Save data with debounce
  useEffect(() => {
    if (!enabled) return;

    const timeoutId = setTimeout(() => {
      // Filter out excluded fields and empty values
      const dataToSave = {};
      Object.keys(formData).forEach(key => {
        if (!excludeFields.includes(key) && formData[key] && formData[key] !== '') {
          dataToSave[key] = formData[key];
        }
      });

      // Only save if there's actual data
      if (Object.keys(dataToSave).length > 0) {
        statePersistence.saveFormAutosave(formId, dataToSave);
      }
    }, autoSaveDelay);

    return () => clearTimeout(timeoutId);
  }, [formData, formId, autoSaveDelay, excludeFields, enabled]);

  // Function to clear saved data
  const clearSavedData = () => {
    statePersistence.clearFormAutosave(formId);
  };

  // Function to manually save current data
  const saveNow = () => {
    const dataToSave = {};
    Object.keys(formData).forEach(key => {
      if (!excludeFields.includes(key) && formData[key] && formData[key] !== '') {
        dataToSave[key] = formData[key];
      }
    });
    statePersistence.saveFormAutosave(formId, dataToSave);
  };

  return {
    clearSavedData,
    saveNow
  };
};

export default useRouteState; 