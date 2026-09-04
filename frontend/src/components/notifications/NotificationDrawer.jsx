import React from 'react';
import { X, Bell, CheckCheck, ArrowRight, Package, Users, ShoppingCart, CreditCard } from 'lucide-react';

export default function NotificationDrawer({ 
  isOpen, 
  onClose, 
  notifications, 
  onNavigateToTab, 
  onMarkAsRead,
  onMarkAllAsRead 
}) {
  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col">
          
          {/* Header */}
          <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-[#FF6B35]" />
              <h3 className="text-base font-extrabold">Notifications ({unreadCount} Unread)</h3>
            </div>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Actions */}
          {unreadCount > 0 && (
            <div className="px-5 py-2.5 bg-orange-50 border-b border-orange-100 flex items-center justify-between text-xs">
              <span className="font-bold text-orange-900">New operational alerts</span>
              <button 
                onClick={onMarkAllAsRead}
                className="font-extrabold text-[#FF6B35] hover:underline flex items-center gap-1"
              >
                <CheckCheck className="w-3.5 h-3.5" /> Mark all read
              </button>
            </div>
          )}

          {/* Notification Items */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">
                No notifications right now.
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => {
                    onMarkAsRead(notif.id);
                    onNavigateToTab(notif.module, notif.tab);
                    onClose();
                  }}
                  className={`p-4 rounded-2xl cursor-pointer transition-colors my-1 ${
                    notif.unread ? 'bg-orange-50/60 hover:bg-orange-100/60 font-semibold' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <p className="text-xs font-extrabold text-slate-900">{notif.title}</p>
                    <span className="text-[10px] font-bold text-slate-400">{notif.time}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-snug">{notif.message}</p>
                  <div className="mt-2 flex items-center justify-end text-[11px] font-bold text-[#FF6B35]">
                    <span>Action item →</span>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
