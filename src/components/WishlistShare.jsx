import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useWishlist } from '../contexts/WishlistContext';
import { useAuth } from '../contexts/AuthContext';

const WishlistShare = ({ isOpen, onClose, position = 'fixed' }) => {
  const [copyStatus, setCopyStatus] = useState('');
  const [shareAnimation, setShareAnimation] = useState(false);
  const [shareMode, setShareMode] = useState('public'); // 'public', 'private', 'collaborators'
  const [emailInput, setEmailInput] = useState('');
  const [inviteEmails, setInviteEmails] = useState([]);
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [shareableLink, setShareableLink] = useState('');
  const [linkExpiry, setLinkExpiry] = useState('never'); // 'never', '7days', '30days', '1year'
  const [allowEditing, setAllowEditing] = useState(false);
  
  const { wishlistItems, wishlistSummary } = useWishlist();
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen) {
      generateShareableLink();
    }
  }, [isOpen, shareMode, linkExpiry, allowEditing]);

  const generateShareableLink = async () => {
    setIsGeneratingLink(true);
    
    try {
      // Simulate API call to generate shareable link
      // In a real app, this would create a unique token and store wishlist data
      const shareToken = `${user?.id || 'anonymous'}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const baseUrl = window.location.origin;
      
      const queryParams = new URLSearchParams({
        token: shareToken,
        mode: shareMode,
        expiry: linkExpiry,
        editable: allowEditing.toString(),
        items: wishlistItems.length,
        value: wishlistSummary.totalValue
      });
      
      const generatedLink = `${baseUrl}/shared-wishlist?${queryParams.toString()}`;
      setShareableLink(generatedLink);
      
    } catch (error) {
      console.error('Error generating shareable link:', error);
    } finally {
      setIsGeneratingLink(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableLink)
      .then(() => {
        setCopyStatus('Copied!');
        setTimeout(() => setCopyStatus(''), 2000);
      })
      .catch(() => {
        setCopyStatus('Failed to copy');
        setTimeout(() => setCopyStatus(''), 2000);
      });
  };

  const addEmailToInvites = () => {
    if (emailInput && emailInput.includes('@') && !inviteEmails.includes(emailInput)) {
      setInviteEmails([...inviteEmails, emailInput]);
      setEmailInput('');
    }
  };

  const removeEmailFromInvites = (email) => {
    setInviteEmails(inviteEmails.filter(e => e !== email));
  };

  const sendInvitations = async () => {
    if (inviteEmails.length === 0) return;
    
    setShareAnimation(true);
    setTimeout(() => setShareAnimation(false), 1500);
    
    // Simulate sending email invitations
    console.log('Sending invitations to:', inviteEmails);
    
    // Reset invites after sending
    setInviteEmails([]);
  };

  const handleShare = (platform) => {
    setShareAnimation(true);
    setTimeout(() => setShareAnimation(false), 1500);

    const shareText = `Check out my wishlist at Dharika Fashion! ${wishlistSummary.itemCount} beautiful items waiting to be discovered.`;
    const shareUrl = shareableLink || window.location.href;
    
    let shareLink;
    
    switch(platform) {
      case 'whatsapp':
        shareLink = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
        break;
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
        break;
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}&hashtags=DharikaFashion,Wishlist,EthnicWear`;
        break;
      case 'email':
        const emailSubject = 'Check out my Dharika Fashion wishlist!';
        const emailBody = `Hi!\n\n${shareText}\n\nView my wishlist here: ${shareUrl}\n\nHappy shopping!\n\n✨ Shared from Dharika Fashion`;
        shareLink = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
        break;
      case 'pinterest':
        // Get first item image for Pinterest
        const firstItemImage = wishlistItems[0]?.products?.images?.[0] || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b';
        shareLink = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&media=${encodeURIComponent(firstItemImage)}&description=${encodeURIComponent(shareText)}`;
        break;
      case 'instagram':
        // Instagram doesn't support direct link sharing, so copy to clipboard with instructions
        navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
        setCopyStatus('Link copied! Share on Instagram Stories');
        setTimeout(() => setCopyStatus(''), 3000);
        return;
      default:
        return;
    }
    
    if (shareLink) {
      window.open(shareLink, '_blank', 'width=600,height=400');
    }
  };

  const copyWishlistData = () => {
    const wishlistText = wishlistItems.map(item => 
      `• ${item.products?.name || 'Product'} - ${item.products?.price ? `₹${item.products.price}` : 'Price not available'}`
    ).join('\n');
    
    const fullText = `My Dharika Fashion Wishlist 💝\n\n${wishlistText}\n\nTotal items: ${wishlistSummary.itemCount}\nTotal value: ₹${wishlistSummary.totalValue.toLocaleString()}\n\nView full wishlist: ${shareableLink}`;
    
    navigator.clipboard.writeText(fullText);
    setCopyStatus('Wishlist data copied!');
    setTimeout(() => setCopyStatus(''), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className={`${position === 'fixed' ? 'fixed inset-0' : 'absolute inset-0'} z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm`}>
      {/* Animated hearts that appear when sharing */}
      <AnimatePresence>
        {shareAnimation && (
          <>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`heart-${i}`}
                initial={{ 
                  scale: 0, 
                  opacity: 0.8,
                  x: window.innerWidth / 2,
                  y: window.innerHeight / 2,
                }}
                animate={{ 
                  scale: [0, 1, 0.8],
                  opacity: [0.8, 0, 0],
                  x: window.innerWidth / 2 + (i % 2 === 0 ? -1 : 1) * (Math.random() * 200 + 100),
                  y: window.innerHeight / 2 - (Math.random() * 200 + 50),
                  rotate: Math.random() * 360
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5 + Math.random() }}
                className="absolute text-[#ba1a5d] pointer-events-none"
              >
                <svg width={30 + Math.random() * 20} height={30 + Math.random() * 20} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z" />
                </svg>
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Share modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-serif text-gray-900">Share Your Wishlist</h3>
              <p className="text-gray-600 mt-1">{wishlistSummary.itemCount} items • ₹{wishlistSummary.totalValue.toLocaleString()} total value</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Share mode selection */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">Sharing Options</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShareMode('public')}
                className={`p-4 border-2 rounded-xl text-left transition-all ${
                  shareMode === 'public' 
                    ? 'border-[#ba1a5d] bg-[#ba1a5d]/5' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center mb-2">
                  <div className={`w-3 h-3 rounded-full mr-2 ${shareMode === 'public' ? 'bg-[#ba1a5d]' : 'bg-gray-300'}`} />
                  <span className="font-medium">Public</span>
                </div>
                <p className="text-sm text-gray-600">Anyone with the link can view</p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShareMode('private')}
                className={`p-4 border-2 rounded-xl text-left transition-all ${
                  shareMode === 'private' 
                    ? 'border-[#ba1a5d] bg-[#ba1a5d]/5' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center mb-2">
                  <div className={`w-3 h-3 rounded-full mr-2 ${shareMode === 'private' ? 'bg-[#ba1a5d]' : 'bg-gray-300'}`} />
                  <span className="font-medium">Private</span>
                </div>
                <p className="text-sm text-gray-600">Only invited people can view</p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShareMode('collaborators')}
                className={`p-4 border-2 rounded-xl text-left transition-all ${
                  shareMode === 'collaborators' 
                    ? 'border-[#ba1a5d] bg-[#ba1a5d]/5' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center mb-2">
                  <div className={`w-3 h-3 rounded-full mr-2 ${shareMode === 'collaborators' ? 'bg-[#ba1a5d]' : 'bg-gray-300'}`} />
                  <span className="font-medium">Collaborate</span>
                </div>
                <p className="text-sm text-gray-600">Others can add/remove items</p>
              </motion.button>
            </div>
          </div>

          {/* Advanced options */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Link Expiry</label>
              <select 
                value={linkExpiry} 
                onChange={(e) => setLinkExpiry(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ba1a5d] focus:border-transparent"
              >
                <option value="never">Never expires</option>
                <option value="7days">7 days</option>
                <option value="30days">30 days</option>
                <option value="1year">1 year</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="allowEditing"
                checked={allowEditing}
                onChange={(e) => setAllowEditing(e.target.checked)}
                className="mr-2 rounded border-gray-300 text-[#ba1a5d] focus:ring-[#ba1a5d]"
              />
              <label htmlFor="allowEditing" className="text-sm text-gray-700">Allow viewers to edit</label>
            </div>
          </div>

          {/* Shareable link */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">Shareable Link</h4>
            <div className="flex">
              <input
                type="text"
                readOnly
                value={isGeneratingLink ? 'Generating link...' : shareableLink}
                className="flex-1 bg-gray-50 border border-gray-300 rounded-l-lg px-3 py-3 text-sm focus:outline-none"
                placeholder="Generating your unique link..."
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCopyLink}
                disabled={isGeneratingLink}
                className="bg-[#ba1a5d] text-white px-4 py-3 text-sm rounded-r-lg hover:bg-[#9a1549] transition-colors disabled:opacity-50"
              >
                {copyStatus || 'Copy'}
              </motion.button>
            </div>
          </div>

          {/* Email invitations for private mode */}
          {shareMode === 'private' && (
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Invite People</h4>
              <div className="flex mb-3">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addEmailToInvites()}
                  placeholder="Enter email address"
                  className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#ba1a5d] focus:border-transparent"
                />
                <button
                  onClick={addEmailToInvites}
                  className="bg-gray-500 text-white px-4 py-2 text-sm rounded-r-lg hover:bg-gray-600 transition-colors"
                >
                  Add
                </button>
              </div>

              {inviteEmails.length > 0 && (
                <div className="mb-3">
                  <div className="flex flex-wrap gap-2">
                    {inviteEmails.map((email, index) => (
                      <span key={index} className="inline-flex items-center bg-[#ba1a5d]/10 text-[#ba1a5d] px-3 py-1 rounded-full text-sm">
                        {email}
                        <button
                          onClick={() => removeEmailFromInvites(email)}
                          className="ml-2 text-[#ba1a5d] hover:text-[#9a1549]"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={sendInvitations}
                    className="mt-3 bg-[#ba1a5d] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#9a1549] transition-colors"
                  >
                    Send Invitations ({inviteEmails.length})
                  </motion.button>
                </div>
              )}
            </div>
          )}

          {/* Social sharing */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">Share on Social Media</h4>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {[
                { name: 'WhatsApp', icon: 'whatsapp', color: 'bg-green-500', platform: 'whatsapp' },
                { name: 'Facebook', icon: 'facebook', color: 'bg-blue-600', platform: 'facebook' },
                { name: 'Twitter', icon: 'twitter', color: 'bg-blue-400', platform: 'twitter' },
                { name: 'Email', icon: 'email', color: 'bg-gray-600', platform: 'email' },
                { name: 'Pinterest', icon: 'pinterest', color: 'bg-red-600', platform: 'pinterest' },
                { name: 'Instagram', icon: 'instagram', color: 'bg-gradient-to-r from-purple-500 to-pink-500', platform: 'instagram' }
              ].map((social) => (
                <motion.button
                  key={social.platform}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleShare(social.platform)}
                  className={`${social.color} text-white p-3 rounded-xl flex flex-col items-center justify-center transition-all hover:shadow-lg`}
                >
                  <SocialIcon platform={social.platform} />
                  <span className="text-xs mt-1 hidden md:block">{social.name}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className="flex flex-wrap gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={copyWishlistData}
              className="flex-1 min-w-0 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg text-sm hover:bg-gray-200 transition-colors"
            >
              📋 Copy Wishlist Data
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleShare('email')}
              className="flex-1 min-w-0 bg-[#ba1a5d]/10 text-[#ba1a5d] px-4 py-3 rounded-lg text-sm hover:bg-[#ba1a5d]/20 transition-colors"
            >
              ✉️ Send via Email
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Social media icons component
const SocialIcon = ({ platform }) => {
  const iconProps = { width: 20, height: 20, fill: 'currentColor', viewBox: '0 0 24 24' };
  
  switch (platform) {
    case 'whatsapp':
      return (
        <svg {...iconProps} viewBox="0 0 24 24">
          <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.135.301-.345.451-.523.146-.181.194-.301.297-.496.1-.21.049-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.015-.571-.015-.2 0-.523.074-.797.359-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.21 2.096 3.226 5.076 4.524.709.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      );
    case 'facebook':
      return (
        <svg {...iconProps}>
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      );
    case 'twitter':
      return (
        <svg {...iconProps}>
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      );
    case 'email':
      return (
        <svg {...iconProps} fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      );
    case 'pinterest':
      return (
        <svg {...iconProps}>
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
        </svg>
      );
    case 'instagram':
      return (
        <svg {...iconProps}>
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      );
    default:
      return <div className="w-5 h-5 bg-white/20 rounded" />;
  }
};

export default WishlistShare; 