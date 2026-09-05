import React, { useEffect, useState } from 'react';
import {
  ShoppingBag, Search, Filter, ShieldCheck, MapPin, ChevronRight, Plus
} from 'lucide-react';
import VehicleDetailModal from './VehicleDetailModal';
import * as customerApi from '../../services/customerApi';

const VEHICLE_TYPES = ['Mini Truck', 'Pickup Truck', 'Light Commercial Truck', 'Medium Truck', 'Heavy Commercial Truck'];

export default function VehicleGrid({
  onSellClick,
  showToast
}) {
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  useEffect(() => {
    customerApi
      .getLiveVehicles()
      .then((data) => setVehicles(data.vehicles))
      .catch((err) => showToast(err.message || 'Failed to load vehicles', 'error'))
      .finally(() => setIsLoading(false));
  }, []);

  const filteredVehicles = vehicles
    .filter((v) => {
      const matchesSearch =
        v.makeModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (v.location || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === 'all' || v.vehicleType === typeFilter;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => (b.year || 0) - (a.year || 0));

  return (
    <div className="content-wrapper">

      {/* Page Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
        color: '#FFFFFF',
        borderRadius: '20px',
        padding: '28px 24px',
        marginBottom: '28px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        boxShadow: '0 10px 25px rgba(15, 23, 42, 0.15)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <ShoppingBag size={24} color="#F97316" />
            <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#F97316', letterSpacing: '0.05em' }}>
              Transmaa Marketplace
            </span>
          </div>
          <h2 className="title-lg" style={{ color: '#FFFFFF', margin: 0 }}>
            Verified Pre-Owned Commercial Vehicles
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '0.88rem', marginTop: '4px' }}>
            Browse Transmaa-verified mini trucks, pickups, and heavy commercial vehicles for sale
          </p>
        </div>

        <button onClick={onSellClick} className="btn btn-primary btn-lg">
          <Plus size={18} /> Sell Your Vehicle
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="card" style={{ padding: '16px', marginBottom: '24px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px',
          alignItems: 'center'
        }}>

          {/* Search */}
          <div className="input-wrapper">
            <Search size={16} className="input-icon" />
            <input
              type="text"
              className="form-input has-icon"
              placeholder="Search make, model, or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Type Filter */}
          <div className="form-group" style={{ margin: 0 }}>
            <select
              className="form-select"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All Vehicle Types</option>
              {VEHICLE_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* Vehicle Grid */}
      {isLoading ? (
        <p className="subtitle">Loading vehicles...</p>
      ) : filteredVehicles.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px', color: '#64748B' }}>
          <ShoppingBag size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
          <h3 className="title-md" style={{ color: '#0F172A' }}>No Vehicles Match Your Search</h3>
          <p className="subtitle" style={{ marginTop: '4px', marginBottom: '20px' }}>
            Try adjusting your search criteria.
          </p>
          <button onClick={() => { setSearchTerm(''); setTypeFilter('all'); }} className="btn btn-outline">
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="vehicle-grid">
          {filteredVehicles.map((vehicle) => (
            <div
              key={vehicle._id}
              onClick={() => setSelectedVehicle(vehicle)}
              className="card card-clickable"
              style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
            >
              {/* Image Banner */}
              <div style={{ height: '180px', position: 'relative', background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)' }}>
                {vehicle.photos?.[0] ? (
                  <img
                    src={vehicle.photos[0]}
                    alt={vehicle.makeModel}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div style={{
                  width: '100%', height: '100%',
                  display: vehicle.photos?.[0] ? 'none' : 'flex',
                  alignItems: 'center', justifyContent: 'center'
                }}>
                  <ShoppingBag size={40} color="#334155" />
                </div>

                <div style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  backgroundColor: '#10B981',
                  color: '#FFFFFF',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '0.7rem',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <ShieldCheck size={12} /> Transmaa Verified
                </div>

                {vehicle.vehicleType && (
                  <div style={{
                    position: 'absolute',
                    bottom: '10px',
                    right: '10px',
                    backgroundColor: 'rgba(15, 23, 42, 0.85)',
                    backdropFilter: 'blur(4px)',
                    color: '#FFFFFF',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    fontWeight: '600'
                  }}>
                    {vehicle.vehicleType}
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#0F172A', marginBottom: '6px', lineHeight: '1.3' }}>
                    {vehicle.makeModel} {vehicle.year ? `(${vehicle.year})` : ''}
                  </h3>

                  {vehicle.location && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#64748B', marginBottom: '12px' }}>
                      <MapPin size={14} color="#F97316" /> {vehicle.location}
                    </div>
                  )}

                  {/* Quick Specs Pill */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '6px',
                    backgroundColor: '#F8FAFC',
                    padding: '8px',
                    borderRadius: '8px',
                    textAlign: 'center',
                    fontSize: '0.72rem',
                    color: '#475569',
                    marginBottom: '16px'
                  }}>
                    <div>
                      <span style={{ color: '#94A3B8', display: 'block' }}>KM Driven</span>
                      <strong>{vehicle.kmDriven || 'N/A'}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#94A3B8', display: 'block' }}>Fuel</span>
                      <strong>{vehicle.fuelType || 'N/A'}</strong>
                    </div>
                  </div>
                </div>

                {/* Price & Action */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTop: '1px solid #F1F5F9',
                  paddingTop: '12px',
                  marginTop: '8px'
                }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#64748B', display: 'block' }}>Price</span>
                    <strong style={{ fontSize: '1.2rem', color: '#F97316', fontWeight: '800' }}>
                      {vehicle.price ? `₹${vehicle.price}` : 'Contact for price'}
                    </strong>
                  </div>

                  <button className="btn btn-outline btn-sm" style={{ color: '#F97316', borderColor: '#FFEDD5', backgroundColor: '#FFF7ED' }}>
                    View & Enquire <ChevronRight size={14} />
                  </button>
                </div>

              </div>

            </div>
          ))}
        </div>
      )}

      {/* Vehicle Detail Modal */}
      {selectedVehicle && (
        <VehicleDetailModal
          vehicle={selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
          showToast={showToast}
        />
      )}

    </div>
  );
}
