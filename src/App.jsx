import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Explore from './pages/Explore';
import RestaurantDetails from './pages/RestaurantDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Offers from './pages/Offers';
import HelpCenter from './pages/HelpCenter';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import DashboardLayout from './layouts/DashboardLayout';
import PlatformDashboard from './pages/dashboard/PlatformDashboard';
import CustomerLayout from './layouts/CustomerLayout';
import DashboardOverview from './pages/dashboard/Overview';
import RestaurantManager from './pages/dashboard/MyRestaurant';
import VenueOffers from './pages/dashboard/VenueOffers';
import BookingsManager from './pages/dashboard/BookingsManager';
import Settings from './pages/dashboard/Settings';
import AdminRestaurants from './pages/dashboard/AdminRestaurants';
import AdminUsers from './pages/dashboard/AdminUsers';
import AdminOffers from './pages/dashboard/AdminOffers';
import AdminAnalytics from './pages/dashboard/AdminAnalytics';
import AdminFinancials from './pages/dashboard/AdminFinancials';
import AdminSEO from './pages/dashboard/AdminSEO';
import AdminSecurityLogs from './pages/dashboard/AdminSecurityLogs';
import CustomerProfile from './pages/customer/CustomerProfile';
import CustomerFavorites from './pages/customer/CustomerFavorites';
import CustomerNotifications from './pages/customer/CustomerNotifications';
import CustomerSettings from './pages/customer/CustomerSettings';
import SplashScreen from './components/SplashScreen';
import PendingApproval from './pages/auth/PendingApproval';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import { RestaurantProvider } from './context/RestaurantContext';
import { OfferProvider } from './context/OfferContext';
import { ToastProvider } from './context/ToastContext';
import { NotificationProvider } from './context/NotificationContext';
import ScrollToTop from './components/ScrollToTop';

const DashboardRouting = () => {
  const { user } = useAuth();
  const isGlobalAdmin = user?.role === 'super_admin' || user?.role === 'platform_admin' || user?.email === 'admin@tableease.com';
  return isGlobalAdmin ? <PlatformDashboard /> : <DashboardOverview />;
};

function App() {
  const [isLoading, setIsLoading] = useState(() => {
    return !sessionStorage.getItem('splash_seen');
  });

  const handleSplashComplete = () => {
    sessionStorage.setItem('splash_seen', 'true');
    setIsLoading(false);
  };

  return (
    <LanguageProvider>
      <ToastProvider>
        <AuthProvider>
          <NotificationProvider>
            <RestaurantProvider>
              <OfferProvider>
                <BookingProvider>
                  <ScrollToTop />
                  <div className="font-sans text-primary">
                    <AnimatePresence mode="wait">
                      {isLoading && (
                        <SplashScreen key="splash" onComplete={handleSplashComplete} />
                      )}
                    </AnimatePresence>

                    {!isLoading && (
                      <Routes>
                        <Route path="/" element={<><Navbar /><Home /><Footer /></>} />
                        <Route path="/explore" element={<><Navbar /><Explore /><Footer /></>} />
                        <Route path="/restaurant/:id" element={<><Navbar /><RestaurantDetails /><Footer /></>} />
                        <Route path="/login" element={<><Navbar /><Login /><Footer /></>} />
                        <Route path="/register" element={<><Navbar /><Register /><Footer /></>} />
                        <Route path="/about" element={<><Navbar /><About /><Footer /></>} />
                        <Route path="/offers" element={<><Navbar /><Offers /><Footer /></>} />
                        <Route path="/help" element={<><Navbar /><HelpCenter /><Footer /></>} />
                        <Route path="/terms" element={<><Navbar /><TermsOfService /><Footer /></>} />
                        <Route path="/privacy" element={<><Navbar /><PrivacyPolicy /><Footer /></>} />
                        <Route path="/pending-approval" element={<PendingApproval />} />

                        {/* Customer Profile Area */}
                        <Route path="/me" element={<CustomerLayout />}>
                          <Route index element={<CustomerProfile />} />
                          <Route path="favorites" element={<CustomerFavorites />} />
                          <Route path="notifications" element={<CustomerNotifications />} />
                          <Route path="settings" element={<CustomerSettings />} />
                        </Route>

                        {/* Dashboard for Restaurant Owners & Admins */}
                        <Route path="/dashboard" element={<DashboardLayout />}>
                          <Route index element={<DashboardRouting />} />
                          <Route path="restaurant" element={<RestaurantManager />} />
                          <Route path="offers" element={<VenueOffers />} />
                          <Route path="bookings" element={<BookingsManager />} />
                          <Route path="settings" element={<Settings />} />
                          <Route path="admin/restaurants" element={<AdminRestaurants />} />
                          <Route path="admin/offers" element={<AdminOffers />} />
                          <Route path="admin/users" element={<AdminUsers />} />
                          <Route path="admin/analytics" element={<AdminAnalytics />} />
                          <Route path="admin/financials" element={<AdminFinancials />} />
                          <Route path="admin/seo" element={<AdminSEO />} />
                          <Route path="admin/logs" element={<AdminSecurityLogs />} />
                        </Route>

                        <Route path="*" element={<div className="h-screen flex items-center justify-center text-4xl font-black text-gray-200">Coming Soon</div>} />
                      </Routes>
                    )}
                  </div>
                </BookingProvider>
              </OfferProvider>
            </RestaurantProvider>
          </NotificationProvider>
        </AuthProvider>
      </ToastProvider>
    </LanguageProvider>
  );
}

export default App;
