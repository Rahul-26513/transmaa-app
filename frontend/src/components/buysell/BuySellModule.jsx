import React, { useState } from 'react';
import ListingCard from './ListingCard';
import EmptyState from '../common/EmptyState';
import PhotoGalleryModal from '../common/PhotoGalleryModal';
import { ShoppingCart, Clock, ShieldCheck } from 'lucide-react';

export default function BuySellModule({ 
  pendingListings, 
  liveListings, 
  onApproveListing, 
  onRejectListing,
  defaultTab = 'pending'
}) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [selectedGalleryListing, setSelectedGalleryListing] = useState(null);

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <ShoppingCart className="w-7 h-7 text-[#FF6B35]" />
            <span>Buy & Sell Vehicles Module</span>
          </h2>
          <p className="text-xs font-medium text-slate-500 mt-1">
            Verify submitted commercial truck listings (4-photo inspection) and connect interested buyers with sellers.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-slate-200/70 p-1.5 rounded-2xl flex max-w-md gap-1 border border-slate-200">
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'pending'
              ? 'bg-white text-slate-900 shadow-md border border-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Clock className="w-4 h-4 text-amber-500" />
          <span>Pending Listings</span>
          {pendingListings.length > 0 && (
            <span className="bg-amber-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full ml-1">
              {pendingListings.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('live')}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'live'
              ? 'bg-white text-slate-900 shadow-md border border-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Live Listings</span>
          <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full ml-1">
            {liveListings.length}
          </span>
        </button>
      </div>

      {/* Content */}
      {activeTab === 'pending' ? (
        pendingListings.length === 0 ? (
          <EmptyState 
            icon={ShoppingCart}
            title="No Pending Vehicle Listings"
            description="All submitted trucks have been verified and approved by staff."
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {pendingListings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                type="pending"
                onApprove={onApproveListing}
                onReject={onRejectListing}
                onViewPhotos={(item) => setSelectedGalleryListing(item)}
              />
            ))}
          </div>
        )
      ) : (
        liveListings.length === 0 ? (
          <EmptyState 
            icon={ShoppingCart}
            title="No Live Vehicle Listings"
            description="There are currently no active listings published on the platform."
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {liveListings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                type="live"
                onViewPhotos={(item) => setSelectedGalleryListing(item)}
              />
            ))}
          </div>
        )
      )}

      {/* Gallery Modal */}
      {selectedGalleryListing && (
        <PhotoGalleryModal
          listing={selectedGalleryListing}
          onClose={() => setSelectedGalleryListing(null)}
        />
      )}

    </div>
  );
}
