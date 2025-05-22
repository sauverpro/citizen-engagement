import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../../hooks/useAuth';
import {
  getOverallStats,
  getStatusDistribution,
  getCategoryDistribution,
  getTrendAnalysis,
  getAgencyPerformance
} from '../../api/analytics';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const StatCard = ({ title, value, change, icon }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{title}</h3>
      <span className="text-2xl text-blue-600 dark:text-blue-400">{icon}</span>
    </div>
    <div className="flex items-end justify-between">
      <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
      {change && (
        <span className={`text-sm font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
        </span>
      )}
    </div>
  </div>
);

export default function DashboardAnalytics() {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [overallStats, setOverallStats] = useState(null);
  const [statusData, setStatusData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [agencyData, setAgencyData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      // Get token from user context or localStorage
      const token = user?.token || localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication required');
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError('');
      try {
        const [stats, status, category, trend, agencies] = await Promise.all([
          getOverallStats(token).catch(err => {
            console.error('Failed to fetch overall stats:', err);
            return null;
          }),
          getStatusDistribution(token).catch(err => {
            console.error('Failed to fetch status distribution:', err);
            return [];
          }),
          getCategoryDistribution(token).catch(err => {
            console.error('Failed to fetch category distribution:', err);
            return [];
          }),
          getTrendAnalysis(token).catch(err => {
            console.error('Failed to fetch trend analysis:', err);
            return [];
          }),
          getAgencyPerformance(token).catch(err => {
            console.error('Failed to fetch agency performance:', err);
            return [];
          })
        ]);

        if (!stats) {
          throw new Error('Failed to fetch analytics data');
        }

        setOverallStats(stats);
        setStatusData(status);
        setCategoryData(category);
        setTrendData(trend);
        setAgencyData(agencies);
      } catch (err) {
        setError(err.message || 'Failed to fetch analytics data');
        // Reset states on error
        setOverallStats(null);
        setStatusData([]);
        setCategoryData([]);
        setTrendData([]);
        setAgencyData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.token]); // Keep the dependency on user.token for updates

  // Get token for the initial check
  const token = user?.token || localStorage.getItem('token');
  
  if (!token) {
    return (
      <div className="text-red-600 p-4 bg-red-100 rounded">
        Please log in to view analytics
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 p-4 bg-red-100 rounded">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Total Complaints</h3>
          <p className="text-3xl font-bold text-blue-600">{overallStats?.totalComplaints || 0}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Resolution Rate</h3>
          <p className="text-3xl font-bold text-green-600">
            {overallStats?.resolutionRate?.toFixed(1)}%
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Avg Response Time</h3>
          <p className="text-3xl font-bold text-orange-600">
            {overallStats?.avgResponseTime?.toFixed(1)} days
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Active Agencies</h3>
          <p className="text-3xl font-bold text-purple-600">{overallStats?.activeAgencies || 0}</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Complaint Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Complaints by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#0088FE" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Trend Analysis */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Complaint Trend (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Agency Performance */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Agency Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={agencyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="resolved" stackId="a" fill="#00C49F" name="Resolved" />
              <Bar dataKey="pending" stackId="a" fill="#FF8042" name="Pending" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
} 