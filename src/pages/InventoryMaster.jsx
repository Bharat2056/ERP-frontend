import React, { useState } from 'react';
import { Package, Save, CheckCircle } from 'lucide-react';

const InventoryMaster = () => {
  const [status, setStatus] = useState('idle');
  const [formData, setFormData] = useState({
    name: '', sku: '', currentStock: 0, sellingPrice: 0
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('saving');
    try {
      const response = await fetch('http://localhost:5000/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setStatus('success');
        setTimeout(() => {
          setFormData({ name: '', sku: '', currentStock: 0, sellingPrice: 0 });
          setStatus('idle');
        }, 2000);
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className="flex-1 ml-64 p-8">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
          <Package className="text-indigo-600" size={32} /> Inventory Master
        </h2>
        <p className="text-slate-500 mt-1">Create physical stock items and SKUs.</p>
      </header>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Item Name</label>
              <input type="text" placeholder="e.g., Premium Vodka 750ml" className="w-full p-3 border rounded-lg outline-none"
                value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">SKU / Code</label>
              <input type="text" placeholder="LK-001" className="w-full p-3 border rounded-lg outline-none"
                value={formData.sku} onChange={(e) => setFormData({...formData, sku: e.target.value})} required />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6 bg-slate-50 p-6 rounded-lg border border-slate-200">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Opening Stock (Qty)</label>
              <input type="number" className="w-full p-3 border rounded-lg outline-none"
                value={formData.currentStock} onChange={(e) => setFormData({...formData, currentStock: Number(e.target.value)})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Selling Price ($)</label>
              <input type="number" className="w-full p-3 border rounded-lg outline-none"
                value={formData.sellingPrice} onChange={(e) => setFormData({...formData, sellingPrice: Number(e.target.value)})} />
            </div>
          </div>

          {status === 'success' && (
            <div className="flex gap-2 text-emerald-600 bg-emerald-50 p-3 rounded-lg border border-emerald-100">
              <CheckCircle size={20} /> <p className="font-medium">Item added to inventory!</p>
            </div>
          )}
          <button type="submit" disabled={status === 'saving' || status === 'success'} className="w-full py-4 rounded-lg bg-slate-900 text-white font-bold hover:bg-slate-800">
            <Save size={20} className="inline mr-2" /> Save Item
          </button>
        </form>
      </div>
    </div>
  );
};

export default InventoryMaster;