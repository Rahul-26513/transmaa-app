import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Search, 
  Filter, 
  Phone, 
  CheckSquare, 
  Square, 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2, 
  Clock,
  MessageSquare
} from 'lucide-react';

export default function FinanceModule({ enquiries, onToggleContactedStatus }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); // all | Finance | Insurance
  const [statusFilter, setStatusFilter] = useState('all'); // all | pending | contacted

  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((enq) => {
      const matchesSearch = 
        enq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enq.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enq.vehicleType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enq.rcNumber.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = typeFilter === 'all' || enq.enquiryType.toLowerCase() === typeFilter.toLowerCase();
      const matchesStatus = statusFilter === 'all' || enq.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [enquiries, searchTerm, typeFilter, statusFilter]);

  const financeCount = enquiries.filter(e => e.enquiryType === 'Finance').length;
  const insuranceCount = enquiries.filter(e => e.enquiryType === 'Insurance').length;
  const pendingCount = enquiries.filter(e => e.status === 'pending').length;

  return (
    <div className="space-y-6">
      
      {/* Module Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Building2 className="w-7 h-7 text-[#FF6B35]" />
            <span>Finance & Insurance Module</span>
          </h2>
          <p className="text-xs font-medium text-slate-500 mt-1">
            Manage customer loan requests & commercial vehicle insurance leads. Follow up and mark contacted.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-purple-100 text-purple-800 font-extrabold border border-purple-200">
            {financeCount} Finance Leads
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-blue-100 text-blue-800 font-extrabold border border-blue-200">
            {insuranceCount} Insurance Leads
          </span>
        </div>
      </div>

      {/* Main Card & Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Filters Header Bar */}
        <div className="p-4 sm:p-6 border-b border-slate-200 bg-slate-50/50 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search lead name, phone, vehicle..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/40"
              />
            </div>

            {/* Type Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="py-2 px-3 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/40 font-semibold text-slate-700"
              >
                <option value="all">All Lead Types (Finance & Insurance)</option>
                <option value="finance">Finance Leads Only</option>
                <option value="insurance">Insurance Leads Only</option>
              </select>
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-2 px-3 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/40 font-semibold text-slate-700"
            >
              <option value="all">All Follow-up Statuses</option>
              <option value="pending">Pending Follow-up ({pendingCount})</option>
              <option value="contacted">Already Contacted</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Contact Action</th>
                <th className="py-3.5 px-4">Applicant Name</th>
                <th className="py-3.5 px-4">Phone Number</th>
                <th className="py-3.5 px-4">Vehicle Type</th>
                <th className="py-3.5 px-4">RC Number</th>
                <th className="py-3.5 px-4">Enquiry Type</th>
                <th className="py-3.5 px-4">Submitted Date</th>
                <th className="py-3.5 px-4">Staff Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {filteredEnquiries.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 font-semibold">
                    No finance or insurance lead submissions match your selected filter.
                  </td>
                </tr>
              ) : (
                filteredEnquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* Checkbox Action */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => onToggleContactedStatus(enq.id)}
                        className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl font-extrabold text-xs transition-all ${
                          enq.status === 'contacted'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
                        }`}
                      >
                        {enq.status === 'contacted' ? (
                          <>
                            <CheckSquare className="w-4 h-4 text-emerald-600" />
                            <span>Contacted</span>
                          </>
                        ) : (
                          <>
                            <Square className="w-4 h-4 text-amber-600" />
                            <span>Mark Contacted</span>
                          </>
                        )}
                      </button>
                    </td>

                    <td className="py-3.5 px-4 font-extrabold text-slate-900">
                      {enq.name}
                    </td>

                    <td className="py-3.5 px-4">
                      <a href={`tel:${enq.phone}`} className="text-[#FF6B35] font-bold hover:underline flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5" /> {enq.phone}
                      </a>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      {enq.vehicleType}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {enq.rcNumber}
                    </td>

                    {/* Enquiry Type Tag */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {enq.enquiryType === 'Finance' ? (
                        <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-purple-100 text-purple-800 border border-purple-300 inline-flex items-center gap-1">
                          <CreditCard className="w-3 h-3 text-purple-600" /> Finance
                          {enq.loanAmountRequested && ` (${enq.loanAmountRequested})`}
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-blue-100 text-blue-800 border border-blue-300 inline-flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-blue-600" /> Insurance
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 font-semibold whitespace-nowrap">
                      {enq.submittedDate}
                    </td>

                    <td className="py-3.5 px-4 max-w-xs text-slate-600 text-[11px] font-medium">
                      {enq.notes || '-'}
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs font-semibold text-slate-500">
          Showing {filteredEnquiries.length} of {enquiries.length} enquiry submissions
        </div>

      </div>

    </div>
  );
}
