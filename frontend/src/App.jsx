import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import CustomerApp from './apps/CustomerApp';
import StaffApp from './apps/StaffApp';
import DriverApp from './apps/DriverApp';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/customer/*" element={<CustomerApp />} />
        <Route path="/staff/*" element={<StaffApp />} />
        <Route path="/driver/*" element={<DriverApp />} />
      </Routes>
    </BrowserRouter>
  );
}
