import React, { useState } from 'react';
import { 
  User, 
  Phone, 
  Calendar, 
  FileText, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  ShoppingBag, 
  Gauge, 
  MapPin,
  ExternalLink,
  MessageCircle,
  Users
} from 'lucide-react';

export default function ListingCard({ 
  listing, 
  type = 'pending', 
  onApprove, 
  onReject, 
  onViewPhotos 
}) {
  const [showInterestedBuyers, setShowInterestedBuyers] = useState(false);

  const photos = listing.photos || [];

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      
      <div>
        {/* Header & Status */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold text-slate-400">{listing.id}</span>
              <h3 className="text-base font-extrabold text-slate-900">{listing.makeModel}</h3>
            </div>
            <p className="text-xs font-bold text-[#FF6B35] mt-0.5">
              Year {listing.year} • Price: {listing.price}
            </p>
          </div>

          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
            type === 'pending'
              ? 'bg-amber-100 text-amber-800 border border-amber-300'
              : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
          }`}>
            {type === 'pending' ? 'Pending Approval' : 'Live on Marketplace'}
          </span>
        </div>

        {/* 4 Photo Thumbnail Gallery */}
        <div className="py-4">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Uploaded Photos (4 Views)</span>
            <button 
              onClick={() => onViewPhotos(listing)}
              className="text-[#FF6B35] hover:underline flex items-center gap-1 font-bold text-xs"
            >
              <Eye className="w-3.5 h-3.5" /> Full Gallery Carousel
            </button>
          </p>

          <div 
            onClick={() => onViewPhotos(listing)}
            className="grid grid-cols-4 gap-2 cursor-pointer group"
          >
            {photos.slice(0, 4).map((imgUrl, i) => (
              <div key={i} className="relative rounded-xl overflow-hidden h-20 border border-slate-200 group-hover:border-[#FF6B35] transition-colors">
                <img src={imgUrl} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                <span className="absolute bottom-0 inset-x-0 bg-slate-900/80 text-white text-[9px] font-bold text-center py-0.5">
                  {i === 0 ? 'Front' : i === 1 ? 'Back' : i === 2 ? 'Left' : 'Right'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Vehicle Specs & Seller Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs py-3 border-t border-slate-100">
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Seller Contact</p>
            <p className="font-bold text-slate-900">{listing.sellerName}</p>
            <a href={`tel:${listing.sellerPhone}`} className="text-[#FF6B35] font-semibold flex items-center gap-1 mt-0.5">
              <Phone className="w-3 h-3" /> {listing.sellerPhone}
            </a>
          </div>

          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase">RC & Location</p>
            <p className="font-mono font-bold text-slate-900">{listing.rcNumber}</p>
            <p className="text-slate-500 font-semibold truncate mt-0.5">{listing.location || 'Hyderabad'}</p>
          </div>
        </div>

        {/* Interested Buyers Drawer Toggle for Live Listings */}
        {type === 'live' && listing.interestedBuyers && (
          <div className="pt-2">
            <button
              onClick={() => setShowInterestedBuyers(!showInterestedBuyers)}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 transition-colors text-xs font-bold text-indigo-900"
            >
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-indigo-600" />
                <span>Interested Buyers ({listing.interestedBuyers.length})</span>
              </div>
              <span className="text-[11px] underline">
                {showInterestedBuyers ? 'Hide List' : 'View Leads'}
              </span>
            </button>

            {showInterestedBuyers && (
              <div className="mt-3 space-y-2 bg-indigo-50/40 p-3 rounded-2xl border border-indigo-100 animate-in fade-in duration-150">
                <p className="text-[11px] font-bold text-indigo-700 uppercase">Follow-up Buyer Leads</p>
                {listing.interestedBuyers.map((buyer) => (
                  <div key={buyer.id} className="bg-white p-2.5 rounded-xl border border-indigo-100 text-xs flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900">{buyer.name}</p>
                      <p className="text-[10px] text-slate-500">{buyer.requestedDate}</p>
                    </div>
                    <a 
                      href={`tel:${buyer.phone}`}
                      className="px-3 py-1.5 rounded-lg bg-[#FF6B35] text-white text-[11px] font-bold flex items-center gap-1 hover:bg-orange-600 transition-colors"
                    >
                      <Phone className="w-3 h-3" /> Call Buyer ({buyer.phone})
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Footer Action Buttons */}
      {type === 'pending' ? (
        <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
          <button
            onClick={() => onReject(listing.id)}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold transition-all"
          >
            <XCircle className="w-4 h-4" />
            <span>Reject Listing</span>
          </button>
          <button
            onClick={() => onApprove(listing.id)}
            className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-500/20"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Approve & Publish</span>
          </button>
        </div>
      ) : (
        <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Published on {listing.publishedAt}</span>
          <span className="text-emerald-600 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> Live on Portal
          </span>
        </div>
      )}

    </div>
  );
}
