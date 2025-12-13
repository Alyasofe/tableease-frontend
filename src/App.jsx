import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Explore from './pages/Explore';
import RestaurantDetails from './pages/RestaurantDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Offers from './pages/Offers';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardOverview from './pages/dashboard/Overview';
import RestaurantManager from './pages/dashboard/MyRestaurant';
import BookingsManager from './pages/dashboard/BookingsManager';
import Settings from './pages/dashboard/Settings';
import SplashScreen from './components/SplashScreen';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';

import { BookingProvider } from './context/BookingContext';

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
      <AuthProvider>
        <BookingProvider>
          <div className="font-sans text-primary">
            <AnimatePresence mode="wait">
              {isLoading && (
                <SplashScreen key="splash" onComplete={handleSplashComplete} />
              )}
            </AnimatePresence>

            {!isLoading && (
              <Routes>
                {/* Public Routes - Wrapped in valid fragment or layout? Actually Navbar needs to be conditionally rendered if we want a clean dashboard. 
                For simplicity, let's keep Navbar for public pages only. 
            */}
                <Route path="/" element={<><Navbar /><Home /><Footer /></>} />
                <Route path="/explore" element={<><Navbar /><Explore /><Footer /></>} />
                <Route path="/restaurant/:id" element={<><Navbar /><RestaurantDetails /><Footer /></>} />
                <Route path="/login" element={<><Navbar /><Login /><Footer /></>} />
                <Route path="/register" element={<><Navbar /><Register /><Footer /></>} />
                <Route path="/about" element={<><Navbar /><About /><Footer /></>} />
                <Route path="/offers" element={<><Navbar /><Offers /><Footer /></>} />

                {/* Dashboard Routed (Protected) */}
                <Route path="/dashboard" element={<DashboardLayout />}>
                  <Route index element={<DashboardOverview />} />
                  <Route path="restaurant" element={<RestaurantManager />} />
                  <Route path="bookings" element={<BookingsManager />} />
                  <Route path="settings" element={<Settings />} />
                </Route>

                <Route path="*" element={<div className="h-screen flex items-center justify-center">Coming Soon</div>} />
              </Routes>
            )}
          </div>
        </BookingProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
