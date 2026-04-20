import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  LayoutDashboard, UploadCloud, LineChart, FileText, 
  BookOpen, Package, Calculator, Scale, Settings, 
  Book, Landmark, Hammer, PackageSearch, LogOut 
} from 'lucide-react';

const Sidebar = () => {
  // Grab the user details and logout function from our Global State
  const { user, logout } = useContext(AuthContext);

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
      isActive 
        ? 'bg-indigo-600 text-white font-medium shadow-md shadow-indigo-900/20' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
    }`;

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-screen fixed left-0 top-0 flex flex-col border-r border-slate-800">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <span className="bg-indigo-600 w-8 h-8 rounded-lg flex items-center justify-center">N</span>
          NEXUS ERP
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
        
        {/* SECTION 1: Analytics (HIDDEN FROM CASHIERS) */}
        {user?.role === 'admin' && (
          <div>
            <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Analytics</p>
            <nav className="space-y-1">
              <NavLink to="/dashboard" className={navLinkClass}>
                <LayoutDashboard size={20} /> Dashboard
              </NavLink>
              <NavLink to="/predictions" className={navLinkClass}>
                <LineChart size={20} /> AI Forecast
              </NavLink>
              <NavLink to="/import" className={navLinkClass}>
                <UploadCloud size={20} /> Data Import
              </NavLink>
            </nav>
          </div>
        )}

        {/* SECTION 2: Accounting & ERP (EVERYONE SEES THIS) */}
        <div>
          <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Accounting</p>
          <nav className="space-y-1">
            <NavLink to="/vouchers" className={navLinkClass}>
              <FileText size={20} /> Voucher Entry
            </NavLink>
            <NavLink to="/ledgers" className={navLinkClass}>
              <BookOpen size={20} /> Ledger Accounts
            </NavLink>
            <NavLink to="/inventory" className={navLinkClass}>
              <Package size={20} /> Stock / Inventory
            </NavLink>
            <NavLink to="/manufacturing" className={navLinkClass}>
              <Hammer size={20} /> Manufacturing
            </NavLink>
            <NavLink to="/daybook" className={navLinkClass}>
              <Book size={20} /> Daybook
            </NavLink>

            {/* Admin-Only Accounting Tools */}
            {user?.role === 'admin' && (
              <>
                <NavLink to="/pnl" className={navLinkClass}>
                  <Calculator size={20} /> Profit & Loss
                </NavLink>
                <NavLink to="/balance-sheet" className={navLinkClass}>
                  <Scale size={20} /> Balance Sheet
                </NavLink>
                <NavLink to="/reconciliation" className={navLinkClass}>
                  <Landmark size={20} /> Reconciliation
                </NavLink>
                <NavLink to="/bulk-import" className={navLinkClass}>
                  <PackageSearch size={20} /> Bulk Import
                </NavLink>
              </>
            )}
          </nav>
        </div>

      </div>

      {/* Settings & User Profile at the bottom */}
      <div className="p-4 border-t border-slate-800">
        
        {/* User Badge */}
        <div className="px-4 py-3 mb-2 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold uppercase">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="overflow-hidden">
            <div className="text-sm font-bold text-white truncate">{user?.name}</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider">{user?.role}</div>
          </div>
        </div>

        <button onClick={logout} className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white w-full transition-colors font-bold">
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;