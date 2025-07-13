import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import PromoStrip from './components/PromoStrip';
import Hero from './components/Hero';
import Categories from './components/Categories';
import SareeCollection from './components/SareeCollection';
import LehengaCollection from './components/LehengaCollection';
import FeaturedProductShowcase from './components/FeaturedProductShowcase';
import SuitCollection from './components/SuitCollection';
import KurtiCollection from './components/KurtiCollection';
import CustomDesignShowcase from './components/CustomDesignShowcase';
import CustomDesignPage from './components/CustomDesignPage';
import Footer from './components/Footer';
import PageTransition from './components/PageTransition';
import ScrollToTop from './components/ScrollToTop';
import BackendIntegrationExample from './components/BackendIntegrationExample';

// Import pages
import Auth from './pages/Auth';
import CategorySarees from './pages/CategorySarees';
import CategoryLehengas from './pages/CategoryLehengas';
import CategorySuits from './pages/CategorySuits';
import CategoryKurtis from './pages/CategoryKurtis';
import WishlistPage from './pages/Wishlist';
import CartPage from './pages/Cart';
import SimpleCartPage from './pages/SimpleCart';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <PromoStrip />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={
                <PageTransition transitionType="fade">
                  <>
                    <Hero />
                    <Categories />
                    <SareeCollection />
                    <LehengaCollection />
                    <CustomDesignShowcase />
                    <FeaturedProductShowcase />
                    <SuitCollection />
                    <KurtiCollection />
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
              
              {/* Category pages with different transition types */}
              <Route path="/category/sarees" element={
                <PageTransition transitionType="slide">
                  <CategorySarees />
                </PageTransition>
              } />
              <Route path="/category/lehengas" element={
                <PageTransition transitionType="scale">
                  <CategoryLehengas />
                </PageTransition>
              } />
              <Route path="/category/suits" element={
                <PageTransition transitionType="flip">
                  <CategorySuits />
                </PageTransition>
              } />
              <Route path="/category/kurtis" element={
                <PageTransition transitionType="slideUp">
                  <CategoryKurtis />
                </PageTransition>
              } />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/cart" element={
                <PageTransition transitionType="slide">
                  <CartPage />
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
