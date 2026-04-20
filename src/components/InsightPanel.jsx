import React, { useState, useEffect } from 'react';
import { Sparkles, TrendingDown, TrendingUp, AlertCircle, Loader2 } from 'lucide-react';

const InsightPanel = () => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/insights');
      const result = await response.json();
      if (result.success) setInsights(result.insights);
    } catch (error) {
      console.error("AI fetch failed", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const getIcon = (type) => {
    if (type === 'warning') return <TrendingDown className="text-rose-500" size={20} />;
    if (type === 'success') return <TrendingUp className="text-emerald-500" size={20} />;
    return <AlertCircle className="text-blue-500" size={20} />;
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-xl shadow-lg p-6 text-white border border-indigo-800/50 h-96 flex flex-col">
      <div className="flex items-center gap-2 mb-6 border-b border-indigo-800 pb-4 shrink-0">
        <Sparkles className="text-indigo-400" size={24} />
        <h3 className="text-lg font-bold tracking-wide">AI Business Insights</h3>
      </div>
      
      <div className="space-y-4 flex-1 overflow-y-auto pr-2">
        {loading ? (
          <div className="flex flex-col justify-center items-center h-full text-indigo-300">
            <Loader2 className="animate-spin mb-2" size={32} />
            <p className="text-sm">Gemini is analyzing your data...</p>
          </div>
        ) : (
          insights.map((insight) => (
            <div key={insight.id} className="flex gap-4 p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="mt-0.5 shrink-0">{getIcon(insight.type)}</div>
              <p className="text-sm leading-relaxed text-slate-200">{insight.message}</p>
            </div>
          ))
        )}
      </div>
      
      <button onClick={fetchInsights} disabled={loading} className="w-full mt-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm font-medium transition-colors shrink-0">
        Refresh AI Analysis
      </button>
    </div>
  );
};

export default InsightPanel;