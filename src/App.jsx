import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { ToastProvider } from './hooks/use-toast.jsx';
import { Toaster } from './components/ui/toaster';

// Critical components (loaded immediately)
import DynamicNavbar from './components/DynamicNavbar';
import DynamicPromoStrip from './components/DynamicPromoStrip';
import Hero from './components/Hero';
import Categories from './components/Categories';
import CustomDesignShowcase from './components/CustomDesignShowcase';
import FeaturedCollection from './components/FeaturedCollection';
import Gallery from './components/Gallery';
import AboutDharika from './components/AboutDharika';
import FeaturedProductShowcase from './components/FeaturedProductShowcase';
import Footer from './components/Footer';
import PageTransition from './components/PageTransition';
import ScrollToTop from './components/ScrollToTop';

// Lazy load only pages (not homepage components)
const Auth = lazy(() => import('./pages/Auth'));
const Admin = lazy(() => import('./pages/Admin'));
const CustomDesignPage = lazy(() => import('./components/CustomDesignPage'));
const DynamicCategoryPage = lazy(() => import('./pages/DynamicCategoryPage'));
const CartPage = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Orders = lazy(() => import('./pages/Orders'));
const OrderDetails = lazy(() => import('./pages/OrderDetails'));
const PaymentSuccess = lazy(() => import('./pages/PaymentSuccess'));
const WishlistPage = lazy(() => import('./pages/Wishlist'));
const SharedWishlist = lazy(() => import('./pages/SharedWishlist'));
const SearchResults = lazy(() => import('./pages/SearchResults'));
const BackendIntegrationExample = lazy(() => import('./components/BackendIntegrationExample'));
const StatePersistenceDemo = lazy(() => import('./components/StatePersistenceDemo'));
const SignatureCollection = lazy(() => import('./pages/SignatureCollection'));
const CuratedCollection = lazy(() => import('./pages/CuratedCollection'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-12">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

// Component to handle route state within Router context
const AppContent = () => {
  // Route state functionality can be added here when needed
  // const { restoreLastRoute } = useRouteState();

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
                  <FeaturedCollection />
                  <FeaturedProductShowcase />
                  <AboutDharika />
                  <Gallery />
                  <CustomDesignShowcase />
                </>
              </PageTransition>
            } />
            
            <Route path="/auth" element={
              <PageTransition transitionType="fade">
                <Suspense fallback={<LoadingSpinner />}>
                  <Auth />
                </Suspense>
              </PageTransition>
            } />
            
            <Route path="/login" element={
              <PageTransition transitionType="fade">
                <Suspense fallback={<LoadingSpinner />}>
                  <Auth />
                </Suspense>
              </PageTransition>
            } />
            
            <Route path="/custom-design" element={
              <PageTransition transitionType="slideUp">
                <Suspense fallback={<LoadingSpinner />}>
                  <CustomDesignPage />
                </Suspense>
              </PageTransition>
            } />
            
            {/* Backend Integration Demo Route */}
            <Route path="/backend-demo" element={
              <PageTransition transitionType="fade">
                <Suspense fallback={<LoadingSpinner />}>
                  <BackendIntegrationExample />
                </Suspense>
              </PageTransition>
            } />
            
            {/* State Persistence Demo Route */}
            <Route path="/state-persistence-demo" element={
              <PageTransition transitionType="fade">
                <Suspense fallback={<LoadingSpinner />}>
                  <StatePersistenceDemo />
                </Suspense>
              </PageTransition>
            } />
            
            {/* Search Results page */}
            <Route path="/search" element={
              <PageTransition transitionType="fade">
                <Suspense fallback={<LoadingSpinner />}>
                  <SearchResults />
                </Suspense>
              </PageTransition>
            } />
            
            {/* Dynamic Category pages - this will handle any category slug */}
            <Route path="/category/:categorySlug" element={
              <PageTransition transitionType="slide">
                <Suspense fallback={<LoadingSpinner />}>
                  <DynamicCategoryPage />
                </Suspense>
              </PageTransition>
            } />
            
            {/* Cart page */}
            <Route path="/cart" element={
              <PageTransition transitionType="slideUp">
                <Suspense fallback={<LoadingSpinner />}>
                  <CartPage />
                </Suspense>
              </PageTransition>
            } />
            
            {/* Checkout page */}
            <Route path="/checkout" element={
              <PageTransition transitionType="slideUp">
                <Suspense fallback={<LoadingSpinner />}>
                  <Checkout />
                </Suspense>
              </PageTransition>
            } />
            
            {/* Orders page */}
            <Route path="/orders" element={
              <PageTransition transitionType="slideUp">
                <Suspense fallback={<LoadingSpinner />}>
                  <Orders />
                </Suspense>
              </PageTransition>
            } />
            
            {/* Order Details page */}
            <Route path="/orders/:orderId" element={
              <PageTransition transitionType="slideUp">
                <Suspense fallback={<LoadingSpinner />}>
                  <OrderDetails />
                </Suspense>
              </PageTransition>
            } />
            
            {/* Payment Success page */}
            <Route path="/payment-success" element={
              <PageTransition transitionType="fade">
                <Suspense fallback={<LoadingSpinner />}>
                  <PaymentSuccess />
                </Suspense>
              </PageTransition>
            } />
            
            {/* Wishlist page */}
            <Route path="/wishlist" element={
              <PageTransition transitionType="slideUp">
                <Suspense fallback={<LoadingSpinner />}>
                  <WishlistPage />
                </Suspense>
              </PageTransition>
            } />
            
            {/* Shared Wishlist page */}
            <Route path="/shared-wishlist" element={
              <PageTransition transitionType="fade">
                <Suspense fallback={<LoadingSpinner />}>
                  <SharedWishlist />
                </Suspense>
              </PageTransition>
            } />
            
            <Route path="/admin" element={
              <PageTransition transitionType="fade">
                <Suspense fallback={<LoadingSpinner />}>
                  <Admin />
                </Suspense>
              </PageTransition>
            } />
            
            {/* Signature Collection page */}
            <Route path="/signature-collection" element={
              <PageTransition transitionType="fade">
                <Suspense fallback={<LoadingSpinner />}>
                  <SignatureCollection />
                </Suspense>
              </PageTransition>
            } />
            
            {/* Curated Collection page */}
            <Route path="/curated-collection" element={
              <PageTransition transitionType="fade">
                <Suspense fallback={<LoadingSpinner />}>
                  <CuratedCollection />
                </Suspense>
              </PageTransition>
            } />
            
            {/* Gallery page */}
            <Route path="/gallery" element={
              <PageTransition transitionType="fade">
                <Suspense fallback={<LoadingSpinner />}>
                  <GalleryPage />
                </Suspense>
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
