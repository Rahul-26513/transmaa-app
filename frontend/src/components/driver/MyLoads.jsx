import React, { useEffect, useState } from 'react';
import { Package, CheckCheck, Truck, Eye, Navigation } from 'lucide-react';
import * as driverApi from '../../services/driverApi';
import { formatDateTime } from '../../utils/format';
import LoadDetailModal from './LoadDetailModal';

const STATUS_LABEL = {
  driver_accepted: 'Accepted',
  on_the_way: "Order's to be delivered",
  delivered: 'Delivered'
};

export default function MyLoads({ showToast }) {
  const [loads, setLoads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLoad, setSelectedLoad] = useState(null);

  const loadMine = () => {
    setIsLoading(true);
    driverApi
      .getMyLoads()
      .then((data) => setLoads(data.loads))
      .catch((err) => showToast(err.message || 'Failed to load history', 'error'))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadMine();
  }, []);

  const handleStartTrip = async (id) => {
    try {
      await driverApi.markOnTheWay(id);
      showToast('Load marked as on the way', 'success');
      setSelectedLoad(null);
      loadMine();
    } catch (err) {
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  const handleDeliver = async (id) => {
    try {
      await driverApi.markDelivered(id);
      showToast('Load marked as delivered', 'success');
      setSelectedLoad(null);
      loadMine();
    } catch (err) {
      showToast(err.message || 'Failed to mark delivered', 'error');
    }
  };

  if (isLoading) {
    return <p className="subtitle content-wrapper">Loading your loads...</p>;
  }

  if (loads.length === 0) {
    return (
      <div className="content-wrapper">
        <div className="card" style={{ textAlign: 'center', padding: '40px 20px', color: '#64748B' }}>
          <Package size={40} style={{ opacity: 0.3, marginBottom: '12px' }} />
          <p>No accepted loads yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="content-wrapper" style={{ maxWidth: '640px' }}>
      <h2 className="title-lg" style={{ marginBottom: '16px' }}>My Loads</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {loads.map((load) => (
          <div key={load._id} className="card card-clickable" onClick={() => setSelectedLoad(load)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span className={`badge ${load.status === 'delivered' ? 'badge-delivered' : 'badge-ontheway'}`}>
                {STATUS_LABEL[load.status] || load.status}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#64748B' }}>{formatDateTime(load.shiftingDate)}</span>
            </div>

            <p style={{ margin: '0 0 4px 0', fontSize: '0.88rem', fontWeight: 600 }}>
              {load.fromLocation} <Truck size={13} style={{ display: 'inline', margin: '0 4px' }} /> {load.toLocation}
            </p>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748B' }}>
              Goods: {load.goodsType} • Customer: {load.customerName} ({load.customerPhone})
            </p>

            <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
              <button
                onClick={(e) => { e.stopPropagation(); setSelectedLoad(load); }}
                className="btn btn-outline"
                style={{ flex: 1 }}
              >
                <Eye size={16} /> View Details
              </button>

              {load.status === 'driver_accepted' && (
                <button
                  onClick={(e) => { e.stopPropagation(); handleStartTrip(load._id); }}
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  <Navigation size={16} /> Start Trip
                </button>
              )}

              {load.status === 'on_the_way' && (
                <button
                  onClick={(e) => { e.stopPropagation(); handleDeliver(load._id); }}
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  <CheckCheck size={16} /> Delivered
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedLoad && (
        <LoadDetailModal
          load={selectedLoad}
          onClose={() => setSelectedLoad(null)}
          onStartTrip={handleStartTrip}
          onDeliver={handleDeliver}
        />
      )}
    </div>
  );
}
