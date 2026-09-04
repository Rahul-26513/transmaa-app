import React, { useEffect, useState } from 'react';
import { Package, ShieldCheck, LogOut } from 'lucide-react';
import DriverLogin from '../components/driver/DriverLogin';
import DriverRegister from '../components/driver/DriverRegister';
import AvailableLoads from '../components/driver/AvailableLoads';
import MyLoads from '../components/driver/MyLoads';
import Toast from '../components/common/Toast';
import * as driverApi from '../services/driverApi';

export default function DriverApp() {
  const [driver, setDriver] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [authView, setAuthView] = useState('login'); // login | register
  const [activeTab, setActiveTab] = useState('loads'); // loads | history
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => setToast({ message, type });

  useEffect(() => {
    const storedDriver = driverApi.getStoredDriver();
    const token = driverApi.getToken();

    if (!token || !storedDriver) {
      setAuthChecked(true);
      return;
    }

    driverApi
      .getMe()
      .then((data) => setDriver(data.driver))
      .catch(() => driverApi.clearSession())
      .finally(() => setAuthChecked(true));
  }, []);

  const handleLogout = () => {
    driverApi.clearSession();
    setDriver(null);
    setAuthView('login');
  };

  if (!authChecked) {
    return null;
  }

  if (!driver) {
    return authView === 'login' ? (
      <DriverLogin onLoginSuccess={setDriver} onOpenRegister={() => setAuthView('register')} />
    ) : (
      <DriverRegister onBackToLogin={() => setAuthView('login')} />
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      <div style={{
        backgroundColor: 'white', borderBottom: '1px solid #E2E8F0', padding: '0 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '56px'
      }}>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            onClick={() => setActiveTab('loads')}
            className="btn-ghost"
            style={{
              fontWeight: 700, fontSize: '0.85rem',
              color: activeTab === 'loads' ? '#F97316' : '#64748B',
              borderBottom: activeTab === 'loads' ? '2px solid #F97316' : '2px solid transparent',
              borderRadius: 0
            }}
          >
            <Package size={16} /> Available Loads
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className="btn-ghost"
            style={{
              fontWeight: 700, fontSize: '0.85rem',
              color: activeTab === 'history' ? '#F97316' : '#64748B',
              borderBottom: activeTab === 'history' ? '2px solid #F97316' : '2px solid transparent',
              borderRadius: 0
            }}
          >
            <ShieldCheck size={16} /> My Loads
          </button>
        </div>

        <button onClick={handleLogout} className="btn-ghost" style={{ color: '#EF4444', fontWeight: 700, fontSize: '0.85rem' }}>
          <LogOut size={16} /> Logout
        </button>
      </div>

      {activeTab === 'loads' ? (
        <AvailableLoads driver={driver} showToast={showToast} />
      ) : (
        <MyLoads showToast={showToast} />
      )}

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
