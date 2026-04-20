import React, { useState, useEffect } from 'react';
import { Save, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const VoucherEntry = () => {
  const [ledgers, setLedgers] = useState([]);
  const [status, setStatus] = useState('idle');
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'Sales',
    debitLedgerId: '',
    creditLedgerId: '',
    taxLedgerId: '', // NEW
    amount: '',
    taxRate: 0,      // NEW (e.g., 13 for 13%)
    narration: ''
  });

  useEffect(() => {
    fetch('http://localhost:5000/api/ledgers')
      .then(res => res.json())
      .then(data => { if (data.success) setLedgers(data.ledgers); });
  }, []);

  // Filter ledgers to only show Tax accounts for the Tax dropdown
  const taxLedgers = ledgers.filter(l => l.group === 'Duties & Taxes' || l.name.toLowerCase().includes('tax'));

  const generateInvoice = (data, taxAmt, total) => {
    const doc = new jsPDF();
    doc.setFontSize(22); doc.setTextColor(79, 70, 229); doc.text("NEXUS ERP", 14, 20);
    doc.setFontSize(10); doc.setTextColor(100);
    doc.text("TAX INVOICE", 14, 28);
    doc.text(`Date: ${data.date}`, 14, 34);
    
    doc.autoTable({
      startY: 45,
      head: [['Description', 'Amount']],
      body: [
        [data.narration || 'Goods / Services', `$${parseFloat(data.amount).toFixed(2)}`],
        [`Add: Tax (${data.taxRate}%)`, `$${taxAmt}`],
      ],
      foot: [['Grand Total', `$${total}`]],
      theme: 'grid',
      headStyles: { fillColor: [30, 41, 59] },
      footStyles: { fillColor: [79, 70, 229] }
    });
    doc.save(`Invoice_${data.date}.pdf`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('saving');

    // Calculate exact tax amount before sending to backend
    const calculatedTaxAmount = (Number(formData.amount) * (Number(formData.taxRate) / 100)).toFixed(2);
    const payload = { ...formData, taxAmount: calculatedTaxAmount };

    try {
      const response = await fetch('http://localhost:5000/api/vouchers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setStatus('success');
        if (formData.type === 'Sales') {
          const grandTotal = (Number(formData.amount) + Number(calculatedTaxAmount)).toFixed(2);
          generateInvoice(formData, calculatedTaxAmount, grandTotal);
        }
        setTimeout(() => {
          setFormData({ ...formData, debitLedgerId: '', creditLedgerId: '', taxLedgerId: '', amount: '', taxRate: 0, narration: '' });
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
    <div className="flex-1 ml-64 p-8">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
          <FileText className="text-indigo-600" size={32} /> Accounting Voucher
        </h2>
        <p className="text-slate-500 mt-1">Record multi-entry transactions with dynamic tax.</p>
      </header>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Voucher Date</label>
              <input type="date" className="w-full p-3 border rounded-lg outline-none" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Voucher Type</label>
              <select className="w-full p-3 border rounded-lg outline-none" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                <option value="Sales">Sales (F8)</option>
                <option value="Receipt">Receipt (F6)</option>
                <option value="Payment">Payment (F5)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 p-6 bg-indigo-50/50 rounded-xl border border-indigo-100">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">By (Debit)</label>
              <select className="w-full p-3 border rounded-lg outline-none" value={formData.debitLedgerId} onChange={(e) => setFormData({...formData, debitLedgerId: e.target.value})} required>
                <option value="">Select Ledger...</option>
                {ledgers.map(l => <option key={l._id} value={l._id}>{l.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">To (Credit)</label>
              <select className="w-full p-3 border rounded-lg outline-none" value={formData.creditLedgerId} onChange={(e) => setFormData({...formData, creditLedgerId: e.target.value})} required>
                <option value="">Select Ledger...</option>
                {ledgers.map(l => <option key={l._id} value={l._id}>{l.name}</option>)}
              </select>
            </div>
          </div>

          {/* NEW: DYNAMIC TAX SECTION */}
          {(formData.type === 'Sales' || formData.type === 'Payment') && (
            <div className="grid grid-cols-2 gap-6 p-6 bg-rose-50/50 rounded-xl border border-rose-100">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Tax Ledger (Credit)</label>
                <select className="w-full p-3 border rounded-lg outline-none" value={formData.taxLedgerId} onChange={(e) => setFormData({...formData, taxLedgerId: e.target.value})}>
                  <option value="">No Tax Applied</option>
                  {taxLedgers.map(l => <option key={l._id} value={l._id}>{l.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Tax Rate (%)</label>
                <select className="w-full p-3 border rounded-lg outline-none" value={formData.taxRate} onChange={(e) => setFormData({...formData, taxRate: Number(e.target.value)})}>
                  <option value={0}>0% - Exempt</option>
                  <option value={5}>5% - Reduced Rate</option>
                  <option value={13}>13% - Standard VAT</option>
                  <option value={18}>18% - Luxury Goods</option>
                </select>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Base Amount ($)</label>
            <input type="number" placeholder="0.00" className="w-full p-3 border rounded-lg text-lg font-bold outline-none" 
              value={formData.amount} onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})} required min="0.01" step="0.01" />
          </div>
          
          {/* Dynamic Total Preview */}
          {formData.taxRate > 0 && formData.amount && (
            <div className="text-right text-slate-500 font-medium">
              + Tax: ${(formData.amount * (formData.taxRate/100)).toFixed(2)} = <span className="text-xl text-slate-800 font-black">Grand Total: ${(Number(formData.amount) + Number(formData.amount * (formData.taxRate/100))).toFixed(2)}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Narration</label>
            <input type="text" placeholder="Being goods sold..." className="w-full p-3 border rounded-lg outline-none" value={formData.narration} onChange={(e) => setFormData({...formData, narration: e.target.value})} />
          </div>

          {status === 'success' && <div className="p-4 text-emerald-600 bg-emerald-50 rounded-lg border border-emerald-100 flex gap-2"><CheckCircle size={20}/> Saved successfully!</div>}
          {status === 'error' && <div className="p-4 text-rose-600 bg-rose-50 rounded-lg border border-rose-100 flex gap-2"><AlertCircle size={20}/> Failed to save.</div>}

          <button type="submit" disabled={status === 'saving' || status === 'success'} className="w-full py-4 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700">
            <Save size={20} className="inline mr-2" /> Save Voucher
          </button>
        </form>
      </div>
    </div>
  );
};

export default VoucherEntry;