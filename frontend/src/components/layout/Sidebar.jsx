import React from 'react';
import { 
  Package, 
  Users, 
  ShoppingCart, 
  Building2, 
  Bell, 
  X, 
  Truck, 
  ChevronRight,
  ShieldCheck,
  Zap
} from 'lucide-react';

export default function Sidebar({ 
  activeModule, 
  setActiveModule, 
  isMobileOpen, 
  setIsMobileOpen,
  counts 
}) {
  const navItems = [
    {
      id: 'orders',
      label: 'Orders',
      icon: Package,
      badge: counts.waitingOrders,
      badgeColor: 'bg-amber-500 text-white'
    },
    {
      id: 'drivers',
      label: 'Drivers',
      icon: Users,
      badge: counts.pendingDrivers,
      badgeColor: 'bg-blue-600 text-white'
    },
    {
      id: 'buysell',
      label: 'Buy & Sell',
      icon: ShoppingCart,
      badge: counts.pendingListings,
      badgeColor: 'bg-emerald-600 text-white'
    },
    {
      id: 'finance',
      label: 'Finance & Insurance',
      icon: Building2,
      badge: counts.pendingFinance,
      badgeColor: 'bg-purple-600 text-white'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      badge: counts.unreadNotifs,
      badgeColor: 'bg-red-500 text-white'
    }
  ];

  const handleSelectModule = (id) => {
    setActiveModule(id);
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  const SidebarContent = () => (
    <div
      className="flex flex-col h-full text-slate-300"
      style={{ background: 'linear-gradient(180deg, #1E293B 0%, #0F172A 100%)' }}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 bg-slate-950 border-b border-slate-800">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleSelectModule('orders')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF6B35] to-[#F7931E] flex items-center justify-center shadow-lg shadow-orange-500/20 text-white font-bold">
            <Truck className="w-6 h-6" />
          </div>
          <div className="hidden lg:block md:group-hover:block">
            <h1 className="font-brand text-xl font-extrabold tracking-tight text-white flex items-center gap-1">
              Tran<span className="text-[#FF6B35]">Smaa</span>
            </h1>
            <p className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Ops Console</p>
          </div>
        </div>

        {/* Mobile Close Button */}
        <button 
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden md:hidden text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          aria-label="Close sidebar"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Staff Status Indicator */}
      <div className="px-4 py-3 border-b border-slate-800/60 hidden lg:block">
        <div className="bg-slate-800/70 rounded-lg p-2.5 flex items-center justify-between border border-slate-700/50">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-medium text-slate-200">Hyderabad Hub Live</span>
          </div>
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="px-2 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider hidden lg:block">
          Operations Modules
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleSelectModule(item.id)}
              className={`w-full flex items-center justify-between px-3 py-3 rounded-xl font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-to-r from-[#FF6B35] to-[#F7931E] text-white shadow-md shadow-orange-500/20'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3 min-w-0">
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} />
                <span className="text-sm font-semibold truncate hidden lg:block">{item.label}</span>
              </div>
              
              <div className="flex items-center space-x-1">
                {item.badge > 0 && (
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
                <ChevronRight className={`w-4 h-4 hidden lg:block transition-transform ${isActive ? 'text-white translate-x-0.5' : 'opacity-0 group-hover:opacity-100 text-slate-400'}`} />
              </div>
            </button>
          );
        })}
      </nav>

      {/* Quick Help / System Footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40">
        <div className="bg-slate-800/40 rounded-xl p-3 border border-slate-700/40 hidden lg:block">
          <div className="flex items-center space-x-2 text-amber-400 mb-1">
            <Zap className="w-4 h-4" />
            <span className="text-xs font-bold">Staff Hotline</span>
          </div>
          <p className="text-[11px] text-slate-400">Emergency support: +91 1800-TRANSMAA</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop / Tablet Sidebar */}
      <aside className="hidden md:flex md:w-20 lg:w-64 flex-col fixed inset-y-0 left-0 z-30 transition-all duration-300">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out lg:hidden md:hidden ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
