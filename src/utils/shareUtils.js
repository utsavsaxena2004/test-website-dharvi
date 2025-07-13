// Utility functions for wishlist sharing

export const generateShareableLink = (options = {}) => {
  const {
    userId,
    wishlistItems = [],
    mode = 'public', // 'public', 'private', 'collaborators'
    expiry = 'never', // 'never', '7days', '30days', '1year'
    allowEditing = false,
    customMessage = ''
  } = options;

  // Generate a unique token
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substr(2, 9);
  const shareToken = `${userId || 'anonymous'}_${timestamp}_${randomString}`;

  // Calculate totals
  const itemCount = wishlistItems.length;
  const totalValue = wishlistItems.reduce((sum, item) => {
    const price = item.products?.price || 0;
    return sum + price;
  }, 0);

  // Build query parameters
  const queryParams = new URLSearchParams({
    token: shareToken,
    mode,
    expiry,
    editable: allowEditing.toString(),
    items: itemCount.toString(),
    value: totalValue.toString()
  });

  // Add custom message if provided
  if (customMessage) {
    queryParams.append('message', encodeURIComponent(customMessage));
  }

  const baseUrl = window.location.origin;
  return `${baseUrl}/shared-wishlist?${queryParams.toString()}`;
};

export const parseShareableLink = (url) => {
  try {
    const urlObj = new URL(url);
    const params = new URLSearchParams(urlObj.search);
    
    return {
      token: params.get('token'),
      mode: params.get('mode') || 'public',
      expiry: params.get('expiry') || 'never',
      editable: params.get('editable') === 'true',
      itemCount: parseInt(params.get('items')) || 0,
      totalValue: parseInt(params.get('value')) || 0,
      customMessage: params.get('message') ? decodeURIComponent(params.get('message')) : ''
    };
  } catch (error) {
    console.error('Error parsing shareable link:', error);
    return null;
  }
};

export const generateSocialShareText = (wishlistData, platform = 'general') => {
  const { itemCount, totalValue, ownerName = 'Someone' } = wishlistData;
  
  const baseText = `Check out ${ownerName}'s wishlist at Dharika Fashion! ${itemCount} beautiful items worth ₹${totalValue.toLocaleString()} waiting to be discovered.`;
  
  switch (platform) {
    case 'whatsapp':
      return `${baseText} 🛍️✨`;
    
    case 'facebook':
      return `${baseText}\n\nDiscover amazing ethnic wear and create your own wishlist! #DharikaFashion #Wishlist #EthnicWear`;
    
    case 'twitter':
      return `${baseText} 🌟 #DharikaFashion #Wishlist #EthnicWear #Fashion`;
    
    case 'email':
      return {
        subject: `Check out my Dharika Fashion wishlist!`,
        body: `Hi!\n\n${baseText}\n\nI thought you might love these pieces as much as I do. Take a look and let me know what you think!\n\nHappy shopping! 💖\n\n✨ Shared from Dharika Fashion`
      };
    
    case 'pinterest':
      return `${baseText} Beautiful ethnic wear collection perfect for any occasion! 🌸`;
    
    default:
      return baseText;
  }
};

export const getExpiryText = (expiry) => {
  switch (expiry) {
    case '7days':
      return 'Expires in 7 days';
    case '30days':
      return 'Expires in 30 days';
    case '1year':
      return 'Expires in 1 year';
    default:
      return 'Never expires';
  }
};

export const getModeText = (mode) => {
  switch (mode) {
    case 'public':
      return 'Anyone with the link can view';
    case 'private':
      return 'Only invited people can view';
    case 'collaborators':
      return 'Others can add/remove items';
    default:
      return 'Public viewing';
  }
};

export const validateShareSettings = (settings) => {
  const { mode, expiry, allowEditing } = settings;
  
  const validModes = ['public', 'private', 'collaborators'];
  const validExpiry = ['never', '7days', '30days', '1year'];
  
  return {
    isValid: validModes.includes(mode) && validExpiry.includes(expiry),
    mode: validModes.includes(mode) ? mode : 'public',
    expiry: validExpiry.includes(expiry) ? expiry : 'never',
    allowEditing: typeof allowEditing === 'boolean' ? allowEditing : false
  };
};

// Function to copy text to clipboard with fallback
export const copyToClipboard = async (text) => {
  try {
    // Modern clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    return true;
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    return false;
  }
};

// Analytics helper for tracking shares
export const trackWishlistShare = (platform, shareData) => {
  // This would integrate with your analytics service
  console.log('Wishlist shared:', {
    platform,
    timestamp: new Date().toISOString(),
    itemCount: shareData.itemCount,
    totalValue: shareData.totalValue,
    mode: shareData.mode
  });
  
  // Example: Send to Google Analytics, Mixpanel, etc.
  // gtag('event', 'wishlist_share', {
  //   platform,
  //   item_count: shareData.itemCount,
  //   total_value: shareData.totalValue
  // });
};

// Function to generate QR code for sharing (requires qr-code library)
export const generateQRCode = async (url, options = {}) => {
  try {
    // This would require installing 'qrcode' package
    // const QRCode = require('qrcode');
    // return await QRCode.toDataURL(url, {
    //   width: options.width || 200,
    //   margin: options.margin || 2,
    //   color: {
    //     dark: options.color || '#000000',
    //     light: '#FFFFFF'
    //   }
    // });
    
    // For now, return a placeholder
    return `data:image/svg+xml,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
        <rect width="200" height="200" fill="#f5f5f5"/>
        <text x="100" y="100" text-anchor="middle" fill="#666" font-size="12">QR Code</text>
      </svg>`
    )}`;
  } catch (error) {
    console.error('Error generating QR code:', error);
    return null;
  }
}; 