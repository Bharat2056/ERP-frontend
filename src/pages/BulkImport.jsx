import React, { useState } from 'react';
import { PackageSearch, UploadCloud, CheckCircle, AlertCircle, FileSpreadsheet, Loader2 } from 'lucide-react';

const BulkImport = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, uploading, success, error
  const [message, setMessage] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setStatus('uploading');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/api/items/bulk', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (response.ok) {
        setStatus('success');
        setMessage(data.message);
        setTimeout(() => {
          setStatus('idle');
          setFile(null);
        }, 4000);
      } else {
        setStatus('error');
        setMessage(data.error);
      }
    } catch (error) {
      setStatus('error');
      setMessage('Failed to connect to the server.');
    }
  };

  return (
    <div className="flex-1 ml-64 p-8 min-h-screen bg-slate-50">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
          <PackageSearch className="text-indigo-600" size={32} />
          Bulk Inventory Import
        </h2>
        <p className="text-slate-500 mt-1">Upload an Excel/CSV file to instantly populate your product catalog.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">
        
        {/* Upload Panel */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
          <UploadCloud size={48} className="text-indigo-400 mb-4" />
          <h3 className="text-lg font-bold text-slate-800 mb-2">Upload Product CSV</h3>
          
          <form onSubmit={handleUpload}>
            <input 
              type="file" 
              accept=".csv" 
              onChange={(e) => setFile(e.target.files[0])}
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-3 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 mb-6 mt-4"
              required
            />
            
            {status === 'success' && <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 rounded-lg flex gap-2 text-sm font-bold"><CheckCircle size={18}/> {message}</div>}
            {status === 'error' && <div className="mb-4 p-3 bg-rose-50 text-rose-700 rounded-lg flex gap-2 text-sm font-bold"><AlertCircle size={18}/> {message}</div>}

            <button 
              type="submit" 
              disabled={!file || status === 'uploading'}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg flex justify-center items-center gap-2 transition-colors disabled:opacity-50"
            >
              {status === 'uploading' ? <Loader2 className="animate-spin" size={20} /> : 'Process Import'}
            </button>
          </form>
        </div>

        {/* Instructions Panel */}
        <div className="bg-indigo-50 p-8 rounded-xl border border-indigo-100">
          <h3 className="text-lg font-bold text-indigo-900 mb-4 flex items-center gap-2">
            <FileSpreadsheet size={24} className="text-indigo-600" />
            CSV Template Guidelines
          </h3>
          <p className="text-sm text-indigo-800 mb-4">Your CSV file must include the following column headers. Capitalization does not matter, but spelling does.</p>
          
          <ul className="space-y-3 text-sm text-indigo-800 mb-6">
            <li><strong className="text-indigo-900 bg-indigo-100 px-2 py-1 rounded">name</strong> - Product title (Required)</li>
            <li><strong className="text-indigo-900 bg-indigo-100 px-2 py-1 rounded">sellingPrice</strong> - Retail price (Required)</li>
            <li><strong className="text-indigo-900 bg-indigo-100 px-2 py-1 rounded">sku</strong> - Unique barcode (Optional)</li>
            <li><strong className="text-indigo-900 bg-indigo-100 px-2 py-1 rounded">currentStock</strong> - Starting qty (Optional)</li>
            <li><strong className="text-indigo-900 bg-indigo-100 px-2 py-1 rounded">taxRate</strong> - e.g., 13 for 13% (Optional)</li>
          </ul>

          <div className="bg-white p-4 rounded border border-indigo-200 overflow-x-auto text-xs text-slate-600 font-mono">
            name,sku,currentStock,sellingPrice,taxRate<br/>
            MacBook Pro M3,MAC-01,15,1999,13<br/>
            Wireless Mouse,MOU-99,120,45,13<br/>
            HDMI Cable,CBL-02,500,12,5
          </div>
        </div>

      </div>
    </div>
  );
};

export default BulkImport;