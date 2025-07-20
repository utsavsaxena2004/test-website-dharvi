import { useState, useEffect } from 'react';
import { supabaseService } from '../services/supabaseService';

export const useSiteSettings = () => {
  const [siteSettings, setSiteSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSiteSettings = async () => {
      try {
        setLoading(true);
        const settings = await supabaseService.getSiteSettings();
        setSiteSettings(settings);
        
        // Update document title and meta tags
        if (settings) {
          document.title = `${settings.site_name || 'Dharika'} - ${settings.site_description || 'Exquisite Traditional Indian Fashion'}`;
          
          // Update meta description
          const metaDescription = document.querySelector('meta[name="description"]');
          if (metaDescription) {
            metaDescription.content = settings.site_description || 'Discover exquisite traditional Indian fashion';
          }
          
          // Update Open Graph title
          const ogTitle = document.querySelector('meta[property="og:title"]');
          if (ogTitle) {
            ogTitle.content = `${settings.site_name || 'Dharika'} - ${settings.site_description || 'Exquisite Traditional Indian Fashion'}`;
          }
          
          // Update Open Graph description
          const ogDescription = document.querySelector('meta[property="og:description"]');
          if (ogDescription) {
            ogDescription.content = settings.site_description || 'Discover exquisite traditional Indian fashion';
          }
        }
        
        setError(null);
      } catch (error) {
        console.error('Error fetching site settings:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSiteSettings();
  }, []);

  // Helper function to parse JSON content
  const parseJsonContent = (content) => {
    try {
      return typeof content === 'string' ? JSON.parse(content) : content;
    } catch (error) {
      console.error('Error parsing JSON content:', error);
      return null;
    }
  };

  // Helper functions to get specific content
  const getHeroContent = () => parseJsonContent(siteSettings?.hero_content) || [];
  const getFooterContent = () => parseJsonContent(siteSettings?.footer_content) || {};
  const getPromotionalMessages = () => parseJsonContent(siteSettings?.promotional_messages) || [];

  return {
    siteSettings,
    loading,
    error,
    getHeroContent,
    getFooterContent,
    getPromotionalMessages
  };
};