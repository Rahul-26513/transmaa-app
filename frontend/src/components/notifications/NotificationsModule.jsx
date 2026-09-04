import React from 'react';
import { 
  Bell, 
  Package, 
  Users, 
  ShoppingCart, 
  CreditCard, 
  Check, 
  ArrowRight, 
  Clock,
  CheckCheck
} from 'lucide-react';
import EmptyState from '../common/EmptyState';

export default function NotificationsModule({ 
  notifications, 
  onNavigateToTab, 
  onMarkAsRead,
  onMarkAllAsRead 
}) {

  const getIcon = (type) => {
    switch (type) {
      case 'order':
        return <Package className="w-5 h-5 text-amber-600" />;
      case 'driver':
        return <Users className="w-5 h-5 text-blue-600" />;
      case 'listing':
        return <ShoppingCart className="w-5 h-5 text-emerald-600" />;
      case 'finance':
        return <CreditCard className="w-5 h-5 text-purple-600" />;
      default:
        return <Bell className="w-5 h-5 text-slate-600" />;
    }
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="space-y-6">
      
      {/* Module Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Bell className="w-7 h-7 text-[#FF6B35]" />
            <span>Notifications Activity Center</span>
          </h2>
          <p className="text-xs font-medium text-slate-500 mt-1">
            Real-time operational alerts for new order load requests, driver approvals, and vehicle listings.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={onMarkAllAsRead}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-orange-100 text-[#FF6B35] hover:bg-orange-200 text-xs font-extrabold transition-colors self-start sm:self-auto"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark All As Read</span>
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
        {notifications.length === 0 ? (
          <EmptyState 
            icon={Bell}
            title="No Notifications"
            description="You are all caught up! No active operational alerts at this time."
          />
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => {
                onMarkAsRead(notif.id);
                onNavigateToTab(notif.module, notif.tab);
              }}
              className={`p-5 flex items-start justify-between cursor-pointer transition-colors group ${
                notif.unread ? 'bg-orange-50/40 hover:bg-orange-50' : 'bg-white hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-2xl flex-shrink-0 ${
                  notif.type === 'order' ? 'bg-amber-100 border border-amber-200' :
                  notif.type === 'driver' ? 'bg-blue-100 border border-blue-200' :
                  notif.type === 'listing' ? 'bg-emerald-100 border border-emerald-200' : 'bg-purple-100 border border-purple-200'
                }`}>
                  {getIcon(notif.type)}
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-extrabold text-slate-900 group-hover:text-[#FF6B35] transition-colors">
                      {notif.title}
                    </h4>
                    {notif.unread && (
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 font-semibold mt-1 leading-snug">
                    {notif.message}
                  </p>
                  <p className="text-[11px] font-semibold text-slate-400 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {notif.time}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-xs font-bold text-[#FF6B35] group-hover:translate-x-1 transition-transform">
                <span className="hidden sm:inline">Jump to {notif.module}</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
