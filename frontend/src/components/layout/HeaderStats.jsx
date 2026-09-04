import React from 'react';
import { PackageCheck, ShieldAlert, ShoppingBag, CreditCard, ArrowUpRight } from 'lucide-react';

export default function HeaderStats({ counts, onNavigateTab }) {
  const stats = [
    {
      title: 'Orders Waiting Verification',
      count: counts.waitingOrders,
      subtitle: 'Customer load requests',
      icon: PackageCheck,
      bgColor: 'bg-amber-50 shadow-amber-500/10 border-amber-200/80',
      iconColor: 'text-amber-600 bg-amber-100',
      targetModule: 'orders',
      targetTab: 'waiting'
    },
    {
      title: 'Driver Approvals Pending',
      count: counts.pendingDrivers,
      subtitle: 'New registrations',
      icon: ShieldAlert,
      bgColor: 'bg-blue-50 shadow-blue-500/10 border-blue-200/80',
      iconColor: 'text-blue-600 bg-blue-100',
      targetModule: 'drivers',
      targetTab: 'pending'
    },
    {
      title: 'Vehicle Listings to Review',
      count: counts.pendingListings,
      subtitle: 'Buy & Sell verification',
      icon: ShoppingBag,
      bgColor: 'bg-emerald-50 shadow-emerald-500/10 border-emerald-200/80',
      iconColor: 'text-emerald-600 bg-emerald-100',
      targetModule: 'buysell',
      targetTab: 'pending'
    },
    {
      title: 'Finance & Insurance Leads',
      count: counts.pendingFinance,
      subtitle: 'Enquiries requiring follow-up',
      icon: CreditCard,
      bgColor: 'bg-purple-50 shadow-purple-500/10 border-purple-200/80',
      iconColor: 'text-purple-600 bg-purple-100',
      targetModule: 'finance',
      targetTab: 'all'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            onClick={() => onNavigateTab(stat.targetModule, stat.targetTab)}
            className={`p-4 rounded-2xl border bg-white shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group flex flex-col justify-between`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.title}</p>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{stat.count}</h3>
              </div>
              <div className={`p-3 rounded-xl ${stat.iconColor} transition-transform group-hover:scale-110`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">{stat.subtitle}</span>
              <span className="font-bold text-[#FF6B35] flex items-center group-hover:translate-x-0.5 transition-transform">
                Manage <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
