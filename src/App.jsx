import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';

// Components
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DataImport from './components/DataImport';
import Predictions from './pages/Predictions';
import VoucherEntry from './pages/VoucherEntry';
import LedgerMaster from './pages/LedgerMaster';
import ProfitAndLoss from './pages/ProfitAndLoss';
import InventoryMaster from './pages/InventoryMaster';
import BalanceSheet from './pages/BalanceSheet';
import DayBook from './pages/DayBook';
import Manufacturing from './pages/Manufacturing';
import Reconciliation from './pages/Reconciliation';
import BulkImport from './pages/BulkImport';

// --- THE UPGRADED BOUNCER (Role-Based Access) ---
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  
  // SECURITY CHECK: If this page requires an admin, and the user isn't one, kick them to Vouchers!
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/vouchers" replace />;
  }
  
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar />
      {children}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />
          
          {/* Default Redirect (Goes to Dashboard, but Bouncer will re-route Cashiers to Vouchers) */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* 🔴 ADMIN ONLY ROUTES (Analytics, Financials, Bulk Uploads) */}
          <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><Dashboard /></ProtectedRoute>} />
          <Route path="/import" element={<ProtectedRoute allowedRoles={['admin']}><DataImport /></ProtectedRoute>} />
          <Route path="/predictions" element={<ProtectedRoute allowedRoles={['admin']}><Predictions /></ProtectedRoute>} />
          <Route path="/pnl" element={<ProtectedRoute allowedRoles={['admin']}><ProfitAndLoss /></ProtectedRoute>} />
          <Route path="/balance-sheet" element={<ProtectedRoute allowedRoles={['admin']}><BalanceSheet /></ProtectedRoute>} />
          <Route path="/reconciliation" element={<ProtectedRoute allowedRoles={['admin']}><Reconciliation /></ProtectedRoute>} />
          <Route path="/bulk-import" element={<ProtectedRoute allowedRoles={['admin']}><BulkImport /></ProtectedRoute>} />

          {/* 🟢 SHARED ROUTES (Both Admins & Cashiers can do daily entry) */}
          <Route path="/vouchers" element={<ProtectedRoute><VoucherEntry /></ProtectedRoute>} />
          <Route path="/inventory" element={<ProtectedRoute><InventoryMaster /></ProtectedRoute>} />
          <Route path="/ledgers" element={<ProtectedRoute><LedgerMaster /></ProtectedRoute>} />
          <Route path="/manufacturing" element={<ProtectedRoute><Manufacturing /></ProtectedRoute>} />
          <Route path="/daybook" element={<ProtectedRoute><DayBook /></ProtectedRoute>} />
          
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;