import React, { useCallback, useEffect, useState } from 'react';
import Navbar from '../components/layout/Navbar';
import BottomNav from '../components/layout/BottomNav';
import NotificationDrawer from '../components/common/NotificationDrawer';
import Toast from '../components/common/Toast';
import LoginModal from '../components/auth/LoginModal';
import RegisterModal from '../components/auth/RegisterModal';
import CustomerDashboard from '../components/dashboard/CustomerDashboard';
import BookingFlow from '../components/booking/BookingFlow';
import BookingList from '../components/bookings_history/BookingList';
import BookingDetailModal from '../components/bookings_history/BookingDetailModal';
import VehicleGrid from '../components/buy_vehicles/VehicleGrid';
import SellVehicleForm from '../components/sell_vehicle/SellVehicleForm';
import FinanceInsurance from '../components/finance_insurance/FinanceInsurance';
import UserProfile from '../components/profile/UserProfile';

import * as customerApi from '../services/customerApi';
import { mapBookingForDisplay } from '../utils/customerMappers';
import { INITIAL_NOTIFICATIONS } from '../mockData/mockData';

export default function CustomerApp() {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  const [currentTab, setCurrentTab] = useState('home');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [toast, setToast] = useState(null);
  const [sellListingsCount, setSellListingsCount] = useState(0);

  const showToast = (message, type = 'success') => setToast({ message, type });

  useEffect(() => {
    const storedUser = customerApi.getStoredCustomer();
    const token = customerApi.getToken();

    if (!token || !storedUser) {
      setAuthChecked(true);
      return;
    }

    customerApi
      .getMe()
      .then((data) => setUser({ id: data.customer.id, name: data.customer.name, phone: data.customer.phone, email: data.customer.email }))
      .catch(() => customerApi.clearSession())
      .finally(() => setAuthChecked(true));
  }, []);

  const loadBookings = useCallback(() => {
    if (!user) return;
    customerApi
      .getMyBookings()
      .then((data) => setBookings(data.bookings.map(mapBookingForDisplay)))
      .catch((err) => showToast(err.message || 'Failed to load bookings', 'error'));
  }, [user]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
    setIsLoginOpen(false);
  };

  const handleRegisterSuccess = (registeredUser) => {
    setUser(registeredUser);
    setIsRegisterOpen(false);
  };

  const handleLogout = () => {
    customerApi.clearSession();
    setUser(null);
    setBookings([]);
    setCurrentTab('home');
  };

  const handleCreateBooking = () => {
    loadBookings();
  };

  const handleNavigate = (tab) => {
    if (['book-truck', 'bookings', 'sell-vehicle', 'finance', 'profile'].includes(tab) && !user) {
      setIsLoginOpen(true);
      return;
    }
    setCurrentTab(tab);
  };

  const activeBooking = bookings.find((b) => b.currentStage > 1 && b.currentStage < 6);

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  if (!authChecked) {
    return null;
  }

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '70px' }}>
      <Navbar
        currentTab={currentTab}
        setCurrentTab={handleNavigate}
        user={user}
        onOpenAuth={() => setIsLoginOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        unreadNotificationsCount={unreadNotificationsCount}
      />

      <main>
        {currentTab === 'home' && (
          <CustomerDashboard
            user={user}
            onNavigate={handleNavigate}
            activeBooking={activeBooking}
            recentBookings={bookings}
            onOpenBookingDetail={setSelectedBooking}
          />
        )}

        {currentTab === 'book-truck' && (
          <BookingFlow
            user={user}
            onOpenAuth={() => setIsLoginOpen(true)}
            onCreateBooking={handleCreateBooking}
            onNavigateToBookings={() => setCurrentTab('bookings')}
          />
        )}

        {currentTab === 'bookings' && (
          <BookingList
            bookings={bookings}
            onStartBooking={() => setCurrentTab('book-truck')}
            showToast={showToast}
          />
        )}

        {currentTab === 'buy-vehicles' && (
          <VehicleGrid
            onSellClick={() => handleNavigate('sell-vehicle')}
            showToast={showToast}
          />
        )}

        {currentTab === 'sell-vehicle' && (
          <SellVehicleForm
            user={user}
            onOpenAuth={() => setIsLoginOpen(true)}
            onVehicleSubmitted={() => setSellListingsCount((c) => c + 1)}
            showToast={showToast}
          />
        )}

        {currentTab === 'finance' && (
          <FinanceInsurance user={user} showToast={showToast} />
        )}

        {currentTab === 'profile' && user && (
          <UserProfile
            user={user}
            onLogout={handleLogout}
            onNavigate={handleNavigate}
            bookingsCount={bookings.length}
            listingsCount={sellListingsCount}
            showToast={showToast}
          />
        )}
      </main>

      <BottomNav currentTab={currentTab} setCurrentTab={handleNavigate} />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onOpenRegister={() => { setIsLoginOpen(false); setIsRegisterOpen(true); }}
      />

      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onRegisterSuccess={handleRegisterSuccess}
        onOpenLogin={() => { setIsRegisterOpen(false); setIsLoginOpen(true); }}
      />

      {selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          showToast={showToast}
        />
      )}

      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllRead={() => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))}
        onNotificationClick={(item) => {
          setNotifications((prev) => prev.map((n) => (n.id === item.id ? { ...n, read: true } : n)));
        }}
      />

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
