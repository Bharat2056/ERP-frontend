import React from 'react';

const StatCard = ({ title, value, trend, icon: Icon, trendUp }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
        <p className={`text-sm mt-2 font-medium ${trendUp ? 'text-emerald-500' : 'text-rose-500'}`}>
          {trendUp ? '↑' : '↓'} {trend} vs last week
        </p>
      </div>
      <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
        <Icon size={24} />
      </div>
    </div>
  );
};

export default StatCard;