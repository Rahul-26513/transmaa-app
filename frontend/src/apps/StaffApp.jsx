import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Sidebar from '../components/layout/Sidebar';
import TopBar from '../components/layout/TopBar';
import HeaderStats from '../components/layout/HeaderStats';
import OrdersModule from '../components/orders/OrdersModule';
import DriversModule from '../components/drivers/DriversModule';
import BuySellModule from '../components/buysell/BuySellModule';
import FinanceModule from '../components/finance/FinanceModule';
import NotificationsModule from '../components/notifications/NotificationsModule';
import NotificationDrawer from '../components/notifications/NotificationDrawer';
import Toast from '../components/common/Toast';
import Footer from '../components/common/Footer';
import StaffLogin from '../components/auth/StaffLogin';

import * as api from '../services/staffApi';
import { getToken, getStoredStaff, clearSession } from '../services/staffApi';
import { mapBooking, mapPendingDriver, mapVerifiedDriver, mapVehicle, mapEnquiry } from '../utils/staffMappers';

import { INITIAL_NOTIFICATIONS } from '../mockData/staffMockData';

export default function StaffApp() {
  // Auth State
  const [staff, setStaff] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Navigation State
  const [activeModule, setActiveModule] = useState('orders'); // orders | drivers | buysell | finance | notifications
  const [ordersDefaultTab, setOrdersDefaultTab] = useState('waiting');
  const [driversDefaultTab, setDriversDefaultTab] = useState('pending');
  const [buysellDefaultTab, setBuysellDefaultTab] = useState('pending');

  // UI Drawers & Toasts
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');

  // Domain State (raw API data)
  const [bookingsRaw, setBookingsRaw] = useState([]);
  const [driversRaw, setDriversRaw] = useState([]);
  const [vehiclesRaw, setVehiclesRaw] = useState([]);
  const [enquiriesRaw, setEnquiriesRaw] = useState([]);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Helper Toast Trigger
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const showApiError = (error, fallback) => {
    showToast(error?.message || fallback, 'error');
  };

  // ==========================================
  // SESSION BOOTSTRAP
  // ==========================================
  useEffect(() => {
    const storedStaff = getStoredStaff();
    const token = getToken();

    if (!token || !storedStaff) {
      setAuthChecked(true);
      return;
    }

    api
      .getMe()
      .then((data) => setStaff(data.staff))
      .catch(() => clearSession())
      .finally(() => setAuthChecked(true));
  }, []);

  // ==========================================
  // DATA LOADING
  // ==========================================
  const loadAllData = useCallback(async () => {
    setIsLoadingData(true);
    try {
      const [bookingsRes, driversRes, vehiclesRes, enquiriesRes] = await Promise.all([
        api.getBookings(),
        api.getDrivers(),
        api.getVehicles(),
        api.getEnquiries()
      ]);

      setBookingsRaw(bookingsRes.bookings);
      setDriversRaw(driversRes.drivers);
      setVehiclesRaw(vehiclesRes.vehicles);
      setEnquiriesRaw(enquiriesRes.enquiries);
    } catch (error) {
      showApiError(error, 'Failed to load dashboard data');
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  useEffect(() => {
    if (staff) {
      loadAllData();
    }
  }, [staff, loadAllData]);

  // ==========================================
  // AUTH ACTIONS
  // ==========================================
  const handleLoginSuccess = (staffProfile) => {
    setStaff(staffProfile);
  };

  const handleLogout = () => {
    clearSession();
    setStaff(null);
    setBookingsRaw([]);
    setDriversRaw([]);
    setVehiclesRaw([]);
    setEnquiriesRaw([]);
  };

  // ==========================================
  // DERIVED / MAPPED VIEW MODELS
  // ==========================================
  const orders = useMemo(() => bookingsRaw.map(mapBooking), [bookingsRaw]);

  const pendingDrivers = useMemo(
    () => driversRaw.filter((d) => d.verificationStatus === 'pending').map(mapPendingDriver),
    [driversRaw]
  );

  const verifiedDrivers = useMemo(
    () =>
      driversRaw
        .filter((d) => d.verificationStatus === 'approved')
        .map((d) => mapVerifiedDriver(d, orders)),
    [driversRaw, orders]
  );

  const pendingListings = useMemo(
    () => vehiclesRaw.filter((v) => v.status === 'pending').map(mapVehicle),
    [vehiclesRaw]
  );

  const liveListings = useMemo(
    () => vehiclesRaw.filter((v) => v.status === 'live').map(mapVehicle),
    [vehiclesRaw]
  );

  const enquiries = useMemo(() => enquiriesRaw.map(mapEnquiry), [enquiriesRaw]);

  // ==========================================
  // ORDERS MODULE ACTIONS
  // ==========================================
  const handleAcceptOrder = async (orderId) => {
    try {
      const { booking } = await api.acceptBooking(orderId, {});
      setBookingsRaw((prev) => prev.map((b) => (b._id === booking._id ? booking : b)));
      showToast(`Order accepted! Moved to Accepted Orders tab.`, 'success');
    } catch (error) {
      showApiError(error, 'Failed to accept order');
    }
  };

  const handleRejectOrder = async (orderId) => {
    try {
      const { booking } = await api.rejectBooking(orderId);
      setBookingsRaw((prev) => prev.map((b) => (b._id === booking._id ? booking : b)));
      showToast(`Order rejected.`, 'error');
    } catch (error) {
      showApiError(error, 'Failed to reject order');
    }
  };

  const handleSimulateDriverAccept = async (orderId) => {
    const availableDriver = driversRaw.find(
      (d) => d.verificationStatus === 'approved' && d.status === 'Active'
    );

    if (!availableDriver) {
      showToast('No active verified driver available to assign.', 'error');
      return;
    }

    try {
      const { booking } = await api.driverAcceptBooking(orderId, availableDriver._id);
      setBookingsRaw((prev) => prev.map((b) => (b._id === booking._id ? booking : b)));
      showToast(`Driver ${availableDriver.name} accepted the order!`, 'success');
    } catch (error) {
      showApiError(error, 'Failed to assign driver');
    }
  };

  const handleSendMessageOrder = async (orderId) => {
    try {
      const { booking } = await api.sendBookingConfirmation(orderId);
      setBookingsRaw((prev) => prev.map((b) => (b._id === booking._id ? booking : b)));
      showToast(`Confirmation SMS dispatched! Order is now On The Way.`, 'success');
    } catch (error) {
      showApiError(error, 'Failed to send confirmation');
    }
  };

  const handleMarkDeliveredOrder = async (orderId) => {
    try {
      const { booking } = await api.markBookingDelivered(orderId);
      setBookingsRaw((prev) => prev.map((b) => (b._id === booking._id ? booking : b)));
      showToast(`Order marked as Delivered! Saved to History log.`, 'success');
    } catch (error) {
      showApiError(error, 'Failed to mark as delivered');
    }
  };

  // ==========================================
  // DRIVERS MODULE ACTIONS
  // ==========================================
  const handleApproveDriver = async (driverId) => {
    try {
      const { driver } = await api.approveDriver(driverId);
      setDriversRaw((prev) => prev.map((d) => (d._id === driver._id ? driver : d)));
      showToast(`Driver ${driver.name} approved & verified!`, 'success');
    } catch (error) {
      showApiError(error, 'Failed to approve driver');
    }
  };

  const handleRejectDriver = async (driverId) => {
    try {
      const { driver } = await api.rejectDriver(driverId);
      setDriversRaw((prev) => prev.map((d) => (d._id === driver._id ? driver : d)));
      showToast(`Driver registration rejected.`, 'error');
    } catch (error) {
      showApiError(error, 'Failed to reject driver');
    }
  };

  const handleToggleDriverStatus = async (driverId) => {
    try {
      const { driver } = await api.toggleDriverStatus(driverId);
      setDriversRaw((prev) => prev.map((d) => (d._id === driver._id ? driver : d)));
      showToast(`Driver status updated successfully.`, 'info');
    } catch (error) {
      showApiError(error, 'Failed to update driver status');
    }
  };

  // ==========================================
  // BUY & SELL MODULE ACTIONS
  // ==========================================
  const handleApproveListing = async (listingId) => {
    try {
      const { vehicle } = await api.approveVehicle(listingId);
      setVehiclesRaw((prev) => prev.map((v) => (v._id === vehicle._id ? vehicle : v)));
      showToast(`Listing approved and published live to marketplace!`, 'success');
    } catch (error) {
      showApiError(error, 'Failed to approve listing');
    }
  };

  const handleRejectListing = async (listingId) => {
    try {
      const { vehicle } = await api.rejectVehicle(listingId);
      setVehiclesRaw((prev) => prev.map((v) => (v._id === vehicle._id ? vehicle : v)));
      showToast(`Listing submission rejected.`, 'error');
    } catch (error) {
      showApiError(error, 'Failed to reject listing');
    }
  };

  // ==========================================
  // FINANCE & INSURANCE ACTIONS
  // ==========================================
  const handleToggleContactedStatus = async (enquiryId) => {
    try {
      const { enquiry } = await api.toggleEnquiryContacted(enquiryId);
      setEnquiriesRaw((prev) => prev.map((e) => (e._id === enquiry._id ? enquiry : e)));
      showToast(`Lead status updated.`, 'info');
    } catch (error) {
      showApiError(error, 'Failed to update lead status');
    }
  };

  // ==========================================
  // NOTIFICATIONS ACTIONS
  // ==========================================
  const handleMarkAsRead = (notifId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, unread: false } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    showToast(`All notifications marked as read.`, 'info');
  };

  const handleNavigateToTab = (moduleName, tabName) => {
    setActiveModule(moduleName);
    if (moduleName === 'orders' && tabName) setOrdersDefaultTab(tabName);
    if (moduleName === 'drivers' && tabName) setDriversDefaultTab(tabName);
    if (moduleName === 'buysell' && tabName) setBuysellDefaultTab(tabName);
  };

  // ==========================================
  // GLOBAL SEARCH RESULTS COMPUTATION
  // ==========================================
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    const results = [];

    orders.forEach((o) => {
      if (
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.includes(q) ||
        o.goodsType.toLowerCase().includes(q)
      ) {
        results.push({
          id: o.id,
          type: 'order',
          title: `${o.customerName} (${o.goodsType})`,
          subtitle: `${o.fromLocation.split(',')[0]} → ${o.toLocation.split(',')[0]}`,
          tag: `Order: ${o.statusBadge}`,
          targetModule: 'orders',
          targetTab: o.status === 'waiting' ? 'waiting' : o.status === 'accepted' ? 'accepted' : o.status === 'driver_accepted' ? 'driver_accepted' : o.status === 'on_the_way' ? 'on_the_way' : 'delivered'
        });
      }
    });

    pendingDrivers.forEach((d) => {
      if (d.name.toLowerCase().includes(q) || d.phone.includes(q) || d.vehicleNumber?.toLowerCase().includes(q)) {
        results.push({
          id: d.id,
          type: 'driver',
          title: `Pending Driver: ${d.name}`,
          subtitle: `${d.vehicleType} (${d.vehicleNumber})`,
          tag: 'Driver Pending',
          targetModule: 'drivers',
          targetTab: 'pending'
        });
      }
    });

    verifiedDrivers.forEach((d) => {
      if (d.name.toLowerCase().includes(q) || d.phone.includes(q) || d.vehicleNumber?.toLowerCase().includes(q)) {
        results.push({
          id: d.id,
          type: 'driver',
          title: `Verified Driver: ${d.name}`,
          subtitle: `${d.vehicleType} (${d.vehicleNumber})`,
          tag: `Driver: ${d.status}`,
          targetModule: 'drivers',
          targetTab: 'verified'
        });
      }
    });

    pendingListings.concat(liveListings).forEach((l) => {
      if (l.makeModel.toLowerCase().includes(q) || l.sellerName.toLowerCase().includes(q) || l.rcNumber.toLowerCase().includes(q)) {
        results.push({
          id: l.id,
          type: 'buysell',
          title: `Vehicle: ${l.makeModel}`,
          subtitle: `Seller: ${l.sellerName} (${l.price})`,
          tag: `Listing: ${l.status}`,
          targetModule: 'buysell',
          targetTab: l.status === 'pending' ? 'pending' : 'live'
        });
      }
    });

    return results.slice(0, 8);
  }, [searchQuery, orders, pendingDrivers, verifiedDrivers, pendingListings, liveListings]);

  const handleSelectSearchResult = (item) => {
    handleNavigateToTab(item.targetModule, item.targetTab);
    setSearchQuery('');
  };

  // Badge Counts
  const counts = {
    waitingOrders: orders.filter((o) => o.status === 'waiting').length,
    pendingDrivers: pendingDrivers.length,
    pendingListings: pendingListings.length,
    pendingFinance: enquiries.filter((e) => e.status === 'pending').length,
    unreadNotifs: notifications.filter((n) => n.unread).length
  };

  if (!authChecked) {
    return null;
  }

  if (!staff) {
    return <StaffLogin onLoginSuccess={handleLoginSuccess} />;
  }

  const handleModuleChange = (moduleName) => {
    setActiveModule(moduleName);
    loadAllData();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">

      {/* Sidebar Navigation */}
      <Sidebar
        activeModule={activeModule}
        setActiveModule={handleModuleChange}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
        counts={counts}
      />

      {/* Main Content Area */}
      <div className="md:pl-20 lg:pl-64 flex-1 flex flex-col min-w-0 transition-all duration-300">

        {/* Top Bar */}
        <TopBar
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
          unreadCount={counts.unreadNotifs}
          onOpenNotifications={() => setIsNotificationDrawerOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchResults={searchResults}
          onSelectSearchResult={handleSelectSearchResult}
          staff={staff}
          onLogout={handleLogout}
        />

        {/* Page Container */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">

          {/* Top Operational Stats */}
          <HeaderStats counts={counts} onNavigateTab={handleNavigateToTab} />

          {isLoadingData && (
            <div className="text-center text-sm text-slate-500 py-6">Loading dashboard data…</div>
          )}

          {/* Module Router */}
          {activeModule === 'orders' && (
            <OrdersModule
              orders={orders}
              onAcceptOrder={handleAcceptOrder}
              onRejectOrder={handleRejectOrder}
              onSimulateDriverAccept={handleSimulateDriverAccept}
              onSendMessageOrder={handleSendMessageOrder}
              onMarkDeliveredOrder={handleMarkDeliveredOrder}
              defaultTab={ordersDefaultTab}
            />
          )}

          {activeModule === 'drivers' && (
            <DriversModule
              pendingDrivers={pendingDrivers}
              verifiedDrivers={verifiedDrivers}
              onApproveDriver={handleApproveDriver}
              onRejectDriver={handleRejectDriver}
              onToggleDriverStatus={handleToggleDriverStatus}
              defaultTab={driversDefaultTab}
            />
          )}

          {activeModule === 'buysell' && (
            <BuySellModule
              pendingListings={pendingListings}
              liveListings={liveListings}
              onApproveListing={handleApproveListing}
              onRejectListing={handleRejectListing}
              defaultTab={buysellDefaultTab}
            />
          )}

          {activeModule === 'finance' && (
            <FinanceModule
              enquiries={enquiries}
              onToggleContactedStatus={handleToggleContactedStatus}
            />
          )}

          {activeModule === 'notifications' && (
            <NotificationsModule
              notifications={notifications}
              onNavigateToTab={handleNavigateToTab}
              onMarkAsRead={handleMarkAsRead}
              onMarkAllAsRead={handleMarkAllAsRead}
            />
          )}

        </main>

        <Footer />
      </div>

      {/* Sliding Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotificationDrawerOpen}
        onClose={() => setIsNotificationDrawerOpen(false)}
        notifications={notifications}
        onNavigateToTab={handleNavigateToTab}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
      />

      {/* Snackbar Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />

    </div>
  );
}
