import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

export default function PhotoGalleryModal({ listing, onClose }) {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  if (!listing) return null;

  const photoLabels = ['Front View', 'Back View', 'Left Side', 'Right Side'];
  const photos = listing.photos || [];

  const handlePrev = () => {
    setActivePhotoIdx((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActivePhotoIdx((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">{listing.makeModel} ({listing.year})</h3>
            <p className="text-xs font-semibold text-slate-500">Seller: {listing.sellerName} ({listing.sellerPhone}) • RC: {listing.rcNumber}</p>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Main Photo View */}
        <div className="relative bg-slate-950 flex items-center justify-center h-80 sm:h-96">
          <img 
            src={photos[activePhotoIdx]} 
            alt={`Vehicle Photo ${activePhotoIdx + 1}`}
            className="h-full w-full object-contain"
          />

          <button 
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-900/80 text-white hover:bg-slate-900 transition-all border border-slate-700 shadow-lg"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button 
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-900/80 text-white hover:bg-slate-900 transition-all border border-slate-700 shadow-lg"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <span className="absolute bottom-4 left-4 text-xs font-extrabold text-white px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur border border-slate-700">
            {photoLabels[activePhotoIdx] || `Photo ${activePhotoIdx + 1}`} ({activePhotoIdx + 1} of {photos.length})
          </span>
        </div>

        {/* Thumbnails Carousel */}
        <div className="p-4 bg-slate-50 border-t border-slate-200">
          <div className="grid grid-cols-4 gap-3">
            {photos.map((url, idx) => (
              <button
                key={idx}
                onClick={() => setActivePhotoIdx(idx)}
                className={`relative rounded-xl overflow-hidden border-2 transition-all h-20 ${
                  activePhotoIdx === idx ? 'border-[#FF6B35] ring-2 ring-orange-400' : 'border-slate-300 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={url} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                <span className="absolute bottom-0 inset-x-0 bg-slate-900/80 text-[10px] font-bold text-white text-center py-0.5 truncate px-1">
                  {photoLabels[idx]}
                </span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
