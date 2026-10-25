import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { CalendarClock, Plus, Edit, Trash2 } from 'lucide-react';

const AdminSchedules = () => {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useContext(AuthContext);

    const fetchSchedules = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/admin/routes', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSchedules(res.data);
        } catch (err) {
            console.error('Error fetching schedules:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchedules();
    }, []);

    if (loading) return <div className="text-center p-10 font-bold">Loading Schedules...</div>;

    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-black text-[#0B2046] flex items-center">
                    <CalendarClock className="mr-3 h-8 w-8 text-[#F97316]" /> Manage Schedules
                </h1>
                <button className="bg-[#F97316] hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-bold flex items-center transition shadow-md">
                    <Plus className="mr-2 h-5 w-5" /> Add Schedule
                </button>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-gray-600">
                            <th className="p-4 font-bold">ID</th>
                            <th className="p-4 font-bold">Bus</th>
                            <th className="p-4 font-bold">Route</th>
                            <th className="p-4 font-bold">Date</th>
                            <th className="p-4 font-bold">Time</th>
                            <th className="p-4 font-bold">Fare</th>
                            <th className="p-4 font-bold text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {schedules.map((schedule) => (
                            <tr key={schedule.id} className="border-b border-gray-100 hover:bg-blue-50 transition">
                                <td className="p-4 font-semibold text-gray-700">#{schedule.id}</td>
                                <td className="p-4 font-bold text-[#0B2046]">{schedule.bus_name || `Bus #${schedule.bus_id}`}</td>
                                <td className="p-4">{schedule.source} &rarr; {schedule.destination}</td>
                                <td className="p-4 font-medium text-gray-600">{schedule.journey_date}</td>
                                <td className="p-4"><span className="bg-green-100 text-green-700 px-2 py-1 rounded font-bold">{schedule.departure_time?.substring(0,5)}</span></td>
                                <td className="p-4 font-bold text-[#F97316]">₹{schedule.starting_price}</td>
                                <td className="p-4 flex justify-center space-x-3">
                                    <button className="text-blue-500 hover:text-blue-700"><Edit className="h-5 w-5" /></button>
                                    <button className="text-red-500 hover:text-red-700"><Trash2 className="h-5 w-5" /></button>
                                </td>
                            </tr>
                        ))}
                        {schedules.length === 0 && (
                            <tr><td colSpan="7" className="p-8 text-center text-gray-500 font-bold">No schedules found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminSchedules;
