import React, { useState, useMemo } from 'react';
import { Search, Filter, Phone, Truck, ShieldCheck, UserCheck, Star } from 'lucide-react';

export default function VerifiedDriversTable({ drivers, onToggleDriverStatus }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredDrivers = useMemo(() => {
    return drivers.filter((drv) => {
      const matchesSearch = 
        drv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        drv.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        drv.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        drv.vehicleType.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || drv.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [drivers, searchTerm, statusFilter]);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      
      {/* Search & Filter Header */}
      <div className="p-4 sm:p-6 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900">Verified Fleet Drivers</h3>
          <p className="text-xs font-medium text-slate-500">Active drivers verified by staff and eligible to receive customer load orders</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search driver name, phone, vehicle #..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/40 focus:border-[#FF6B35]"
            />
          </div>

          {/* Status Dropdown Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-2 px-3 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/40 font-semibold text-slate-700"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[750px]">
          <thead>
            <tr className="bg-slate-100/70 border-b border-slate-200 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-4">Driver Name</th>
              <th className="py-3.5 px-4">Phone Number</th>
              <th className="py-3.5 px-4">Vehicle Type</th>
              <th className="py-3.5 px-4">Vehicle Number</th>
              <th className="py-3.5 px-4">Experience</th>
              <th className="py-3.5 px-4">Current Assigned Order</th>
              <th className="py-3.5 px-4">Status & Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
            {filteredDrivers.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-500 font-semibold">
                  No verified drivers match your search query.
                </td>
              </tr>
            ) : (
              filteredDrivers.map((drv) => (
                <tr key={drv.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                        {drv.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-extrabold text-slate-900">{drv.name}</p>
                        {drv.rating && (
                          <p className="text-[10px] font-semibold text-amber-600 flex items-center gap-0.5">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {drv.rating} ({drv.tripsCompleted} trips)
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-800 font-semibold">
                    <a href={`tel:${drv.phone}`} className="text-[#FF6B35] hover:underline flex items-center gap-1">
                      <Phone className="w-3 h-3" /> {drv.phone}
                    </a>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-block px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                      {drv.vehicleType}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    {drv.vehicleNumber}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-emerald-700">
                    {drv.experienceYears} Yrs
                  </td>
                  <td className="py-3.5 px-4">
                    {drv.currentOrder && drv.currentOrder !== 'None (Available)' && drv.currentOrder !== 'None (Off Duty)' ? (
                      <span className="px-2 py-1 rounded-md text-[11px] font-bold bg-orange-100 text-orange-800 border border-orange-200">
                        {drv.currentOrder}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">None (Available)</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => onToggleDriverStatus(drv.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                        drv.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
                          : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${drv.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                      <span>{drv.status} (Toggle)</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs font-semibold text-slate-500">
        Total Verified Fleet Drivers: {drivers.length}
      </div>

    </div>
  );
}
