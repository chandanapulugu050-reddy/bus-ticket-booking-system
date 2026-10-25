import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Star, CheckCircle, XCircle, Trash2 } from 'lucide-react';

const AdminReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useContext(AuthContext);

    const fetchReviews = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/admin/reviews', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReviews(res.data);
        } catch (err) {
            console.error('Error fetching reviews:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    if (loading) return <div className="text-center p-10 font-bold">Loading Reviews...</div>;

    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h1 className="text-3xl font-black text-[#0B2046] flex items-center mb-8">
                <Star className="mr-3 h-8 w-8 text-yellow-500 fill-yellow-500" /> Manage Reviews
            </h1>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-gray-600">
                            <th className="p-4 font-bold">ID</th>
                            <th className="p-4 font-bold">User</th>
                            <th className="p-4 font-bold">Bus</th>
                            <th className="p-4 font-bold">Rating</th>
                            <th className="p-4 font-bold w-1/3">Comment</th>
                            <th className="p-4 font-bold text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reviews.map((review) => (
                            <tr key={review.id} className="border-b border-gray-100 hover:bg-blue-50 transition">
                                <td className="p-4 font-semibold text-gray-700">#{review.id}</td>
                                <td className="p-4 font-bold text-[#0B2046]">{review.user_name}</td>
                                <td className="p-4 font-bold text-gray-700">{review.bus_name}</td>
                                <td className="p-4">
                                    <div className="flex items-center text-yellow-500 font-bold">
                                        {review.rating} <Star className="h-4 w-4 ml-1 fill-yellow-500" />
                                    </div>
                                </td>
                                <td className="p-4 text-sm text-gray-600 italic">"{review.comment}"</td>
                                <td className="p-4 flex justify-center space-x-3">
                                    <button className="text-green-500 hover:text-green-700"><CheckCircle className="h-5 w-5" /></button>
                                    <button className="text-yellow-500 hover:text-yellow-700"><XCircle className="h-5 w-5" /></button>
                                    <button className="text-red-500 hover:text-red-700"><Trash2 className="h-5 w-5" /></button>
                                </td>
                            </tr>
                        ))}
                        {reviews.length === 0 && (
                            <tr><td colSpan="6" className="p-8 text-center text-gray-500 font-bold">No reviews found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminReviews;
