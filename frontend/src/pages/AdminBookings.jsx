import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Eye } from 'lucide-react';

const AdminBookings = () => {
    const { token } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/admin/bookings', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setBookings(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching bookings", err);
                setLoading(false);
            }
        };

        fetchBookings();
    }, [token]);

    if (loading) return <div>Loading Bookings...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-extrabold text-gray-900">Manage Bookings</h1>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600 text-sm uppercase font-bold">
                            <tr>
                                <th className="px-6 py-4">PNR</th>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Route</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Fare</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {bookings.map(b => (
                                <tr key={b.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 font-bold font-mono text-[#0B2046]">{b.pnr}</td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-900">{b.user_name}</div>
                                        <div className="text-xs text-gray-500">{b.user_email}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-700">{b.source} → {b.destination}</td>
                                    <td className="px-6 py-4">{b.journey_date}</td>
                                    <td className="px-6 py-4 font-bold text-[#F97316]">₹{b.final_fare}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${b.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : b.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {b.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-blue-600 hover:text-blue-800 transition flex items-center justify-end w-full">
                                            <Eye className="h-4 w-4 mr-1" /> View
                                        </button>
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

export default AdminBookings;
