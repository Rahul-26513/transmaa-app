import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Menu, 
  User, 
  LogOut, 
  CheckCircle2, 
  HelpCircle,
  Truck,
  PhoneCall,
  X
} from 'lucide-react';

export default function TopBar({
  onToggleMobileSidebar,
  unreadCount,
  onOpenNotifications,
  searchQuery,
  setSearchQuery,
  searchResults,
  onSelectSearchResult,
  staff,
  onLogout
}) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setShowSearchDropdown(query.trim().length > 0);
  };

  const handleSelectResult = (item) => {
    setShowSearchDropdown(false);
    onSelectSearchResult(item);
  };

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm transition-all duration-200">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        
        {/* Left Section: Mobile Drawer Toggle & Search */}
        <div className="flex items-center space-x-3 flex-1 max-w-xl">
          <button
            onClick={onToggleMobileSidebar}
            className="md:hidden text-slate-600 hover:text-slate-900 p-2 rounded-xl hover:bg-slate-100 transition-colors"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Global Search Field */}
          <div className="relative w-full">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search orders, customers, drivers (+91), RC numbers..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => searchQuery.trim().length > 0 && setShowSearchDropdown(true)}
                className="w-full pl-10 pr-9 py-2 bg-slate-100/80 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/40 focus:border-[#FF6B35] transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setShowSearchDropdown(false);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Search Dropdown Results */}
            {showSearchDropdown && searchResults && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 max-h-96 overflow-y-auto z-50 p-2">
                {searchResults.length === 0 ? (
                  <div className="p-4 text-center text-sm text-slate-500">
                    No matching records found for "{searchQuery}"
                  </div>
                ) : (
                  <div>
                    <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Search Results ({searchResults.length})
                    </div>
                    {searchResults.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleSelectResult(item)}
                        className="p-2.5 hover:bg-orange-50 rounded-xl cursor-pointer transition-colors flex items-center justify-between group"
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                            item.type === 'order' ? 'bg-orange-100 text-orange-600' :
                            item.type === 'driver' ? 'bg-blue-100 text-blue-600' :
                            item.type === 'buysell' ? 'bg-emerald-100 text-emerald-600' : 'bg-purple-100 text-purple-600'
                          }`}>
                            {item.type === 'order' ? 'ORD' : item.type === 'driver' ? 'DRV' : item.type === 'buysell' ? 'SELL' : 'FIN'}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 group-hover:text-[#FF6B35]">{item.title}</p>
                            <p className="text-xs text-slate-500">{item.subtitle}</p>
                          </div>
                        </div>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {item.tag}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Section: Actions & Profile */}
        <div className="flex items-center space-x-3">
          
          {/* Notification Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2.5 text-slate-600 hover:text-[#FF6B35] hover:bg-orange-50 rounded-xl transition-all duration-200"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-gradient-to-r from-red-500 to-rose-600 text-white text-[10px] font-extrabold flex items-center justify-center shadow-md animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Vertical Divider */}
          <div className="h-6 w-px bg-slate-200 hidden sm:block" />

          {/* Staff Profile Avatar & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-3 p-1.5 rounded-xl hover:bg-slate-100 transition-colors focus:outline-none"
            >
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                  alt="Staff Avatar"
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-[#FF6B35]"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>
              <div className="text-left hidden lg:block">
                <p className="text-xs font-bold text-slate-900 leading-none">{staff?.name || 'Staff'}</p>
                <p className="text-[11px] font-medium text-slate-500 mt-0.5 capitalize">{staff?.role || 'staff'}</p>
              </div>
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div
                className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                onClick={() => setShowProfileMenu(false)}
              >
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-sm font-bold text-slate-900">{staff?.name || 'Staff'}</p>
                  <p className="text-xs text-slate-500">{staff?.email || (staff?.phone ? `+91 ${staff.phone}` : '')}</p>
                  <span className="mt-1 inline-block text-[10px] font-bold px-2 py-0.5 rounded-md bg-orange-100 text-orange-700 capitalize">
                    {staff?.role || 'staff'}
                  </span>
                </div>
                <div className="py-1">
                  <a href="#profile" className="flex items-center space-x-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                    <User className="w-4 h-4 text-slate-400" />
                    <span>My Staff Profile</span>
                  </a>
                  <a href="#support" className="flex items-center space-x-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                    <PhoneCall className="w-4 h-4 text-slate-400" />
                    <span>Hub Operations Desk</span>
                  </a>
                  <a href="#help" className="flex items-center space-x-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                    <HelpCircle className="w-4 h-4 text-slate-400" />
                    <span>Staff SOP & Guidelines</span>
                  </a>
                </div>
                <div className="border-t border-slate-100 pt-1">
                  <button
                    onClick={onLogout}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-xs font-bold text-red-600 hover:bg-rose-50 text-left"
                  >
                    <LogOut className="w-4 h-4 text-red-500" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
}
