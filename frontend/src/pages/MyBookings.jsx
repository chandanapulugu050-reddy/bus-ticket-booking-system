import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchBookings = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/bookings/my', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBookings(res.data);
        } catch (err) {
            setError('Error fetching bookings');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleCancel = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this ticket?')) return;
        
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:5000/api/bookings/${id}/cancel`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Your ticket has been cancelled successfully.');
            fetchBookings(); // refresh list
        } catch (err) {
            alert(err.response?.data?.message || 'Error cancelling booking');
        }
    };

    if (loading) return <div className="text-center py-20 text-xl">Loading your bookings...</div>;
    if (error) return <div className="text-center py-20 text-red-600">{error}</div>;

    return (
        <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-primary mb-8">My Bookings</h2>

            {bookings.length === 0 ? (
                <div className="bg-white p-8 text-center rounded-xl shadow border border-gray-100">
                    <p className="text-xl text-gray-600 mb-4">You have no bookings yet.</p>
                    <Link to="/" className="text-accent hover:underline font-bold">Search Buses</Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {bookings.map(booking => (
                        <div key={booking.id} className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col md:flex-row justify-between items-center transition hover:shadow-lg relative overflow-hidden">
                            {booking.status === 'CANCELLED' && (
                                <div className="absolute top-4 right-4 bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded">CANCELLED</div>
                            )}
                            {booking.status === 'CONFIRMED' && (
                                <div className="absolute top-4 right-4 bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded">CONFIRMED</div>
                            )}
                            
                            <div className="flex-1 mb-4 md:mb-0">
                                <div className="flex items-center space-x-2 mb-2">
                                    <h3 className="text-xl font-bold text-primary">{booking.bus_name}</h3>
                                    <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded text-gray-600">PNR: {booking.pnr}</span>
                                </div>
                                <p className="text-sm font-semibold text-gray-800">
                                    {booking.source} → {booking.destination}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">Journey Date: {new Date(booking.journey_date).toLocaleDateString()}</p>
                                <p className="text-sm text-gray-500">Total Fare: ₹{booking.total_fare}</p>
                            </div>
                            
                            <div className="flex flex-col space-y-2 w-full md:w-auto">
                                <Link 
                                    to={`/ticket-confirmation/${booking.pnr}`}
                                    className="text-center bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-700 font-semibold py-2 px-6 rounded transition"
                                >
                                    View Ticket
                                </Link>
                                {booking.status === 'CONFIRMED' && (
                                    <button 
                                        onClick={() => handleCancel(booking.id)}
                                        className="text-center border border-red-200 hover:bg-red-50 text-red-600 font-semibold py-2 px-6 rounded transition"
                                    >
                                        Cancel Ticket
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBookings;
