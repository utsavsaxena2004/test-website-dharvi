// State persistence utility for maintaining user data across page refreshes
class StatePersistence {
  constructor() {
    this.PREFIX = 'dharika_';
    this.keys = {
      CHECKOUT_FORM: 'checkout_form',
      CUSTOM_DESIGN_FORM: 'custom_design_form',
      CUSTOM_DESIGN_STEP: 'custom_design_step',
      CUSTOM_DESIGN_IMAGE: 'custom_design_image',
      ADMIN_TAB: 'admin_tab',
      ADMIN_PRODUCT_FORM: 'admin_product_form',
      ADMIN_CATEGORY_FORM: 'admin_category_form',
      ADMIN_SETTINGS_FORM: 'admin_settings_form',
      AUTH_FORM: 'auth_form',
      LAST_ROUTE: 'last_route',
      FORM_AUTOSAVE: 'form_autosave',
      CHECKOUT_STEP: 'checkout_step',
      SORT_FILTER_STATE: 'sort_filter_state',
      PRODUCT_QUICK_VIEW: 'product_quick_view'
    };
  }

  // Generic save/load methods
  save(key, data) {
    try {
      const fullKey = this.PREFIX + key;
      const timestamp = Date.now();
      const dataWithTimestamp = { data, timestamp };
      localStorage.setItem(fullKey, JSON.stringify(dataWithTimestamp));
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  }

  load(key, maxAge = null) {
    try {
      const fullKey = this.PREFIX + key;
      const stored = localStorage.getItem(fullKey);
      if (!stored) return null;

      const parsed = JSON.parse(stored);
      
      // Check if data is expired (if maxAge is specified)
      if (maxAge && Date.now() - parsed.timestamp > maxAge) {
        this.remove(key);
        return null;
      }
      
      return parsed.data;
    } catch (error) {
      console.warn('Failed to load from localStorage:', error);
      return null;
    }
  }

  remove(key) {
    try {
      const fullKey = this.PREFIX + key;
      localStorage.removeItem(fullKey);
    } catch (error) {
      console.warn('Failed to remove from localStorage:', error);
    }
  }

  clear() {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
    }
  }

  // Specific methods for different components
  
  // Checkout form persistence
  saveCheckoutForm(formData) {
    this.save(this.keys.CHECKOUT_FORM, formData);
  }

  loadCheckoutForm() {
    return this.load(this.keys.CHECKOUT_FORM, 24 * 60 * 60 * 1000); // 24 hours
  }

  clearCheckoutForm() {
    this.remove(this.keys.CHECKOUT_FORM);
  }

  // Checkout step persistence
  saveCheckoutStep(step) {
    this.save(this.keys.CHECKOUT_STEP, step);
  }

  loadCheckoutStep() {
    return this.load(this.keys.CHECKOUT_STEP, 24 * 60 * 60 * 1000); // 24 hours
  }

  clearCheckoutStep() {
    this.remove(this.keys.CHECKOUT_STEP);
  }

  // Custom design form persistence
  saveCustomDesignForm(formData) {
    this.save(this.keys.CUSTOM_DESIGN_FORM, formData);
  }

  loadCustomDesignForm() {
    return this.load(this.keys.CUSTOM_DESIGN_FORM, 7 * 24 * 60 * 60 * 1000); // 7 days
  }

  clearCustomDesignForm() {
    this.remove(this.keys.CUSTOM_DESIGN_FORM);
    this.remove(this.keys.CUSTOM_DESIGN_STEP);
    this.remove(this.keys.CUSTOM_DESIGN_IMAGE);
  }

  // Custom design step persistence
  saveCustomDesignStep(step) {
    this.save(this.keys.CUSTOM_DESIGN_STEP, step);
  }

  loadCustomDesignStep() {
    return this.load(this.keys.CUSTOM_DESIGN_STEP, 7 * 24 * 60 * 60 * 1000); // 7 days
  }

  // Custom design image persistence
  saveCustomDesignImage(imageData) {
    this.save(this.keys.CUSTOM_DESIGN_IMAGE, imageData);
  }

  loadCustomDesignImage() {
    return this.load(this.keys.CUSTOM_DESIGN_IMAGE, 7 * 24 * 60 * 60 * 1000); // 7 days
  }

  // Admin panel persistence
  saveAdminTab(tabValue) {
    this.save(this.keys.ADMIN_TAB, tabValue);
  }

  loadAdminTab() {
    return this.load(this.keys.ADMIN_TAB, 24 * 60 * 60 * 1000); // 24 hours
  }

  saveAdminProductForm(formData) {
    this.save(this.keys.ADMIN_PRODUCT_FORM, formData);
  }

  loadAdminProductForm() {
    return this.load(this.keys.ADMIN_PRODUCT_FORM, 60 * 60 * 1000); // 1 hour
  }

  clearAdminProductForm() {
    this.remove(this.keys.ADMIN_PRODUCT_FORM);
  }

  saveAdminCategoryForm(formData) {
    this.save(this.keys.ADMIN_CATEGORY_FORM, formData);
  }

  loadAdminCategoryForm() {
    return this.load(this.keys.ADMIN_CATEGORY_FORM, 60 * 60 * 1000); // 1 hour
  }

  clearAdminCategoryForm() {
    this.remove(this.keys.ADMIN_CATEGORY_FORM);
  }

  saveAdminSettingsForm(formData) {
    this.save(this.keys.ADMIN_SETTINGS_FORM, formData);
  }

  loadAdminSettingsForm() {
    return this.load(this.keys.ADMIN_SETTINGS_FORM, 60 * 60 * 1000); // 1 hour
  }

  clearAdminSettingsForm() {
    this.remove(this.keys.ADMIN_SETTINGS_FORM);
  }

  // Authentication form persistence
  saveAuthForm(formData) {
    // Don't save password for security
    const safeData = { ...formData };
    delete safeData.password;
    this.save(this.keys.AUTH_FORM, safeData);
  }

  loadAuthForm() {
    return this.load(this.keys.AUTH_FORM, 30 * 60 * 1000); // 30 minutes
  }

  clearAuthForm() {
    this.remove(this.keys.AUTH_FORM);
  }

  // Route persistence
  saveLastRoute(route) {
    this.save(this.keys.LAST_ROUTE, route);
  }

  loadLastRoute() {
    return this.load(this.keys.LAST_ROUTE, 24 * 60 * 60 * 1000); // 24 hours
  }

  // Generic form autosave with identifier
  saveFormAutosave(formId, formData) {
    const existingData = this.load(this.keys.FORM_AUTOSAVE) || {};
    existingData[formId] = formData;
    this.save(this.keys.FORM_AUTOSAVE, existingData);
  }

  loadFormAutosave(formId) {
    const data = this.load(this.keys.FORM_AUTOSAVE, 24 * 60 * 60 * 1000); // 24 hours
    return data ? data[formId] : null;
  }

  clearFormAutosave(formId) {
    const existingData = this.load(this.keys.FORM_AUTOSAVE) || {};
    delete existingData[formId];
    this.save(this.keys.FORM_AUTOSAVE, existingData);
  }

  // Sort and filter state persistence
  saveSortFilterState(categorySlug, state) {
    const existingData = this.load(this.keys.SORT_FILTER_STATE) || {};
    existingData[categorySlug] = state;
    this.save(this.keys.SORT_FILTER_STATE, existingData);
  }

  loadSortFilterState(categorySlug) {
    const data = this.load(this.keys.SORT_FILTER_STATE, 60 * 60 * 1000); // 1 hour
    return data ? data[categorySlug] : null;
  }

  // Product quick view state
  saveProductQuickView(productId) {
    this.save(this.keys.PRODUCT_QUICK_VIEW, productId);
  }

  loadProductQuickView() {
    return this.load(this.keys.PRODUCT_QUICK_VIEW, 10 * 60 * 1000); // 10 minutes
  }

  clearProductQuickView() {
    this.remove(this.keys.PRODUCT_QUICK_VIEW);
  }

  // User preference persistence
  saveUserPreferences(preferences) {
    this.save('user_preferences', preferences);
  }

  loadUserPreferences() {
    return this.load('user_preferences');
  }

  // Cleanup expired data
  cleanupExpiredData() {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.PREFIX)) {
          try {
            const stored = localStorage.getItem(key);
            const parsed = JSON.parse(stored);
            
            // Remove data older than 7 days
            if (Date.now() - parsed.timestamp > 7 * 24 * 60 * 60 * 1000) {
              localStorage.removeItem(key);
            }
          } catch (error) {
            // If we can't parse it, remove it
            localStorage.removeItem(key);
          }
        }
      });
    } catch (error) {
      console.warn('Failed to cleanup expired data:', error);
    }
  }

  // Initialize - run cleanup on startup
  init() {
    this.cleanupExpiredData();
  }
}

// Create singleton instance
const statePersistence = new StatePersistence();

// Initialize on module load
statePersistence.init();

export default statePersistence; 