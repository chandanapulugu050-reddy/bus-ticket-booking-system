import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const AdminRoutes = () => {
    const { token } = useContext(AuthContext);
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRoutes = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/admin/routes', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setRoutes(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching routes", err);
                setLoading(false);
            }
        };

        fetchRoutes();
    }, [token]);

    if (loading) return <div>Loading Routes...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-extrabold text-gray-900">Manage Routes</h1>
                <button className="bg-[#F97316] text-white px-5 py-2.5 rounded-lg font-bold hover:bg-orange-600 transition flex items-center">
                    <Plus className="h-5 w-5 mr-2" /> Add New Route
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600 text-sm uppercase font-bold">
                            <tr>
                                <th className="px-6 py-4">Route</th>
                                <th className="px-6 py-4">Bus</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Time</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {routes.slice(0, 50).map(route => (
                                <tr key={route.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 font-bold text-[#0B2046]">{route.source} → {route.destination}</td>
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-600">{route.bus_name}</td>
                                    <td className="px-6 py-4">{route.journey_date}</td>
                                    <td className="px-6 py-4">{route.departure_time} - {route.arrival_time}</td>
                                    <td className="px-6 py-4 font-bold text-[#F97316]">₹{route.starting_price}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-blue-600 hover:text-blue-800 mr-4 transition"><Edit2 className="h-4 w-4" /></button>
                                        <button className="text-red-500 hover:text-red-700 transition"><Trash2 className="h-4 w-4" /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminRoutes;
