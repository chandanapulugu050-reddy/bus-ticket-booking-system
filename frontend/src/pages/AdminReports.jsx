import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { BarChart3, TrendingUp, DollarSign } from 'lucide-react';

const AdminReports = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const { token } = useContext(AuthContext);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/admin/stats', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats(res.data);
            } catch (err) {
                console.error('Error fetching stats:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading || !stats) return <div className="text-center p-10 font-bold">Loading Reports...</div>;

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-black text-[#0B2046] flex items-center">
                <BarChart3 className="mr-3 h-8 w-8 text-purple-500" /> Business Reports
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
                    <div className="bg-green-100 p-4 rounded-xl text-green-600 mr-4"><DollarSign className="h-8 w-8" /></div>
                    <div>
                        <p className="text-gray-500 font-bold text-sm">Total Revenue</p>
                        <h3 className="text-3xl font-black text-gray-800">₹{stats.totalRevenue.toLocaleString()}</h3>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
                    <div className="bg-blue-100 p-4 rounded-xl text-blue-600 mr-4"><TrendingUp className="h-8 w-8" /></div>
                    <div>
                        <p className="text-gray-500 font-bold text-sm">Total Bookings</p>
                        <h3 className="text-3xl font-black text-gray-800">{stats.totalBookings}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
                    <div className="bg-red-100 p-4 rounded-xl text-red-600 mr-4"><BarChart3 className="h-8 w-8" /></div>
                    <div>
                        <p className="text-gray-500 font-bold text-sm">Total Cancellations</p>
                        <h3 className="text-3xl font-black text-gray-800">0</h3>
                    </div>
                </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold mb-6 text-gray-800">Recent Transactions</h3>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <p className="text-gray-500 font-bold">Chart placeholder - requires chart.js or recharts</p>
                </div>
            </div>
        </div>
    );
};

export default AdminReports;
