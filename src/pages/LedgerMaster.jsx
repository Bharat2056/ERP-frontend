import React, { useState, useEffect } from 'react';
import { BookOpen, Save, CheckCircle } from 'lucide-react';

const LedgerMaster = () => {
  const [formData, setFormData] = useState({
    name: '',
    group: 'Sundry Debtors', // Default group
    currentBalance: 0,
    balanceType: 'Dr'
  });
  const [status, setStatus] = useState('idle');

  // Standard Tally Account Groups
  const accountGroups = [
    "Sundry Debtors", "Sundry Creditors", "Cash-in-Hand", "Bank Accounts",
    "Sales Accounts", "Purchase Accounts", "Direct Incomes", "Indirect Incomes",
    "Direct Expenses", "Indirect Expenses", "Capital Account"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('saving');

    try {
      const response = await fetch('http://localhost:5000/api/ledgers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        // Reset form for the next ledger
        setTimeout(() => {
          setFormData({ name: '', group: 'Sundry Debtors', currentBalance: 0, balanceType: 'Dr' });
          setStatus('idle');
        }, 2000);
      } else {
        setStatus('error');
        console.error(data.error);
      }
    } catch (error) {
      setStatus('error');
      console.error("Failed to connect", error);
    }
  };

  return (
    <div className="flex-1 ml-64 p-8">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
          <BookOpen className="text-indigo-600" size={32} />
          Ledger Master
        </h2>
        <p className="text-slate-500 mt-1">Create new accounting ledgers and parties.</p>
      </header>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Ledger Name</label>
            <input 
              type="text" 
              placeholder="e.g., Cash Account, Sales, or ABC Corporation" 
              className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Under Group</label>
            <select 
              className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
              value={formData.group} 
              onChange={(e) => setFormData({...formData, group: e.target.value})}
            >
              {accountGroups.map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-6 p-6 bg-slate-50 border border-slate-200 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Opening Balance ($)</label>
              <input 
                type="number" 
                className="w-full p-3 border border-slate-200 rounded-lg outline-none"
                value={formData.currentBalance} 
                onChange={(e) => setFormData({...formData, currentBalance: Number(e.target.value)})} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Dr / Cr</label>
              <select 
                className="w-full p-3 border border-slate-200 rounded-lg outline-none"
                value={formData.balanceType} 
                onChange={(e) => setFormData({...formData, balanceType: e.target.value})}
              >
                <option value="Dr">Debit (Dr)</option>
                <option value="Cr">Credit (Cr)</option>
              </select>
            </div>
          </div>

          {status === 'success' && (
            <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 p-3 rounded-lg border border-emerald-100">
              <CheckCircle size={20} />
              <p className="font-medium">Ledger created successfully!</p>
            </div>
          )}

          <button 
            type="submit" 
            disabled={status === 'saving' || status === 'success'}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-lg bg-slate-900 hover:bg-slate-800 font-bold text-white transition-colors disabled:bg-slate-400"
          >
            <Save size={20} /> 
            {status === 'saving' ? 'Saving...' : 'Create Ledger'}
          </button>

        </form>
      </div>
    </div>
  );
};

export default LedgerMaster;