import React, { useState } from 'react';
import { 
  User, 
  Phone, 
  Calendar, 
  Award, 
  Truck, 
  FileText, 
  CreditCard, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  XCircle,
  ShieldCheck,
  MapPin,
  Clock
} from 'lucide-react';

export default function DriverCard({ driver, onApprove, onReject }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
      
      {/* Top Header Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center space-x-4">
          <img 
            src={driver.photo} 
            alt={driver.name}
            className="w-14 h-14 rounded-2xl object-cover ring-2 ring-blue-500/30 flex-shrink-0"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-extrabold text-slate-900">{driver.name}</h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                Pending Approval
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 mt-0.5">
              <Phone className="w-3.5 h-3.5 text-[#FF6B35]" /> {driver.phone} • Applied {driver.appliedDate}
            </p>
          </div>
        </div>

        {/* Quick Highlights & Expand Toggle */}
        <div className="flex items-center space-x-3 justify-between sm:justify-end">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-slate-800">{driver.vehicleType}</p>
            <p className="text-[11px] font-semibold text-slate-500">{driver.vehicleNumber}</p>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors"
          >
            <span>{isExpanded ? 'Hide Details' : 'Full Profile'}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expandable Details Panel */}
      {isExpanded && (
        <div className="pt-4 space-y-4 animate-in fade-in duration-150">
          
          {/* Bio section */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Driver Bio & Overview</p>
            <p className="text-xs text-slate-700 font-semibold leading-relaxed">{driver.bio}</p>
          </div>

          {/* Personal Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Gender & Age</p>
              <p className="font-bold text-slate-800 mt-0.5">{driver.gender} ({driver.dob})</p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Driving Experience</p>
              <p className="font-bold text-emerald-700 mt-0.5">{driver.experienceYears} Years</p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Driving License (DL)</p>
              <p className="font-extrabold text-slate-900 mt-0.5">{driver.dlNumber}</p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase">PAN Card Number</p>
              <p className="font-extrabold text-slate-900 mt-0.5">{driver.panNumber}</p>
            </div>
          </div>

          {/* Vehicle Information */}
          <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-md">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-blue-600 uppercase">Registered Vehicle</p>
                <p className="font-extrabold text-slate-900 text-sm">{driver.vehicleModel} ({driver.vehicleType})</p>
              </div>
            </div>
            <div className="bg-white px-3.5 py-1.5 rounded-xl border border-blue-200 font-extrabold text-slate-900">
              RC: {driver.vehicleNumber}
            </div>
          </div>

        </div>
      )}

      {/* Action Footer Buttons */}
      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400">Staff verification action required</span>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onReject(driver.id)}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold transition-all"
          >
            <XCircle className="w-4 h-4" />
            <span>Reject Profile</span>
          </button>
          <button
            onClick={() => onApprove(driver.id)}
            className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-500/20"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Approve & Verify</span>
          </button>
        </div>
      </div>

    </div>
  );
}
