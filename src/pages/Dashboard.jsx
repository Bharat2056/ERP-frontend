import React, { useState, useEffect } from 'react';
import { DollarSign, ShoppingBag, Users, Loader2 } from 'lucide-react';
import StatCard from '../components/StatCard';
import SalesChart from '../components/SalesChart';
import InsightPanel from '../components/InsightPanel';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch real data from your Node.js server
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/dashboard-stats');
        const data = await response.json();
        
        if (data.success) {
          setDashboardData(data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []); // The empty array ensures this only runs once when the page loads

  // Show a loading spinner while waiting for the database
  if (loading) {
    return (
      <div className="flex-1 ml-64 p-8 flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  // If no data exists yet, prompt them to upload
  if (!dashboardData || dashboardData.chartData.length === 0) {
    return (
      <div className="flex-1 ml-64 p-8 flex flex-col items-center justify-center min-h-screen text-slate-500">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">No Data Available</h2>
        <p>Please use the Data Import tool to upload a CSV file first.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 ml-64 p-8">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Overview</h2>
        <p className="text-slate-500 mt-1">Here is what is happening with your store based on your latest data.</p>
      </header>

      {/* Top Stats Grid using Real Data */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          title="Total Revenue" 
          value={`$${dashboardData.stats.totalRevenue.toLocaleString()}`} 
          trend="Calculated" trendUp={true} icon={DollarSign} 
        />
        <StatCard 
          title="Total Orders" 
          value={dashboardData.stats.totalOrders} 
          trend="Calculated" trendUp={true} icon={ShoppingBag} 
        />
        <StatCard 
          title="Active Customers" 
          value={dashboardData.stats.activeCustomers} 
          trend="Calculated" trendUp={true} icon={Users} 
        />
      </div>

      {/* Chart and AI Insights Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
          {/* Pass the real chart data down to the component */}
          <SalesChart data={dashboardData.chartData} />
        </div>
        <div className="xl:col-span-1">
          <InsightPanel />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;