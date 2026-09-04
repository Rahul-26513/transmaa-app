import React, { useState } from 'react';
import DriverCard from './DriverCard';
import VerifiedDriversTable from './VerifiedDriversTable';
import EmptyState from '../common/EmptyState';
import { Users, Clock, ShieldCheck } from 'lucide-react';

export default function DriversModule({ 
  pendingDrivers, 
  verifiedDrivers, 
  onApproveDriver, 
  onRejectDriver,
  onToggleDriverStatus,
  defaultTab = 'pending'
}) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <div className="space-y-6">
      
      {/* Module Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-7 h-7 text-[#FF6B35]" />
            <span>Drivers Management Module</span>
          </h2>
          <p className="text-xs font-medium text-slate-500 mt-1">
            Verify newly registered truck driver profiles, review documents (DL & PAN), and audit verified fleet status.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-slate-200/70 p-1.5 rounded-2xl flex max-w-md gap-1 border border-slate-200">
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'pending'
              ? 'bg-white text-slate-900 shadow-md border border-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Clock className="w-4 h-4 text-amber-500" />
          <span>Pending Verification</span>
          {pendingDrivers.length > 0 && (
            <span className="bg-amber-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full ml-1">
              {pendingDrivers.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('verified')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'verified'
              ? 'bg-white text-slate-900 shadow-md border border-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>Verified Drivers</span>
          <span className="bg-blue-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full ml-1">
            {verifiedDrivers.length}
          </span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'pending' ? (
        pendingDrivers.length === 0 ? (
          <EmptyState 
            icon={Users}
            title="No Pending Driver Approvals"
            description="All driver registrations have been reviewed and processed by staff."
          />
        ) : (
          <div className="space-y-4">
            {pendingDrivers.map((driver) => (
              <DriverCard 
                key={driver.id} 
                driver={driver} 
                onApprove={onApproveDriver} 
                onReject={onRejectDriver} 
              />
            ))}
          </div>
        )
      ) : (
        <VerifiedDriversTable 
          drivers={verifiedDrivers} 
          onToggleDriverStatus={onToggleDriverStatus} 
        />
      )}

    </div>
  );
}
