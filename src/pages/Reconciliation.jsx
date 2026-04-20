import React, { useState } from 'react';
import { Landmark, UploadCloud, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';

const Reconciliation = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, processing, complete
  const [results, setResults] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setStatus('processing');
    const formData = new FormData();
    formData.append('statement', file);

    try {
      const response = await fetch('http://localhost:5000/api/reconcile', {
        method: 'POST',
        // Notice: We do NOT use 'Content-Type': 'application/json' when sending files!
        body: formData, 
      });

      const data = await response.json();
      if (response.ok) {
        setResults(data);
        setStatus('complete');
      } else {
        alert('Reconciliation failed: ' + data.error);
        setStatus('idle');
      }
    } catch (error) {
      alert('Server connection error.');
      setStatus('idle');
    }
  };

  return (
    <div className="flex-1 ml-64 p-8 min-h-screen bg-slate-50">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
          <Landmark className="text-indigo-600" size={32} /> Bank Reconciliation
        </h2>
        <p className="text-slate-500 mt-1">Upload your bank CSV statement to auto-match transactions.</p>
      </header>

      {status !== 'complete' ? (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 max-w-xl text-center">
          <UploadCloud size={48} className="text-indigo-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800 mb-2">Upload Bank CSV</h3>
          <p className="text-sm text-slate-500 mb-6">Ensure your CSV has <strong className="text-indigo-600">date, description, amount</strong> columns.</p>
          
          <form onSubmit={handleUpload}>
            <input 
              type="file" 
              accept=".csv" 
              onChange={(e) => setFile(e.target.files[0])}
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-3 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 mb-6"
              required
            />
            <button 
              type="submit" 
              disabled={!file || status === 'processing'}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg flex justify-center items-center gap-2 transition-colors disabled:opacity-50"
            >
              {status === 'processing' ? <Loader2 className="animate-spin" size={20} /> : 'Run Auto-Match Algorithm'}
            </button>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Matched Panel */}
          <div className="bg-white rounded-xl shadow-sm border border-emerald-200 overflow-hidden">
            <div className="bg-emerald-50 p-4 border-b border-emerald-100 flex items-center justify-between">
              <h3 className="font-bold text-emerald-800 flex items-center gap-2">
                <CheckCircle2 /> Auto-Matched ({results.matched.length})
              </h3>
            </div>
            <div className="p-4 space-y-3">
              {results.matched.length === 0 ? <p className="text-slate-500 text-sm">No exact matches found.</p> : null}
              {results.matched.map((m, i) => (
                <div key={i} className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-100 flex justify-between items-center text-sm">
                  <div>
                    <p className="font-bold text-slate-700">${m.bankTx.amount.toFixed(2)}</p>
                    <p className="text-slate-500 text-xs">{new Date(m.bankTx.date).toLocaleDateString()} - {m.bankTx.description}</p>
                  </div>
                  <div className="text-right">
                    <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-bold">Cleared</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Unmatched Panel */}
          <div className="bg-white rounded-xl shadow-sm border border-rose-200 overflow-hidden">
            <div className="bg-rose-50 p-4 border-b border-rose-100 flex items-center justify-between">
              <h3 className="font-bold text-rose-800 flex items-center gap-2">
                <AlertTriangle /> Missing in ERP ({results.unmatched.length})
              </h3>
            </div>
            <div className="p-4 space-y-3">
              {results.unmatched.length === 0 ? <p className="text-slate-500 text-sm">Perfect reconciliation! No missing records.</p> : null}
              {results.unmatched.map((tx, i) => (
                <div key={i} className="p-3 bg-rose-50/50 rounded-lg border border-rose-100 flex justify-between items-center text-sm">
                  <div>
                    <p className="font-bold text-slate-700">${tx.amount.toFixed(2)}</p>
                    <p className="text-slate-500 text-xs">{new Date(tx.date).toLocaleDateString()} - {tx.description}</p>
                  </div>
                  <button className="text-xs font-bold text-rose-600 hover:underline">Record Now</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reconciliation;