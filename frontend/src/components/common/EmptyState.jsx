import React from 'react';
import { Inbox } from 'lucide-react';

export default function EmptyState({ 
  icon: Icon = Inbox, 
  title = "No items found", 
  description = "There are no records currently available in this category.",
  actionButton = null 
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-slate-200 text-center my-4">
      <div className="w-16 h-16 rounded-2xl bg-orange-50 text-[#FF6B35] flex items-center justify-center mb-4 border border-orange-100 shadow-inner">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-extrabold text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-md mb-6">{description}</p>
      {actionButton}
    </div>
  );
}
