import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { ToastProvider } from './hooks/use-toast.jsx';
import { Toaster } from './components/ui/toaster';
import { useRouteState } from './hooks/useRouteState';

// Components
import DynamicNavbar from './components/DynamicNavbar';
import DynamicPromoStrip from './components/DynamicPromoStrip';
import Hero from './components/Hero';
import Categories from './components/Categories';
import DynamicCategorySections from './components/DynamicCategorySections';
import CustomDesignShowcase from './components/CustomDesignShowcase';
import FeaturedCollection from './components/FeaturedCollection';
import Footer from './components/Footer';
import PageTransition from './components/PageTransition';
import ScrollToTop from './components/ScrollToTop';
import FloatingShareButton from './components/FloatingShareButton';


// Pages
import Auth from './pages/Auth';
import Admin from './pages/Admin';
import CustomDesignPage from './components/CustomDesignPage';
import DynamicCategoryPage from './pages/DynamicCategoryPage';
import CartPage from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import PaymentSuccess from './pages/PaymentSuccess';
import WishlistPage from './pages/Wishlist';
import SharedWishlist from './pages/SharedWishlist';
import SearchResults from './pages/SearchResults';
import BackendIntegrationExample from './components/BackendIntegrationExample';
import StatePersistenceDemo from './components/StatePersistenceDemo';
import FeaturedProductShowcase from './components/FeaturedProductShowcase';
import SignatureCollection from './pages/SignatureCollection';
import CuratedCollection from './pages/CuratedCollection';

// Component to handle route state within Router context
const AppContent = () => {
  const { restoreLastRoute } = useRouteState();

  // You can use restoreLastRoute() here if needed for specific scenarios
  // For example, after login redirects, etc.

  return (
    <>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col">
        <DynamicNavbar />
        <DynamicPromoStrip />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={
              <PageTransition transitionType="fade">
                <>
                  <Hero />
                  <Categories />
                  
                  {/* Dynamic Category Sections - automatically displays all categories */}
                  {/* <div className="hidden lg:block">
                    <DynamicCategorySections showCount={6} />
                  </div> */}
                  {/* Featured Products */}
                  <FeaturedCollection />

                  <FeaturedProductShowcase />
                  
                  <CustomDesignShowcase />
                  
                </>
              </PageTransition>
            } />
            
            <Route path="/auth" element={
              <PageTransition transitionType="fade">
                <Auth />
              </PageTransition>
            } />
            
            <Route path="/login" element={
              <PageTransition transitionType="fade">
                <Auth />
              </PageTransition>
            } />
            
            <Route path="/custom-design" element={
              <PageTransition transitionType="slideUp">
                <CustomDesignPage />
              </PageTransition>
            } />
            
            {/* Backend Integration Demo Route */}
            <Route path="/backend-demo" element={
              <PageTransition transitionType="fade">
                <BackendIntegrationExample />
              </PageTransition>
            } />
            
            {/* State Persistence Demo Route */}
            <Route path="/state-persistence-demo" element={
              <PageTransition transitionType="fade">
                <StatePersistenceDemo />
              </PageTransition>
            } />
            
            {/* Search Results page */}
            <Route path="/search" element={
              <PageTransition transitionType="fade">
                <SearchResults />
              </PageTransition>
            } />
            
            {/* Dynamic Category pages - this will handle any category slug */}
            <Route path="/category/:categorySlug" element={
              <PageTransition transitionType="slide">
                <DynamicCategoryPage />
              </PageTransition>
            } />
            
            {/* Cart page */}
            <Route path="/cart" element={
              <PageTransition transitionType="slideUp">
                <CartPage />
              </PageTransition>
            } />
            
            {/* Checkout page */}
            <Route path="/checkout" element={
              <PageTransition transitionType="slideUp">
                <Checkout />
              </PageTransition>
            } />
            
            {/* Orders page */}
            <Route path="/orders" element={
              <PageTransition transitionType="slideUp">
                <Orders />
              </PageTransition>
            } />
            
            {/* Payment Success page */}
            <Route path="/payment-success" element={
              <PageTransition transitionType="fade">
                <PaymentSuccess />
              </PageTransition>
            } />
            
            {/* Wishlist page */}
            <Route path="/wishlist" element={
              <PageTransition transitionType="slideUp">
                <WishlistPage />
              </PageTransition>
            } />
            
            {/* Shared Wishlist page */}
            <Route path="/shared-wishlist" element={
              <PageTransition transitionType="fade">
                <SharedWishlist />
              </PageTransition>
            } />
            
            {/* State Persistence Demo Route */}
            <Route path="/state-persistence-demo" element={
              <PageTransition transitionType="fade">
                <StatePersistenceDemo />
              </PageTransition>
            } />
            
            <Route path="/admin" element={
              <PageTransition transitionType="fade">
                <Admin />
              </PageTransition>
            } />
            
            {/* Signature Collection page */}
            <Route path="/signature-collection" element={
              <PageTransition transitionType="fade">
                <SignatureCollection />
              </PageTransition>
            } />
            
            {/* Curated Collection page */}
            <Route path="/curated-collection" element={
              <PageTransition transitionType="fade">
                <CuratedCollection />
              </PageTransition>
            } />
            
            {/* Add more routes as needed */}
          </Routes>
        </main>
        <Footer />
      </div>
      <Toaster />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <ToastProvider>
            <Router>
              <AppContent />
            </Router>
          </ToastProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
