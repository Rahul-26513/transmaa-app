import React from 'react';
import {
  X, MapPin, Calendar, Truck, PhoneCall, User, FileText, CheckCheck, Navigation
} from 'lucide-react';
import { formatDateTime } from '../../utils/format';

const STATUS_LABEL = {
  driver_accepted: 'Accepted',
  on_the_way: "Order's to be delivered",
  delivered: 'Delivered'
};

export default function LoadDetailModal({ load, onClose, onStartTrip, onDeliver }) {
  if (!load) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '560px' }}>

        <div className="modal-header">
          <div>
            <span className={`badge ${load.status === 'delivered' ? 'badge-delivered' : 'badge-ontheway'}`}>
              {STATUS_LABEL[load.status] || load.status}
            </span>
            <h3 className="title-md" style={{ marginTop: '6px', marginBottom: 0 }}>
              Load Details
            </h3>
          </div>
          <button className="btn-ghost" onClick={onClose} style={{ padding: '6px' }}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">

          {/* Route */}
          <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '14px', marginBottom: '16px' }}>
            <div style={{ marginBottom: '8px' }}>
              <MapPin size={14} color="#10B981" style={{ verticalAlign: 'middle', marginRight: '4px' }} />
              <strong>Pickup:</strong> {load.fromLocation}
            </div>
            <div>
              <MapPin size={14} color="#EF4444" style={{ verticalAlign: 'middle', marginRight: '4px' }} />
              <strong>Drop:</strong> {load.toLocation}
            </div>
          </div>

          {/* Schedule + Truck */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '16px' }}>
            <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '14px' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748B', display: 'block', marginBottom: '4px' }}>Schedule</span>
              <div style={{ fontSize: '0.88rem' }}>
                <Calendar size={14} color="#F97316" style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                {formatDateTime(load.shiftingDate)}{load.shiftingTime ? `, ${load.shiftingTime}` : ''}
              </div>
            </div>
            <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '14px' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748B', display: 'block', marginBottom: '4px' }}>Truck</span>
              <div style={{ fontSize: '0.88rem' }}>
                <Truck size={14} color="#3B82F6" style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                {load.truckType}{load.truckCapacity ? ` (${load.truckCapacity})` : ''}
              </div>
            </div>
          </div>

          {/* Goods */}
          <div style={{ marginBottom: '16px' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Goods Category</span>
            <strong style={{ fontSize: '0.9rem', color: '#0F172A' }}>{load.goodsType}</strong>
            {load.loadWeight && (
              <span style={{ fontSize: '0.8rem', color: '#64748B', display: 'block', marginTop: '2px' }}>
                Weight / Quantity: {load.loadWeight}
              </span>
            )}
            {load.description && (
              <p style={{ fontSize: '0.85rem', color: '#475569', marginTop: '6px' }}>{load.description}</p>
            )}
          </div>

          {/* Special Instructions */}
          {load.specialInstructions && (
            <div style={{ backgroundColor: '#FFF7ED', border: '1.5px solid #FFEDD5', borderRadius: '12px', padding: '14px', marginBottom: '16px' }}>
              <span style={{ fontSize: '0.75rem', color: '#9A3412', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                <FileText size={13} /> Special Instructions
              </span>
              <p style={{ fontSize: '0.85rem', color: '#0F172A', margin: 0 }}>{load.specialInstructions}</p>
            </div>
          )}

          {/* Customer Contact */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', padding: '14px', border: '1px solid #E2E8F0', borderRadius: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={18} />
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748B', display: 'block' }}>Customer</span>
                <strong style={{ fontSize: '0.9rem', color: '#0F172A' }}>{load.customerName}</strong>
              </div>
            </div>
            <a href={`tel:${load.customerPhone}`} className="btn btn-outline btn-sm">
              <PhoneCall size={14} /> {load.customerPhone}
            </a>
          </div>

          {/* Delivery Contact (if different from booking customer) */}
          {(load.deliveryName || load.deliveryPhone || load.deliveryAddress) && (
            <div style={{ padding: '14px', border: '1px solid #E2E8F0', borderRadius: '12px', marginBottom: '16px' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748B', display: 'block', marginBottom: '4px' }}>Delivery Contact</span>
              {load.deliveryName && <strong style={{ fontSize: '0.9rem', color: '#0F172A', display: 'block' }}>{load.deliveryName}</strong>}
              {load.deliveryPhone && (
                <a href={`tel:${load.deliveryPhone}`} style={{ fontSize: '0.85rem', color: '#F97316', fontWeight: 600 }}>
                  {load.deliveryPhone}
                </a>
              )}
              {load.deliveryAddress && (
                <p style={{ fontSize: '0.85rem', color: '#475569', marginTop: '4px' }}>{load.deliveryAddress}</p>
              )}
            </div>
          )}

          {/* Fare */}
          {(load.customerExpectedCost || load.price) && (
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #E2E8F0', paddingTop: '14px', marginBottom: '20px' }}>
              {load.customerExpectedCost && (
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#64748B', display: 'block' }}>Customer Expected Cost</span>
                  <strong style={{ fontSize: '1rem', color: '#059669' }}>₹{Number(load.customerExpectedCost).toLocaleString()}</strong>
                </div>
              )}
              {load.price && (
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748B', display: 'block' }}>Fare</span>
                  <strong style={{ fontSize: '1.1rem', color: '#F97316' }}>₹{Number(load.price).toLocaleString()}</strong>
                </div>
              )}
            </div>
          )}

          {load.status === 'driver_accepted' ? (
            <button onClick={() => onStartTrip(load._id)} className="btn btn-primary btn-full btn-lg">
              <Navigation size={18} /> Start Trip
            </button>
          ) : load.status === 'on_the_way' ? (
            <button onClick={() => onDeliver(load._id)} className="btn btn-primary btn-full btn-lg">
              <CheckCheck size={18} /> Mark as Delivered
            </button>
          ) : (
            <button onClick={onClose} className="btn btn-outline btn-full btn-lg">
              Close
            </button>
          )}

        </div>
      </div>
    </div>
  );
}
