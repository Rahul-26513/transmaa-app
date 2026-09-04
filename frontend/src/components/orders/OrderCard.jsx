import React from 'react';
import { 
  User, 
  Phone, 
  MapPin, 
  Calendar, 
  Clock, 
  Truck, 
  Weight, 
  CheckCircle, 
  XCircle, 
  MessageSquare, 
  CheckCheck,
  Tag,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export default function OrderCard({ 
  order, 
  currentTab, 
  onAccept, 
  onReject, 
  onSimulateDriverAccept,
  onSendMessage, 
  onMarkDelivered 
}) {
  // Status color badges
  const getStatusBadge = (status) => {
    switch (status) {
      case 'waiting':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" /> Pending Verification</span>;
      case 'accepted':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Awaiting Driver Acceptance</span>;
      case 'driver_accepted':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-300 flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Driver Accepted</span>;
      case 'on_the_way':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 border border-orange-300 flex items-center gap-1.5"><Truck className="w-3.5 h-3.5 animate-bounce" /> To Be Delivered</span>;
      case 'delivered':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5"><CheckCheck className="w-3.5 h-3.5 text-emerald-600" /> Delivered</span>;
      case 'rejected':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1.5"><XCircle className="w-3.5 h-3.5 text-rose-600" /> Rejected</span>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between relative group">
      
      {/* Top Bar: Order ID & Status Badge */}
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-extrabold text-slate-900">{order.id}</span>
              <span className="text-xs font-semibold text-slate-400">• Created {order.createdAt}</span>
            </div>
            {/* Goods Type Dropdown-style Tag */}
            <div className="mt-1.5 flex items-center space-x-2">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-orange-50 text-[#FF6B35] border border-orange-200">
                <Tag className="w-3.5 h-3.5" />
                <span>{order.goodsType}</span>
              </span>
              <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                Est. {order.amount}
              </span>
            </div>
          </div>
          <div>{getStatusBadge(order.status)}</div>
        </div>

        {/* Customer & Driver Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 border-b border-slate-100">
          {/* Customer */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-slate-500" /> Customer Details
            </p>
            <p className="text-sm font-bold text-slate-900">{order.customerName}</p>
            <a 
              href={`tel:${order.customerPhone}`}
              className="text-xs font-semibold text-[#FF6B35] hover:underline flex items-center gap-1 mt-0.5"
            >
              <Phone className="w-3.5 h-3.5" /> {order.customerPhone}
            </a>
          </div>

          {/* Driver Details (if assigned) */}
          {(order.driverName || currentTab === 'driver_accepted' || currentTab === 'on_the_way' || currentTab === 'delivered') && (
            <div className="bg-blue-50/70 p-3.5 rounded-2xl border border-blue-100">
              <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-blue-600" /> Assigned Driver
              </p>
              <p className="text-sm font-bold text-slate-900">{order.driverName || 'Driver Pending'}</p>
              <a 
                href={`tel:${order.driverPhone}`}
                className="text-xs font-semibold text-blue-700 hover:underline flex items-center gap-1 mt-0.5"
              >
                <Phone className="w-3.5 h-3.5" /> {order.driverPhone || 'N/A'}
              </a>
              {order.driverVehicle && (
                <p className="text-[11px] font-semibold text-slate-500 mt-1 truncate">
                  Vehicle: {order.driverVehicle}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Pickup & Locations Section */}
        <div className="py-4 space-y-3">
          {/* Date & Time */}
          <div className="flex items-center text-xs font-bold text-slate-600 space-x-2 bg-amber-50/50 p-2.5 rounded-xl border border-amber-100">
            <Calendar className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>Pickup Schedule: {order.pickupDateTime}</span>
          </div>

          {/* From -> To Addresses */}
          <div className="space-y-2 text-xs">
            <div className="flex items-start space-x-2.5">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                FROM
              </div>
              <p className="text-slate-700 font-semibold leading-snug">{order.fromLocation}</p>
            </div>

            <div className="flex items-center ml-3 my-0.5">
              <div className="w-0.5 h-3 bg-slate-300 ml-2"></div>
            </div>

            <div className="flex items-start space-x-2.5">
              <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                TO
              </div>
              <p className="text-slate-700 font-semibold leading-snug">{order.toLocation}</p>
            </div>
          </div>

          {/* Requested Truck Specs Tag */}
          <div className="pt-2 flex items-center justify-between text-xs bg-slate-100/70 p-3 rounded-2xl border border-slate-200">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-white rounded-lg text-slate-700 shadow-sm border border-slate-200">
                <Truck className="w-4 h-4 text-[#FF6B35]" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Truck Requested</p>
                <p className="font-bold text-slate-800">{order.truckType}</p>
              </div>
            </div>

            <div className="flex items-center space-x-1 font-bold text-slate-700 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
              <Weight className="w-3.5 h-3.5 text-amber-600" />
              <span>Cap: {order.capacity}</span>
            </div>
          </div>

        </div>
      </div>

      {/* Action Buttons Footer */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
        {/* Tab 1: Orders Waiting (Accept / Reject) */}
        {currentTab === 'waiting' && (
          <>
            <button
              onClick={() => onReject(order.id)}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold transition-all"
            >
              <XCircle className="w-4 h-4" />
              <span>Reject</span>
            </button>
            <button
              onClick={() => onAccept(order.id)}
              className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-500/20"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Accept Order</span>
            </button>
          </>
        )}

        {/* Tab 2: Accepted Orders (Awaiting Driver + Simulate Driver Acceptance) */}
        {currentTab === 'accepted' && (
          <div className="w-full flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Broadcasting load to nearby drivers...</span>
            <button
              onClick={() => onSimulateDriverAccept(order.id)}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Simulate Driver Acceptance</span>
            </button>
          </div>
        )}

        {/* Tab 3: Driver Accepted Orders (Send Message button) */}
        {currentTab === 'driver_accepted' && (
          <button
            onClick={() => onSendMessage(order.id)}
            className="w-full flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#F7931E] hover:opacity-95 text-white text-xs font-bold transition-all shadow-lg shadow-orange-500/25"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Send SMS & Confirmation (Move to On The Way)</span>
          </button>
        )}

        {/* Tab 4: Orders On The Way (Mark Delivered button) */}
        {currentTab === 'on_the_way' && (
          <button
            onClick={() => onMarkDelivered(order.id)}
            className="w-full flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-500/25"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark Delivered (Move to History)</span>
          </button>
        )}

        {/* Tab 5: History / Delivered */}
        {currentTab === 'delivered' && (
          <div className="w-full flex items-center justify-between text-xs text-slate-500">
            <span>Delivered at {order.completedAt || 'Completed'}</span>
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <CheckCheck className="w-4 h-4" /> Verified Complete
            </span>
          </div>
        )}
      </div>

    </div>
  );
}
