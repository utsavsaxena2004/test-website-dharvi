import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ShimmerButton } from './WishlistAnimation';

const WishlistShare = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState('');
  const [shareAnimation, setShareAnimation] = useState(false);

  const toggleShare = () => {
    setIsOpen(!isOpen);
  };

  const handleCopyLink = () => {
    // In a real app, this would get the actual URL to share
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setCopyStatus('Copied!');
        setTimeout(() => setCopyStatus(''), 2000);
      })
      .catch(() => {
        setCopyStatus('Failed to copy');
        setTimeout(() => setCopyStatus(''), 2000);
      });
  };

  const handleShare = (platform) => {
    // Trigger the sharing animation
    setShareAnimation(true);
    setTimeout(() => setShareAnimation(false), 1500);

    // In a real app, this would open the appropriate sharing dialog
    const shareUrl = window.location.href;
    const text = "Check out my wishlist at Dharika!";
    
    let shareLink;
    
    switch(platform) {
      case 'whatsapp':
        shareLink = `https://wa.me/?text=${encodeURIComponent(text + ' ' + shareUrl)}`;
        break;
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'email':
        shareLink = `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(shareUrl)}`;
        break;
      default:
        return;
    }
    
    window.open(shareLink, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-30">
      {/* Animated hearts that appear when sharing */}
      <AnimatePresence>
        {shareAnimation && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={`heart-${i}`}
                initial={{ 
                  scale: 0, 
                  opacity: 0.8,
                  x: 0,
                  y: 0,
                }}
                animate={{ 
                  scale: [0, 1, 0.8],
                  opacity: [0.8, 0, 0],
                  x: [(i % 2 === 0 ? -1 : 1) * (Math.random() * 80), (i % 2 === 0 ? -1 : 1) * (Math.random() * 120)],
                  y: [-Math.random() * 80, -Math.random() * 160],
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 + Math.random() }}
                className="absolute bottom-0 right-0 text-[#ba1a5d]"
              >
                <svg width={20 + Math.random() * 15} height={20 + Math.random() * 15} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z" />
                </svg>
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Share button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleShare}
        className="flex items-center gap-2 bg-[#ba1a5d] text-white px-4 py-3 rounded-full shadow-lg"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
          <polyline points="16 6 12 2 8 6"></polyline>
          <line x1="12" y1="2" x2="12" y2="15"></line>
        </svg>
        <span className="font-medium">Share Wishlist</span>
      </motion.button>

      {/* Share options popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="absolute bottom-16 right-0 p-4 bg-white rounded-xl shadow-xl w-72"
          >
            <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white transform rotate-45"></div>
            
            <h4 className="text-gray-800 font-medium mb-2">Share your wishlist</h4>
            
            <div className="flex flex-wrap gap-3 mt-4 mb-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleShare('whatsapp')}
                className="p-2 bg-green-500 text-white rounded-full"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.135.301-.345.451-.523.146-.181.194-.301.297-.496.1-.21.049-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.015-.571-.015-.2 0-.523.074-.797.359-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.21 2.096 3.226 5.076 4.524.709.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleShare('facebook')}
                className="p-2 bg-blue-600 text-white rounded-full"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleShare('twitter')}
                className="p-2 bg-blue-400 text-white rounded-full"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleShare('email')}
                className="p-2 bg-gray-600 text-white rounded-full"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </motion.button>
            </div>
            
            <div className="mt-3 relative">
              <div className="flex">
                <input
                  type="text"
                  readOnly
                  value={window.location.href}
                  className="w-full bg-gray-100 border border-gray-200 rounded-l-lg px-3 py-2 text-sm focus:outline-none"
                />
                <ShimmerButton
                  onClick={handleCopyLink}
                  className="bg-[#ba1a5d] text-white px-3 py-2 text-sm rounded-r-lg flex-shrink-0"
                >
                  {copyStatus || 'Copy'}
                </ShimmerButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WishlistShare; 