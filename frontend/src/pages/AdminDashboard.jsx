import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Users, Bus, Ticket, CheckCircle, XCircle, LayoutDashboard } from 'lucide-react';

const AdminDashboard = () => {
    const { token } = useContext(AuthContext);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/admin/dashboard', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Dashboard error", err);
                setLoading(false);
            }
        };

        fetchStats();
    }, [token]);

    if (loading) return <div className="text-center py-20 text-xl font-bold">Loading Stats...</div>;
    if (!stats) return <div className="text-center py-20 text-xl font-bold text-red-500">Failed to load dashboard data.</div>;

    return (
        <div>
            <div className="mb-8 flex justify-between items-center">
                <h1 className="text-3xl font-extrabold text-gray-900">Platform Overview</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-6 hover:shadow-md transition">
                    <div className="p-4 bg-blue-100 rounded-xl text-blue-600">
                        <Bus className="h-8 w-8" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Total Buses</p>
                        <h3 className="text-3xl font-black text-gray-900">{stats.totalBuses}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-6 hover:shadow-md transition">
                    <div className="p-4 bg-green-100 rounded-xl text-green-600">
                        <Users className="h-8 w-8" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Total Users</p>
                        <h3 className="text-3xl font-black text-gray-900">{stats.totalUsers}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-6 hover:shadow-md transition">
                    <div className="p-4 bg-orange-100 rounded-xl text-[#F97316]">
                        <Ticket className="h-8 w-8" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Total Bookings</p>
                        <h3 className="text-3xl font-black text-gray-900">{stats.totalBookings}</h3>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-6 hover:shadow-md transition">
                    <div className="p-4 bg-teal-100 rounded-xl text-teal-600">
                        <CheckCircle className="h-8 w-8" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Confirmed</p>
                        <h3 className="text-3xl font-black text-gray-900">{stats.confirmedBookings}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-6 hover:shadow-md transition">
                    <div className="p-4 bg-red-100 rounded-xl text-red-600">
                        <XCircle className="h-8 w-8" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Cancelled</p>
                        <h3 className="text-3xl font-black text-gray-900">{stats.cancelledBookings}</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-6 hover:shadow-md transition">
                    <div className="p-4 bg-purple-100 rounded-xl text-purple-600">
                        <LayoutDashboard className="h-8 w-8" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Total Routes</p>
                        <h3 className="text-3xl font-black text-gray-900">32</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-6 hover:shadow-md transition">
                    <div className="p-4 bg-yellow-100 rounded-xl text-yellow-600">
                        <CheckCircle className="h-8 w-8" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Total Schedules</p>
                        <h3 className="text-3xl font-black text-gray-900">144</h3>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-6 hover:shadow-md transition">
                    <div className="p-4 bg-emerald-100 rounded-xl text-emerald-600">
                        <Ticket className="h-8 w-8" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Revenue</p>
                        <h3 className="text-3xl font-black text-gray-900">₹24,500</h3>
                    </div>
                </div>
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 border-b pb-4 mb-4">Recent Bookings</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <div>
                                <p className="font-bold">Rahul Sharma</p>
                                <p className="text-xs text-gray-500">Mumbai to Pune</p>
                            </div>
                            <span className="text-green-600 font-bold">CONFIRMED</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 border-b pb-4 mb-4">Booking/Revenue charts or summaries</h3>
                    <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg text-gray-400 font-bold border border-dashed border-gray-300">
                        [Chart Visualization placeholder]
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
