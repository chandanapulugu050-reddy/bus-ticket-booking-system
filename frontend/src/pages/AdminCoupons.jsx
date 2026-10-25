import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FileText, Plus, Edit, Trash2 } from 'lucide-react';

const AdminCoupons = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useContext(AuthContext);

    const fetchCoupons = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/admin/coupons', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCoupons(res.data);
        } catch (err) {
            console.error('Error fetching coupons:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    if (loading) return <div className="text-center p-10 font-bold">Loading Coupons...</div>;

    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-black text-[#0B2046] flex items-center">
                    <FileText className="mr-3 h-8 w-8 text-blue-500" /> Manage Coupons
                </h1>
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-bold flex items-center transition shadow-md">
                    <Plus className="mr-2 h-5 w-5" /> Add Coupon
                </button>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-gray-600">
                            <th className="p-4 font-bold">ID</th>
                            <th className="p-4 font-bold">Code</th>
                            <th className="p-4 font-bold">Type</th>
                            <th className="p-4 font-bold">Value</th>
                            <th className="p-4 font-bold">Min Amount</th>
                            <th className="p-4 font-bold">Status</th>
                            <th className="p-4 font-bold text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {coupons.map((coupon) => (
                            <tr key={coupon.id} className="border-b border-gray-100 hover:bg-blue-50 transition">
                                <td className="p-4 font-semibold text-gray-700">#{coupon.id}</td>
                                <td className="p-4 font-black tracking-wider text-green-600">{coupon.code}</td>
                                <td className="p-4 font-medium text-gray-600">{coupon.discount_type}</td>
                                <td className="p-4 font-bold">{coupon.discount_type === 'PERCENT' ? `${coupon.discount_value}%` : `₹${coupon.discount_value}`}</td>
                                <td className="p-4">₹{coupon.min_amount}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${coupon.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {coupon.status}
                                    </span>
                                </td>
                                <td className="p-4 flex justify-center space-x-3">
                                    <button className="text-blue-500 hover:text-blue-700"><Edit className="h-5 w-5" /></button>
                                    <button className="text-red-500 hover:text-red-700"><Trash2 className="h-5 w-5" /></button>
                                </td>
                            </tr>
                        ))}
                        {coupons.length === 0 && (
                            <tr><td colSpan="7" className="p-8 text-center text-gray-500 font-bold">No coupons found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminCoupons;
