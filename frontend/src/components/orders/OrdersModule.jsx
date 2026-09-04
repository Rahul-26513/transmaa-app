import React, { useState } from 'react';
import OrderCard from './OrderCard';
import OrderHistoryTable from './OrderHistoryTable';
import EmptyState from '../common/EmptyState';
import { Package, Clock, ShieldCheck, Truck, CheckCheck, Filter } from 'lucide-react';

export default function OrdersModule({ 
  orders, 
  onAcceptOrder, 
  onRejectOrder, 
  onSimulateDriverAccept,
  onSendMessageOrder, 
  onMarkDeliveredOrder,
  defaultTab = 'waiting'
}) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [goodsFilter, setGoodsFilter] = useState('All');

  // Filter orders by active tab status
  const getOrdersForTab = () => {
    let list = [];
    switch (activeTab) {
      case 'waiting':
        list = orders.filter(o => o.status === 'waiting');
        break;
      case 'accepted':
        list = orders.filter(o => o.status === 'accepted');
        break;
      case 'driver_accepted':
        list = orders.filter(o => o.status === 'driver_accepted');
        break;
      case 'on_the_way':
        list = orders.filter(o => o.status === 'on_the_way');
        break;
      case 'delivered':
        list = orders.filter(o => o.status === 'delivered' || o.status === 'rejected');
        break;
      default:
        list = orders;
    }

    if (goodsFilter !== 'All') {
      list = list.filter(o => o.goodsType === goodsFilter);
    }
    return list;
  };

  const currentTabOrders = getOrdersForTab();

  const tabs = [
    { 
      id: 'waiting', 
      label: 'Orders Waiting', 
      sublabel: 'Pending Staff Verification',
      icon: Clock, 
      count: orders.filter(o => o.status === 'waiting').length,
      badgeColor: 'bg-amber-500 text-white'
    },
    { 
      id: 'accepted', 
      label: 'Accepted Orders', 
      sublabel: 'Awaiting Driver Acceptance',
      icon: ShieldCheck, 
      count: orders.filter(o => o.status === 'accepted').length,
      badgeColor: 'bg-blue-600 text-white'
    },
    { 
      id: 'driver_accepted', 
      label: 'Driver Accepted', 
      sublabel: 'Ready for Confirmation SMS',
      icon: Package, 
      count: orders.filter(o => o.status === 'driver_accepted').length,
      badgeColor: 'bg-indigo-600 text-white'
    },
    { 
      id: 'on_the_way', 
      label: 'Orders On The Way', 
      sublabel: 'In Transit / To Be Delivered',
      icon: Truck, 
      count: orders.filter(o => o.status === 'on_the_way').length,
      badgeColor: 'bg-orange-500 text-white'
    },
    { 
      id: 'delivered', 
      label: 'Delivered / History', 
      sublabel: 'Completed & Log Table',
      icon: CheckCheck, 
      count: orders.filter(o => o.status === 'delivered').length,
      badgeColor: 'bg-emerald-600 text-white'
    }
  ];

  const goodsTypesList = [
    'All',
    'House Shifting',
    'Timber/Plywood',
    'Electrical/Electronics',
    'General',
    'Building/Construction',
    'Catering',
    'Machines/Equipment',
    'Textile/Garments',
    'Furniture',
    'Ceramics/Sanitary',
    'Paper/Packaging'
  ];

  return (
    <div className="space-y-6">
      
      {/* Module Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Package className="w-7 h-7 text-[#FF6B35]" />
            <span>Orders Management Module</span>
          </h2>
          <p className="text-xs font-medium text-slate-500 mt-1">
            Verify incoming customer load requests, assign driver fleets, dispatch SMS, and track deliveries.
          </p>
        </div>

        {/* Filter by Goods Type dropdown */}
        {activeTab !== 'delivered' && (
          <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-2xl border border-slate-200 shadow-sm">
            <Filter className="w-4 h-4 text-[#FF6B35]" />
            <span className="text-xs font-bold text-slate-600">Goods Type:</span>
            <select
              value={goodsFilter}
              onChange={(e) => setGoodsFilter(e.target.value)}
              className="text-xs font-bold text-slate-900 bg-transparent focus:outline-none cursor-pointer"
            >
              {goodsTypesList.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Tabs Bar */}
      <div className="bg-slate-200/70 p-1.5 rounded-2xl flex flex-nowrap overflow-x-auto gap-1 scrollbar-none border border-slate-200">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => {
                setActiveTab(t.id);
                setGoodsFilter('All');
              }}
              className={`flex-1 min-w-[170px] flex items-center justify-between px-3.5 py-3 rounded-xl transition-all duration-200 text-left ${
                isActive
                  ? 'bg-white text-slate-900 shadow-md border border-slate-200'
                  : 'text-slate-600 hover:bg-white/60 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className={`p-2 rounded-lg ${isActive ? 'bg-orange-100 text-[#FF6B35]' : 'bg-slate-100 text-slate-500'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold truncate">{t.label}</p>
                  <p className="text-[10px] font-medium text-slate-400 truncate hidden lg:block">{t.sublabel}</p>
                </div>
              </div>

              {t.count > 0 && (
                <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full ml-1 ${t.badgeColor}`}>
                  {t.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content Display */}
      {activeTab === 'delivered' ? (
        <OrderHistoryTable orders={orders} />
      ) : currentTabOrders.length === 0 ? (
        <EmptyState 
          icon={Package}
          title={`No orders in "${tabs.find(t => t.id === activeTab)?.label}"`}
          description="There are currently no load requests waiting in this category status."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {currentTabOrders.map((ord) => (
            <OrderCard
              key={ord.id}
              order={ord}
              currentTab={activeTab}
              onAccept={onAcceptOrder}
              onReject={onRejectOrder}
              onSimulateDriverAccept={onSimulateDriverAccept}
              onSendMessage={onSendMessageOrder}
              onMarkDelivered={onMarkDeliveredOrder}
            />
          ))}
        </div>
      )}

    </div>
  );
}
