import React from 'react';

export default function LoadingSkeleton({ count = 3, type = 'card' }) {
  return (
    <div className="space-y-4 my-4">
      {Array.from({ length: count }).map((_, i) => (
        <div 
          key={i} 
          className="bg-white rounded-2xl p-5 border border-slate-200 animate-pulse space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="h-5 bg-slate-200 rounded-lg w-1/3"></div>
            <div className="h-6 bg-slate-200 rounded-full w-24"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <div className="h-9 bg-slate-200 rounded-xl w-24"></div>
            <div className="h-9 bg-slate-200 rounded-xl w-24"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
