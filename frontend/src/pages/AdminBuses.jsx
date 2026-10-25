import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

const AdminBuses = () => {
    const { token } = useContext(AuthContext);
    const [buses, setBuses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Form State
    const [formData, setFormData] = useState({
        name: '', number: '', type: 'AC Seater', amenities: '', total_seats: 40, status: 'active'
    });

    useEffect(() => {
        fetchBuses();
    }, []);

    const fetchBuses = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/admin/buses', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBuses(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching buses", err);
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            // In a real app, distinguish between Add and Edit
            await axios.post('http://localhost:5000/api/admin/buses', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsModalOpen(false);
            fetchBuses(); // refresh
        } catch (err) {
            alert('Failed to save bus');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this bus?')) return;
        try {
            await axios.delete(`http://localhost:5000/api/admin/buses/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchBuses();
        } catch (err) {
            alert('Failed to delete bus');
        }
    };

    if (loading) return <div>Loading Buses...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-extrabold text-gray-900">Manage Buses</h1>
                <button 
                    onClick={() => {
                        setFormData({ name: '', number: '', type: 'AC Seater', amenities: '', total_seats: 40, status: 'active' });
                        setIsModalOpen(true);
                    }}
                    className="bg-[#F97316] text-white px-5 py-2.5 rounded-lg font-bold hover:bg-orange-600 transition flex items-center"
                >
                    <Plus className="h-5 w-5 mr-2" /> Add New Bus
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600 text-sm uppercase font-bold">
                            <tr>
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Operator</th>
                                <th className="px-6 py-4">Bus Number</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Seats</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {buses.map(bus => (
                                <tr key={bus.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 font-medium text-gray-500">#{bus.id}</td>
                                    <td className="px-6 py-4 font-bold text-[#0B2046]">{bus.name}</td>
                                    <td className="px-6 py-4 font-mono text-gray-600">{bus.number}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{bus.type}</td>
                                    <td className="px-6 py-4 font-semibold text-gray-700">{bus.total_seats}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${bus.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {bus.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-blue-600 hover:text-blue-800 mr-4 transition" title="Edit">
                                            <Edit2 className="h-4 w-4" />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(bus.id)}
                                            className="text-red-500 hover:text-red-700 transition" 
                                            title="Delete"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Bus Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-800">Add New Bus</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Operator Name</label>
                                    <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border p-2 rounded" placeholder="e.g. Sri Travels" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Bus Number (Plate)</label>
                                    <input type="text" required value={formData.number} onChange={e => setFormData({...formData, number: e.target.value})} className="w-full border p-2 rounded" placeholder="e.g. AP-12-TA-1234" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Bus Type</label>
                                    <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full border p-2 rounded">
                                        <option>AC Sleeper</option>
                                        <option>Non-AC Sleeper</option>
                                        <option>AC Seater</option>
                                        <option>Non-AC Seater</option>
                                        <option>Volvo Multi-Axle</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Total Seats</label>
                                    <input type="number" required value={formData.total_seats} onChange={e => setFormData({...formData, total_seats: e.target.value})} className="w-full border p-2 rounded" />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Amenities (Comma separated)</label>
                                <input type="text" value={formData.amenities} onChange={e => setFormData({...formData, amenities: e.target.value})} className="w-full border p-2 rounded" placeholder="WiFi, AC, Water Bottle" />
                            </div>

                            <div className="flex justify-end pt-4 space-x-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-lg">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-[#F97316] text-white font-bold rounded-lg hover:bg-orange-600">Save Bus</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminBuses;
