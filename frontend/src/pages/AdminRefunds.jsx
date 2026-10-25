import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { CreditCard, CheckCircle } from 'lucide-react';

const AdminRefunds = () => {
    const [refunds, setRefunds] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useContext(AuthContext);

    const fetchRefunds = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/admin/refunds', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRefunds(res.data);
        } catch (err) {
            console.error('Error fetching refunds:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRefunds();
    }, []);

    const processRefund = async (id) => {
        if (!window.confirm("Are you sure you want to process this refund?")) return;
        try {
            await axios.put(`http://localhost:5000/api/admin/refunds/${id}/process`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchRefunds();
        } catch (err) {
            alert('Failed to process refund');
        }
    }

    if (loading) return <div className="text-center p-10 font-bold">Loading Refunds...</div>;

    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h1 className="text-3xl font-black text-[#0B2046] flex items-center mb-8">
                <CreditCard className="mr-3 h-8 w-8 text-red-500" /> Cancellations & Refunds
            </h1>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-gray-600">
                            <th className="p-4 font-bold">Refund ID</th>
                            <th className="p-4 font-bold">Booking ID</th>
                            <th className="p-4 font-bold">Amount</th>
                            <th className="p-4 font-bold">Status</th>
                            <th className="p-4 font-bold">Requested On</th>
                            <th className="p-4 font-bold text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {refunds.map((refund) => (
                            <tr key={refund.id} className="border-b border-gray-100 hover:bg-blue-50 transition">
                                <td className="p-4 font-semibold text-gray-700">#{refund.id}</td>
                                <td className="p-4 font-bold text-blue-600">#{refund.booking_id}</td>
                                <td className="p-4 font-bold text-red-500">₹{refund.amount}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${refund.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {refund.status}
                                    </span>
                                </td>
                                <td className="p-4 font-medium text-gray-500">{new Date(refund.created_at).toLocaleDateString()}</td>
                                <td className="p-4 flex justify-center space-x-3">
                                    {refund.status !== 'COMPLETED' && (
                                        <button onClick={() => processRefund(refund.id)} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded font-bold text-sm flex items-center transition">
                                            <CheckCircle className="h-4 w-4 mr-1" /> Process
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {refunds.length === 0 && (
                            <tr><td colSpan="6" className="p-8 text-center text-gray-500 font-bold">No refund requests found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminRefunds;
