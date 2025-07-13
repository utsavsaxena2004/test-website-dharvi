import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import DynamicNavbar from './components/DynamicNavbar';
import DynamicPromoStrip from './components/DynamicPromoStrip';
import Hero from './components/Hero';
import Categories from './components/Categories';
import DynamicCategorySections from './components/DynamicCategorySections';
import FeaturedCollection from './components/FeaturedCollection';
import CustomDesignShowcase from './components/CustomDesignShowcase';
import CustomDesignPage from './components/CustomDesignPage';
import Footer from './components/Footer';
import PageTransition from './components/PageTransition';
import ScrollToTop from './components/ScrollToTop';
import BackendIntegrationExample from './components/BackendIntegrationExample';

// Import pages
import Auth from './pages/Auth';
import DynamicCategoryPage from './pages/DynamicCategoryPage';
import WishlistPage from './pages/Wishlist';
import CartPage from './pages/Cart';
import SimpleCartPage from './pages/SimpleCart';
import Admin from './pages/Admin';

function App() {
  return (
    <AuthProvider>
      <Router>
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
                    <DynamicCategorySections showCount={6} />
                    
                    <CustomDesignShowcase />
                    
                    {/* Featured Products */}
                    <FeaturedCollection />
                  </>
                </PageTransition>
              } />
              
              <Route path="/auth" element={
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
              
              {/* Dynamic Category pages - this will handle any category slug */}
              <Route path="/category/:categorySlug" element={
                <PageTransition transitionType="slide">
                  <DynamicCategoryPage />
                </PageTransition>
              } />
              
              <Route path="/wishlist" element={
                <PageTransition transitionType="fade">
                  <WishlistPage />
                </PageTransition>
              } />
              
              <Route path="/cart" element={
                <PageTransition transitionType="slide">
                  <CartPage />
                </PageTransition>
              } />
              
              <Route path="/admin" element={
                <PageTransition transitionType="fade">
                  <Admin />
                </PageTransition>
              } />
              
              {/* Add more routes as needed */}
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
