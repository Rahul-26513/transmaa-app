import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ArrowUpDown, 
  Filter, 
  Calendar, 
  User, 
  Truck, 
  CheckCheck, 
  XCircle,
  FileSpreadsheet,
  Download
} from 'lucide-react';

export default function OrderHistoryTable({ orders }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('id');
  const [sortOrder, setSortOrder] = useState('desc');

  // Filtered & Sorted orders
  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      const matchesSearch = 
        ord.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ord.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ord.driverName && ord.driverName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        ord.goodsType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ord.fromLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ord.toLocation.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || ord.status === statusFilter;

      return matchesSearch && matchesStatus;
    }).sort((a, b) => {
      let aVal = a[sortField] || '';
      let bVal = b[sortField] || '';
      
      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [orders, searchTerm, statusFilter, sortField, sortOrder]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      
      {/* Header Filters & Search Bar */}
      <div className="p-4 sm:p-6 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900">Delivered & Orders History Log</h3>
          <p className="text-xs font-medium text-slate-500">Comprehensive database of all processed orders and deliveries</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search customer, driver, route..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/40 focus:border-[#FF6B35]"
            />
          </div>

          {/* Status Filter Dropdown */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-2 px-3 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/40 font-semibold text-slate-700"
            >
              <option value="all">All Statuses</option>
              <option value="delivered">Delivered Only</option>
              <option value="rejected">Rejected / Cancelled</option>
              <option value="on_the_way">On The Way</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-slate-100/70 border-b border-slate-200 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-4 cursor-pointer hover:text-slate-800" onClick={() => handleSort('id')}>
                <div className="flex items-center space-x-1">
                  <span>Order ID</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3.5 px-4 cursor-pointer hover:text-slate-800" onClick={() => handleSort('customerName')}>
                <div className="flex items-center space-x-1">
                  <span>Customer</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3.5 px-4 cursor-pointer hover:text-slate-800" onClick={() => handleSort('driverName')}>
                <div className="flex items-center space-x-1">
                  <span>Driver</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3.5 px-4">Route (From → To)</th>
              <th className="py-3.5 px-4 cursor-pointer hover:text-slate-800" onClick={() => handleSort('goodsType')}>
                <div className="flex items-center space-x-1">
                  <span>Goods Type</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3.5 px-4 cursor-pointer hover:text-slate-800" onClick={() => handleSort('pickupDateTime')}>
                <div className="flex items-center space-x-1">
                  <span>Date & Time</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3.5 px-4 cursor-pointer hover:text-slate-800" onClick={() => handleSort('status')}>
                <div className="flex items-center space-x-1">
                  <span>Status</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-500 font-semibold">
                  No order history records match your filters.
                </td>
              </tr>
            ) : (
              filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-extrabold text-slate-900">
                    {ord.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-900">{ord.customerName}</p>
                    <p className="text-[11px] text-slate-500">{ord.customerPhone}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-900">{ord.driverName || 'Unassigned'}</p>
                    <p className="text-[11px] text-slate-500">{ord.driverPhone || '-'}</p>
                  </td>
                  <td className="py-3.5 px-4 max-w-xs">
                    <div className="truncate font-semibold text-slate-800" title={`${ord.fromLocation} → ${ord.toLocation}`}>
                      <span className="text-emerald-700 font-bold">{ord.fromLocation.split(',')[0]}</span>
                      <span className="mx-1 text-slate-400">→</span>
                      <span className="text-rose-700 font-bold">{ord.toLocation.split(',')[0]}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-bold bg-orange-50 text-orange-700 border border-orange-200">
                      {ord.goodsType}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-semibold whitespace-nowrap">
                    {ord.pickupDateTime}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {ord.status === 'delivered' ? (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 inline-flex items-center gap-1">
                        <CheckCheck className="w-3 h-3 text-emerald-600" /> Delivered
                      </span>
                    ) : ord.status === 'rejected' ? (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300 inline-flex items-center gap-1">
                        <XCircle className="w-3 h-3 text-rose-600" /> Rejected
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-orange-100 text-orange-800 border border-orange-300 inline-flex items-center gap-1">
                        <Truck className="w-3 h-3 text-orange-600" /> In Progress
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer count */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs font-semibold text-slate-500 flex justify-between items-center">
        <span>Showing {filteredOrders.length} of {orders.length} total orders</span>
        <button 
          onClick={() => alert("Order history export feature: CSV generated successfully!")}
          className="flex items-center space-x-1 text-[#FF6B35] font-bold hover:underline"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV Report</span>
        </button>
      </div>

    </div>
  );
}
