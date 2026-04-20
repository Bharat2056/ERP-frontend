import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BrainCircuit, Loader2 } from 'lucide-react';

const Predictions = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/predictions');
        const result = await response.json();
        if (result.success) setData(result.predictionData);
      } catch (error) {
        console.error("Failed to fetch predictions", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPredictions();
  }, []);

  if (loading) return <div className="flex-1 ml-64 p-8 flex justify-center items-center h-screen"><Loader2 className="animate-spin text-indigo-500" size={48} /></div>;

  return (
    <div className="flex-1 ml-64 p-8">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
          <BrainCircuit className="text-indigo-600" size={32} /> AI Forecast
        </h2>
        <p className="text-slate-500 mt-1">7-day machine learning projection based on historical velocity.</p>
      </header>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
            <Tooltip contentStyle={{ borderRadius: '8px' }} formatter={(val) => `$${val}`} />
            {/* The dotted line for Predictions */}
            <Area type="monotone" dataKey="predicted" stroke="#6366f1" strokeWidth={3} strokeDasharray="5 5" fill="none" />
            {/* The solid line for Actual history */}
            <Area type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={3} fill="#3b82f6" fillOpacity={0.1} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Predictions;