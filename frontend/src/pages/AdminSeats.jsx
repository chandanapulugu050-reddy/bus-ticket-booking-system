import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { LayoutGrid, Eye, Lock, Unlock } from 'lucide-react';

const AdminSeats = () => {
    const [buses, setBuses] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useContext(AuthContext);

    const fetchBuses = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/admin/buses', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBuses(res.data);
        } catch (err) {
            console.error('Error fetching buses for seats:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBuses();
    }, []);

    if (loading) return <div className="text-center p-10 font-bold">Loading Seat Layouts...</div>;

    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h1 className="text-3xl font-black text-[#0B2046] flex items-center mb-8">
                <LayoutGrid className="mr-3 h-8 w-8 text-teal-500" /> Seat Management
            </h1>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-gray-600">
                            <th className="p-4 font-bold">Bus ID</th>
                            <th className="p-4 font-bold">Operator</th>
                            <th className="p-4 font-bold">Type</th>
                            <th className="p-4 font-bold">Total Seats</th>
                            <th className="p-4 font-bold text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {buses.map((bus) => (
                            <tr key={bus.id} className="border-b border-gray-100 hover:bg-blue-50 transition">
                                <td className="p-4 font-semibold text-gray-700">#{bus.id}</td>
                                <td className="p-4 font-bold text-[#0B2046]">{bus.name}</td>
                                <td className="p-4 text-gray-600 font-medium">{bus.type}</td>
                                <td className="p-4 font-bold text-teal-600">{bus.total_seats}</td>
                                <td className="p-4 flex justify-center space-x-3">
                                    <button className="bg-teal-50 text-teal-600 hover:bg-teal-100 px-3 py-1 rounded-md font-bold text-sm flex items-center">
                                        <Eye className="h-4 w-4 mr-1" /> View Layout
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {buses.length === 0 && (
                            <tr><td colSpan="5" className="p-8 text-center text-gray-500 font-bold">No buses found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminSeats;
