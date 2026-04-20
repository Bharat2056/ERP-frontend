import React, { useState, useEffect, useContext } from 'react';
import { Book, Loader2, ArrowRightLeft, ShieldAlert } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const DayBook = () => {
  const { user } = useContext(AuthContext); // Bring in the Bouncer!
  const [ledgers, setLedgers] = useState([]);
  const [selectedLedgerId, setSelectedLedgerId] = useState('');
  const [statement, setStatement] = useState(null);
  const [loading, setLoading] = useState(false);

  // 1. Fetch all ledgers for the dropdown
  useEffect(() => {
    fetch('http://localhost:5000/api/ledgers')
      .then(res => res.json())
      .then(data => {
        if (data.success) setLedgers(data.ledgers);
      });
  }, []);

  // 2. Fetch the specific ledger's history when selected
  const fetchStatement = () => {
    if (!selectedLedgerId) return;
    setLoading(true);
    fetch(`http://localhost:5000/api/reports/ledger/${selectedLedgerId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setStatement(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchStatement();
  }, [selectedLedgerId]);

  // 3. THE VOID FUNCTION (Enterprise Soft Delete)
  const handleVoidVoucher = async (voucherId) => {
    if (!window.confirm('🚨 WARNING: Are you sure you want to void this transaction? This will permanently reverse the ledger balances.')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/vouchers/${voucherId}/void`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
          // If you added JWT verification to your routes, add: 'Authorization': `Bearer ${user.token}`
        }
      });

      const data = await response.json();
      if (response.ok) {
        alert('Transaction Voided Successfully! Balances reversed.');
        fetchStatement(); // Re-fetch the data to instantly update the UI and the math!
      } else {
        alert('Failed to void: ' + data.error);
      }
    } catch (error) {
      alert('Server error while voiding.');
    }
  };

  return (
    <div className="flex-1 ml-64 p-8 min-h-screen bg-slate-50">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
          <Book className="text-indigo-600" size={32} /> Ledger Statement (Day Book)
        </h2>
        <p className="text-slate-500 mt-1">View the transaction history and audit trails for any specific account.</p>
      </header>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8 max-w-xl">
        <label className="block text-sm font-bold text-slate-700 mb-2">Select Account Ledger</label>
        <select 
          className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
          value={selectedLedgerId} 
          onChange={(e) => setSelectedLedgerId(e.target.value)}
        >
          <option value="">-- Choose a Ledger --</option>
          {ledgers.map(l => (
            <option key={l._id} value={l._id}>{l.name} (Current Bal: ${Math.abs(l.currentBalance)})</option>
          ))}
        </select>
      </div>

      {loading && <div className="flex justify-center p-12"><Loader2 className="animate-spin text-indigo-500" size={40} /></div>}

      {statement && !loading && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden max-w-6xl">
          <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold">{statement.ledger.name}</h3>
              <p className="text-slate-400 text-sm">Group: {statement.ledger.group}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-400">Closing Balance</p>
              <p className="text-2xl font-black">${Math.abs(statement.ledger.currentBalance).toLocaleString(undefined, {minimumFractionDigits: 2})} {statement.ledger.balanceType}</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 text-sm uppercase tracking-wider">
                  <th className="p-4 font-bold">Date</th>
                  <th className="p-4 font-bold">Audit Trail</th>
                  <th className="p-4 font-bold">Type</th>
                  <th className="p-4 font-bold">Particulars</th>
                  <th className="p-4 font-bold">Narration</th>
                  <th className="p-4 font-bold text-right">Debit (In)</th>
                  <th className="p-4 font-bold text-right">Credit (Out)</th>
                  <th className="p-4 font-bold text-center">Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {statement.vouchers.length === 0 ? (
                  <tr><td colSpan="8" className="p-8 text-center text-slate-500">No transactions found for this ledger.</td></tr>
                ) : (
                  statement.vouchers.map(v => {
                    const isDebit = v.debitLedger._id === statement.ledger._id;
                    const particularName = isDebit ? v.creditLedger.name : v.debitLedger.name;

                    return (
                      // If the voucher is voided, we fade it out and make the background red/gray!
                      <tr key={v._id} className={`transition-colors text-slate-700 ${v.isVoided ? 'bg-rose-50/50 opacity-60' : 'hover:bg-slate-50'}`}>
                        <td className="p-4 whitespace-nowrap text-sm">{new Date(v.date).toLocaleDateString()}</td>
                        
                        {/* THE AUDIT TRAIL */}
                        <td className="p-4 text-xs font-bold text-slate-500">
                          {v.createdBy?.name || 'System'}
                        </td>

                        <td className="p-4">
                          <span className={`text-xs px-2 py-1 rounded font-bold ${v.isVoided ? 'bg-slate-200 text-slate-500' : 'bg-indigo-100 text-indigo-800'}`}>
                            {v.type}
                          </span>
                        </td>
                        <td className={`p-4 font-medium flex items-center gap-2 ${v.isVoided && 'line-through text-slate-400'}`}>
                          <ArrowRightLeft size={14} className="text-slate-400" /> {particularName}
                        </td>
                        <td className="p-4 text-sm text-slate-500">
                          {v.isVoided ? <span className="font-bold text-rose-600 mr-2">[VOIDED]</span> : null}
                          {v.narration || '-'}
                        </td>
                        <td className={`p-4 text-right font-bold ${v.isVoided ? 'text-slate-400 line-through' : 'text-emerald-600'}`}>
                          {isDebit ? `$${v.amount.toFixed(2)}` : ''}
                        </td>
                        <td className={`p-4 text-right font-bold ${v.isVoided ? 'text-slate-400 line-through' : 'text-rose-600'}`}>
                          {!isDebit ? `$${v.amount.toFixed(2)}` : ''}
                        </td>
                        
                        {/* THE ACTION COLUMN (Only Admins see the button) */}
                        <td className="p-4 text-center">
                          {user?.role === 'admin' && !v.isVoided ? (
                            <button 
                              onClick={() => handleVoidVoucher(v._id)}
                              className="flex items-center justify-center gap-1 px-3 py-1 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 rounded text-xs font-bold transition-colors w-full"
                            >
                              <ShieldAlert size={14} /> Void
                            </button>
                          ) : v.isVoided ? (
                            <span className="text-xs font-bold text-rose-500">REVERSED</span>
                          ) : (
                            <span className="text-xs text-slate-400">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DayBook;