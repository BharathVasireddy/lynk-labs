"use client";

import { useState, useEffect } from "react";

interface DashboardStats {
  totalUsers: number;
  totalTests: number;
  totalOrders: number;
  totalHomeVisits: number;
  pendingHomeVisits: number;
  todayRevenue: number;
  monthlyRevenue: number;
  totalRevenue: number;
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    user: { name: string | null; email: string };
    status: string;
    finalAmount: number;
    createdAt: string;
  }>;
  recentUsers: Array<{
    id: string;
    name: string | null;
    email: string;
    role: string;
    createdAt: string;
  }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardStats = async () => {
    try {
      console.log('Fetching dashboard stats...');
      setLoading(true);
      setError(null);
      const response = await fetch('/api/admin/dashboard');
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Dashboard data:', data);
        setStats(data);
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch dashboard stats:', errorText);
        setError(`Failed to fetch data: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setError(`Network error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <p className="text-red-600">Error: {error}</p>
        <button 
          onClick={fetchDashboardStats}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <p>No data available</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
          <p className="text-2xl font-bold">{stats.totalUsers}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Tests</h3>
          <p className="text-2xl font-bold">{stats.totalTests}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
          <p className="text-2xl font-bold">{stats.totalOrders}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Pending Visits</h3>
          <p className="text-2xl font-bold">{stats.pendingHomeVisits}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
          {stats.recentOrders && stats.recentOrders.length === 0 ? (
            <p className="text-gray-500">No recent orders</p>
          ) : (
            <div className="space-y-2">
              {stats.recentOrders?.map((order) => (
                <div key={order.id} className="p-2 border rounded">
                  <p className="font-medium">#{order.orderNumber}</p>
                  <p className="text-sm text-gray-600">{order.user.name || order.user.email}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Recent Users</h3>
          {stats.recentUsers && stats.recentUsers.length === 0 ? (
            <p className="text-gray-500">No recent users</p>
          ) : (
            <div className="space-y-2">
              {stats.recentUsers?.map((user) => (
                <div key={user.id} className="p-2 border rounded">
                  <p className="font-medium">{user.name || user.email}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 