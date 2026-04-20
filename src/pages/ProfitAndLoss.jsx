import React, { useState, useEffect } from 'react';
import { Calculator, Loader2 } from 'lucide-react';

const ProfitAndLoss = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPnL = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/reports/pnl');
        const data = await response.json();
        if (data.success) {
          setReport(data.report);
        }
      } catch (error) {
        console.error("Failed to fetch P&L", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPnL();
  }, []);

  if (loading) {
    return <div className="flex-1 ml-64 p-8 flex justify-center items-center h-screen"><Loader2 className="animate-spin text-indigo-500" size={48} /></div>;
  }

  return (
    <div className="flex-1 ml-64 p-8 bg-slate-50 min-h-screen">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
          <Calculator className="text-indigo-600" size={32} />
          Profit & Loss Statement
        </h2>
        <p className="text-slate-500 mt-1">Live calculation of net profit for the current period.</p>
      </header>

      {/* Tally-Style T-Format Layout */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden max-w-5xl">
        <div className="flex flex-col md:flex-row">
          
          {/* LEFT SIDE: Expenses (Particulars) */}
          <div className="flex-1 border-r border-slate-200">
            <div className="bg-slate-100 p-4 border-b border-slate-200 flex justify-between font-bold text-slate-700">
              <span>Particulars (Expenses)</span>
              <span>Amount ($)</span>
            </div>
            <div className="p-4 min-h-[300px]">
              {report?.expenses.items.map((item, idx) => (
                <div key={idx} className="flex justify-between py-2 border-b border-slate-100 last:border-0 text-slate-600">
                  <span>{item.name}</span>
                  <span>{item.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                </div>
              ))}
            </div>
            <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-between font-bold text-slate-800">
              <span>Total Expenses</span>
              <span>{report?.expenses.total.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
            </div>
          </div>

          {/* RIGHT SIDE: Incomes (Particulars) */}
          <div className="flex-1">
            <div className="bg-slate-100 p-4 border-b border-slate-200 flex justify-between font-bold text-slate-700">
              <span>Particulars (Incomes)</span>
              <span>Amount ($)</span>
            </div>
            <div className="p-4 min-h-[300px]">
              {report?.incomes.items.map((item, idx) => (
                <div key={idx} className="flex justify-between py-2 border-b border-slate-100 last:border-0 text-slate-600">
                  <span>{item.name}</span>
                  <span>{item.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                </div>
              ))}
            </div>
            <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-between font-bold text-slate-800">
              <span>Total Incomes</span>
              <span>{report?.incomes.total.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
            </div>
          </div>

        </div>

        {/* BOTTOM LINE: Net Profit / Loss */}
        <div className={`p-6 text-xl font-black flex justify-between items-center ${report?.netProfit >= 0 ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
          <span>{report?.netProfit >= 0 ? 'Nett Profit' : 'Nett Loss'}</span>
          <span>${Math.abs(report?.netProfit).toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
        </div>
      </div>
    </div>
  );
};

export default ProfitAndLoss;