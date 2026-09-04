import React from 'react';
import { Bell, X, Check, Truck, ShieldCheck, DollarSign, PackageCheck } from 'lucide-react';

export default function NotificationDrawer({ isOpen, onClose, notifications, onMarkAllRead, onNotificationClick }) {
  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'booking':
        return <Truck size={18} color="#F97316" />;
      case 'verification':
        return <ShieldCheck size={18} color="#2563EB" />;
      case 'finance':
        return <DollarSign size={18} color="#F59E0B" />;
      case 'delivered':
        return <PackageCheck size={18} color="#10B981" />;
      default:
        return <Bell size={18} color="#64748B" />;
    }
  };

  return (
    <div className="modal-overlay" style={{ justifyContent: 'flex-end', padding: 0 }}>
      <div 
        className="modal-content"
        style={{
          height: '100vh',
          maxHeight: '100vh',
          maxWidth: '400px',
          borderRadius: 0,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Bell size={22} color="#F97316" />
            <div>
              <h3 className="title-md" style={{ margin: 0 }}>Notifications</h3>
              <p className="subtitle" style={{ fontSize: '0.8rem' }}>
                {unreadCount > 0 ? `${unreadCount} unread update${unreadCount > 1 ? 's' : ''}` : 'All caught up'}
              </p>
            </div>
          </div>
          <button className="btn-ghost" onClick={onClose} style={{ padding: '6px' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '12px 24px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'flex-end' }}>
          {unreadCount > 0 && (
            <button 
              onClick={onMarkAllRead}
              className="btn-ghost"
              style={{ fontSize: '0.8rem', color: '#F97316', padding: '4px 8px', fontWeight: 600 }}
            >
              <Check size={14} /> Mark all as read
            </button>
          )}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          {notifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 16px', color: '#64748B' }}>
              <Bell size={40} style={{ opacity: 0.3, marginBottom: '12px' }} />
              <p>No notifications yet</p>
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => onNotificationClick(item)}
                style={{
                  padding: '14px',
                  borderRadius: '12px',
                  backgroundColor: item.read ? '#FFFFFF' : '#FFF7ED',
                  border: `1px solid ${item.read ? '#E2E8F0' : '#FFEDD5'}`,
                  marginBottom: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
              >
                {!item.read && (
                  <span 
                    style={{
                      position: 'absolute',
                      top: '14px',
                      right: '14px',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#F97316'
                    }}
                  />
                )}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: '#F1F5F9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {getNotificationIcon(item.type)}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.88rem', fontWeight: '700', color: '#0F172A', marginBottom: '4px', paddingRight: '12px' }}>
                      {item.title}
                    </h4>
                    <p style={{ fontSize: '0.82rem', color: '#475569', marginBottom: '6px', lineHeight: '1.4' }}>
                      {item.message}
                    </p>
                    <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: '500' }}>
                      {item.timestamp}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
