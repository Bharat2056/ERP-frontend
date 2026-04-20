import React, { useState, useEffect } from 'react';
import { Scale, Loader2 } from 'lucide-react';

const BalanceSheet = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/reports/balance-sheet')
      .then(res => res.json())
      .then(data => { setReport(data.report); setLoading(false); });
  }, []);

  if (loading) return <div className="flex-1 ml-64 p-8 flex justify-center items-center h-screen"><Loader2 className="animate-spin text-indigo-500" size={48} /></div>;

  return (
    <div className="flex-1 ml-64 p-8 bg-slate-50 min-h-screen">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
          <Scale className="text-indigo-600" size={32} /> Balance Sheet
        </h2>
        <p className="text-slate-500 mt-1">Live statement of Assets, Liabilities, and Capital.</p>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden max-w-5xl">
        <div className="flex flex-col md:flex-row">
          
          {/* LIABILITIES & CAPITAL */}
          <div className="flex-1 border-r border-slate-200">
            <div className="bg-slate-800 p-4 text-white font-bold flex justify-between">
              <span>Liabilities & Capital</span> <span>Amount ($)</span>
            </div>
            <div className="p-4 min-h-[300px]">
              {report?.liabilities.items.map((item, idx) => (
                <div key={idx} className="flex justify-between py-2 border-b text-slate-600">
                  <span className={item.name.includes('Profit') ? 'font-bold text-emerald-600' : ''}>{item.name}</span>
                  <span>{item.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                </div>
              ))}
            </div>
            <div className="bg-slate-100 p-4 font-bold flex justify-between">
              <span>Total</span> <span>{report?.liabilities.total.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
            </div>
          </div>

          {/* ASSETS */}
          <div className="flex-1">
            <div className="bg-slate-800 p-4 text-white font-bold flex justify-between">
              <span>Assets</span> <span>Amount ($)</span>
            </div>
            <div className="p-4 min-h-[300px]">
              {report?.assets.items.map((item, idx) => (
                <div key={idx} className="flex justify-between py-2 border-b text-slate-600">
                  <span>{item.name}</span>
                  <span>{item.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                </div>
              ))}
            </div>
            <div className="bg-slate-100 p-4 font-bold flex justify-between">
              <span>Total</span> <span>{report?.assets.total.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BalanceSheet;