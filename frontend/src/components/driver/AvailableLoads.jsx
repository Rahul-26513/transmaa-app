import React, { useEffect, useState } from 'react';
import { Search, MapPin, Package, Calendar, CheckCircle2 } from 'lucide-react';
import * as driverApi from '../../services/driverApi';
import { formatDateTime } from '../../utils/format';

export default function AvailableLoads({ driver, showToast }) {
  const [loads, setLoads] = useState([]);
  const [fromFilter, setFromFilter] = useState('');
  const [toFilter, setToFilter] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [acceptedLoad, setAcceptedLoad] = useState(null);

  const loadAvailable = () => {
    setIsLoading(true);
    driverApi
      .getAvailableLoads()
      .then((data) => setLoads(data.loads))
      .catch((err) => showToast(err.message || 'Failed to load available loads', 'error'))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadAvailable();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setHasSearched(true);
  };

  const filteredLoads = loads.filter((load) => {
    const matchesFrom = !fromFilter || load.fromLocation.toLowerCase().includes(fromFilter.toLowerCase());
    const matchesTo = !toFilter || load.toLocation.toLowerCase().includes(toFilter.toLowerCase());
    return matchesFrom && matchesTo;
  });

  const handleAccept = async (loadId) => {
    try {
      const { booking } = await driverApi.acceptLoad(loadId);
      setAcceptedLoad(booking);
      setLoads((prev) => prev.filter((l) => l._id !== loadId));
    } catch (err) {
      showToast(err.message || 'Failed to accept load', 'error');
    }
  };

  if (acceptedLoad) {
    return (
      <div style={{ backgroundColor: '#10B981', minHeight: '100vh', padding: '24px 16px' }}>
        <div style={{ maxWidth: '480px', margin: '0 auto' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '24px' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <CheckCircle2 size={48} color="#10B981" style={{ margin: '0 auto 10px auto' }} />
              <h2 className="title-md">Load Accepted!</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.9rem' }}>
              <div>
                <span style={{ color: '#64748B', display: 'block', fontSize: '0.75rem' }}>From Location:</span>
                <strong>{acceptedLoad.fromLocation}</strong>
              </div>
              <div>
                <span style={{ color: '#64748B', display: 'block', fontSize: '0.75rem' }}>Time:</span>
                <strong>{acceptedLoad.shiftingTime}</strong>
              </div>
              <div>
                <span style={{ color: '#64748B', display: 'block', fontSize: '0.75rem' }}>Goods Type:</span>
                <strong>{acceptedLoad.goodsType}</strong>
              </div>
              <div>
                <span style={{ color: '#64748B', display: 'block', fontSize: '0.75rem' }}>To Location:</span>
                <strong>{acceptedLoad.toLocation}</strong>
              </div>
              <div>
                <span style={{ color: '#64748B', display: 'block', fontSize: '0.75rem' }}>Date:</span>
                <strong>{formatDateTime(acceptedLoad.shiftingDate)}</strong>
              </div>
              <div>
                <span style={{ color: '#64748B', display: 'block', fontSize: '0.75rem' }}>Truck:</span>
                <strong>{acceptedLoad.truckType} ({acceptedLoad.truckCapacity})</strong>
              </div>
            </div>

            <button onClick={() => setAcceptedLoad(null)} className="btn btn-primary btn-full btn-lg" style={{ marginTop: '24px' }}>
              Back to Available Loads
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      <div className="content-wrapper" style={{ maxWidth: '640px' }}>
        <h2 className="title-lg" style={{ marginBottom: '16px', marginTop: '16px' }}>Hi {driver?.name || 'Driver'}..</h2>

        <form onSubmit={handleSearch} className="card" style={{ marginBottom: '20px' }}>
          <div className="form-group">
            <label className="form-label">From</label>
            <div className="input-wrapper">
              <MapPin size={16} color="#10B981" className="input-icon" />
              <input type="text" className="form-input has-icon" placeholder="Pickup location"
                value={fromFilter} onChange={(e) => setFromFilter(e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">To</label>
            <div className="input-wrapper">
              <MapPin size={16} color="#EF4444" className="input-icon" />
              <input type="text" className="form-input has-icon" placeholder="Delivery location"
                value={toFilter} onChange={(e) => setToFilter(e.target.value)} />
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-full">
            <Search size={16} /> Search
          </button>
        </form>

        {isLoading ? (
          <p className="subtitle">Loading available loads...</p>
        ) : filteredLoads.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px 20px', color: '#64748B' }}>
            <Package size={40} style={{ opacity: 0.3, marginBottom: '12px' }} />
            <p>{hasSearched ? 'No matching loads found for this route.' : 'No available loads right now.'}</p>
          </div>
        ) : (
          <div>
            <h3 className="title-md" style={{ marginBottom: '12px' }}>Available Loads:</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {filteredLoads.map((load) => (
                <div key={load._id} className="card">
                  <div style={{ marginBottom: '10px' }}>
                    <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700 }}>From Location:</span>
                    <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: 600, color: '#0F172A' }}>{load.fromLocation}</p>
                  </div>
                  <div style={{ marginBottom: '10px' }}>
                    <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700 }}>To Location:</span>
                    <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: 600, color: '#0F172A' }}>{load.toLocation}</p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700 }}>Goods Type:</span>
                      <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600 }}>{load.goodsType}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700 }}>
                        <Calendar size={12} style={{ display: 'inline', marginRight: '2px' }} />Date:
                      </span>
                      <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600 }}>{formatDateTime(load.shiftingDate)}</p>
                    </div>
                  </div>
                  <button onClick={() => handleAccept(load._id)} className="btn btn-primary btn-full">
                    Accept Load
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
