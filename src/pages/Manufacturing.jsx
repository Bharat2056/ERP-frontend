import React, { useState, useEffect } from 'react';
import { Hammer, Save, CheckCircle, AlertCircle, Plus, Trash2 } from 'lucide-react';

const Manufacturing = () => {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState('idle');
  
  // State for the form
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [producedItemId, setProducedItemId] = useState('');
  const [producedQty, setProducedQty] = useState('');
  const [narration, setNarration] = useState('');
  
  // Dynamic array for raw materials
  const [consumedItems, setConsumedItems] = useState([
    { itemId: '', qty: '' }
  ]);

  // Fetch all inventory items
  useEffect(() => {
    fetch('http://localhost:5000/api/items')
      .then(res => res.json())
      .then(data => { if (data.success) setItems(data.items); });
  }, []);

  // Handlers for the dynamic Raw Materials list
  const addMaterialRow = () => {
    setConsumedItems([...consumedItems, { itemId: '', qty: '' }]);
  };

  const removeMaterialRow = (index) => {
    const newList = [...consumedItems];
    newList.splice(index, 1);
    setConsumedItems(newList);
  };

  const handleMaterialChange = (index, field, value) => {
    const newList = [...consumedItems];
    newList[index][field] = value;
    setConsumedItems(newList);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('saving');

    const payload = {
      date, producedItemId, producedQty, consumedItems, narration
    };

    try {
      const response = await fetch('http://localhost:5000/api/manufacturing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setStatus('success');
        setTimeout(() => {
          // Reset form
          setProducedItemId(''); setProducedQty(''); setNarration('');
          setConsumedItems([{ itemId: '', qty: '' }]);
          setStatus('idle');
        }, 2000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className="flex-1 ml-64 p-8 min-h-screen bg-slate-50">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
          <Hammer className="text-indigo-600" size={32} />
          Manufacturing Journal
        </h2>
        <p className="text-slate-500 mt-1">Convert raw materials into finished goods and update stock.</p>
      </header>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Top Section: Finished Good (Destination) */}
          <div className="bg-emerald-50/50 p-6 rounded-xl border border-emerald-100">
            <h3 className="text-lg font-bold text-emerald-800 mb-4">Production (What are you making?)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">Finished Product</label>
                <select className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" 
                  value={producedItemId} onChange={(e) => setProducedItemId(e.target.value)} required>
                  <option value="">Select Item to Produce...</option>
                  {items.map(i => <option key={i._id} value={i._id}>{i.name} (In Stock: {i.currentStock})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Qty Produced</label>
                <input type="number" className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500" 
                  value={producedQty} onChange={(e) => setProducedQty(e.target.value)} required min="1" />
              </div>
            </div>
          </div>

          {/* Bottom Section: Raw Materials (Consumption) */}
          <div className="bg-rose-50/50 p-6 rounded-xl border border-rose-100">
            <h3 className="text-lg font-bold text-rose-800 mb-4">Consumption (Raw Materials Used)</h3>
            
            {consumedItems.map((material, index) => (
              <div key={index} className="flex items-center gap-4 mb-4">
                <div className="flex-1">
                  <select className="w-full p-3 border border-rose-200 rounded-lg outline-none focus:ring-2 focus:ring-rose-500" 
                    value={material.itemId} onChange={(e) => handleMaterialChange(index, 'itemId', e.target.value)} required>
                    <option value="">Select Raw Material...</option>
                    {items.map(i => <option key={i._id} value={i._id}>{i.name} (In Stock: {i.currentStock})</option>)}
                  </select>
                </div>
                <div className="w-32">
                  <input type="number" placeholder="Qty" className="w-full p-3 border border-rose-200 rounded-lg outline-none focus:ring-2 focus:ring-rose-500" 
                    value={material.qty} onChange={(e) => handleMaterialChange(index, 'qty', e.target.value)} required min="1" />
                </div>
                {index > 0 ? (
                  <button type="button" onClick={() => removeMaterialRow(index)} className="p-3 text-rose-500 hover:bg-rose-100 rounded-lg transition-colors">
                    <Trash2 size={20} />
                  </button>
                ) : <div className="w-11"></div>} {/* Placeholder to align grid */}
              </div>
            ))}

            <button type="button" onClick={addMaterialRow} className="mt-2 flex items-center gap-2 text-sm font-bold text-rose-600 hover:text-rose-800">
              <Plus size={16} /> Add Another Material
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Narration / Notes</label>
            <input type="text" placeholder="Batch #104 assembly..." className="w-full p-3 border rounded-lg outline-none" 
              value={narration} onChange={(e) => setNarration(e.target.value)} />
          </div>

          {status === 'success' && <div className="p-4 text-emerald-600 bg-emerald-50 rounded-lg border border-emerald-100 flex gap-2"><CheckCircle size={20}/> Manufacturing completed. Stock updated!</div>}
          {status === 'error' && <div className="p-4 text-rose-600 bg-rose-50 rounded-lg border border-rose-100 flex gap-2"><AlertCircle size={20}/> Failed to process manufacturing.</div>}

          <button type="submit" disabled={status === 'saving' || status === 'success'} className="w-full py-4 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700">
            {status === 'saving' ? 'Processing...' : 'Complete Assembly'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Manufacturing;