import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, FileText, CheckCircle, AlertCircle } from 'lucide-react';

const DataImport = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      setStatus('idle');
    } else {
      setStatus('error');
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setStatus('uploading');
    
    // 1. Pack the file into a FormData object
    const formData = new FormData();
    formData.append('file', file);

    try {
      // 2. Send it to the Node.js Backend!
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        console.log("Database response:", data); // Check your browser console!
        
        // 3. Redirect to the dashboard after a successful save
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        setStatus('error');
        console.error("Backend rejected the file:", data);
      }
    } catch (error) {
      setStatus('error');
      console.error("Failed to connect to backend:", error);
    }
  };

  return (
    <div className="flex-1 ml-64 p-8 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Import Sales Data</h2>
        <p className="text-slate-500 mb-8">Upload your recent sales data as a CSV file to generate AI insights.</p>

        <div className="border-2 border-dashed border-slate-300 rounded-xl p-10 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors relative cursor-pointer group">
          <input 
            type="file" 
            accept=".csv" 
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <UploadCloud size={48} className="text-blue-500 mb-4 group-hover:scale-110 transition-transform" />
          <p className="text-lg font-medium text-slate-700">Click to upload or drag and drop</p>
          <p className="text-sm text-slate-500 mt-1">CSV files only (Max 5MB)</p>
        </div>

        {file && status !== 'error' && (
          <div className="mt-6 flex items-center justify-between p-4 bg-blue-50 border border-blue-100 rounded-lg animate-fade-in">
            <div className="flex items-center gap-3">
              <FileText className="text-blue-600" size={24} />
              <div>
                <p className="text-sm font-medium text-slate-800">{file.name}</p>
                <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(2)} KB</p>
              </div>
            </div>
            {status === 'success' && <CheckCircle className="text-emerald-500" size={24} />}
          </div>
        )}

        {status === 'error' && (
          <div className="mt-6 flex items-center gap-2 text-rose-600 bg-rose-50 p-4 rounded-lg border border-rose-100">
            <AlertCircle size={20} />
            <p className="text-sm font-medium">Failed to process. Make sure backend is running.</p>
          </div>
        )}

        <button 
          onClick={handleUpload}
          disabled={!file || status === 'uploading' || status === 'success'}
          className={`w-full mt-8 py-3 rounded-lg font-bold text-white transition-all ${
            !file || status === 'success' 
              ? 'bg-slate-300 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20'
          }`}
        >
          {status === 'uploading' ? 'Sending to Database...' : status === 'success' ? 'Redirecting to Dashboard...' : 'Generate AI Insights'}
        </button>
      </div>
    </div>
  );
};

export default DataImport;