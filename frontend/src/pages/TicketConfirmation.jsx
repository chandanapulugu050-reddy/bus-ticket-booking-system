import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, Printer, Download } from 'lucide-react';

const TicketConfirmation = () => {
    const { pnr } = useParams();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const token = localStorage.getItem('token');
                // First try direct lookup by PNR
                try {
                    const directRes = await axios.get(`http://localhost:5000/api/bookings/pnr/${pnr}`);
                    if (directRes.data && directRes.data.pnr) {
                        setBooking(directRes.data);
                        setLoading(false);
                        return;
                    }
                } catch (pnrErr) {
                    console.log('Direct PNR lookup fallback:', pnrErr.message);
                }

                // Fallback to my bookings
                if (token && token !== 'null') {
                    const res = await axios.get('http://localhost:5000/api/bookings/my', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    const foundBooking = res.data.find(b => b.pnr === pnr);
                    if (foundBooking) {
                        const detailRes = await axios.get(`http://localhost:5000/api/bookings/${foundBooking.id}`, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        setBooking(detailRes.data);
                    } else {
                        setError('Booking not found');
                    }
                } else {
                    setError('Unable to load ticket details.');
                }
            } catch (err) {
                setError('Error fetching ticket details');
            } finally {
                setLoading(false);
            }
        };
        fetchBooking();
    }, [pnr]);

    if (loading) return <div className="text-center py-20 text-xl">Generating Ticket...</div>;
    if (error) return <div className="text-center py-20 text-red-600">{error}</div>;
    if (!booking) return null;

    return (
        <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-800">Ticket Confirmed</h2>
                <p className="text-gray-500 mt-2">Your bus ticket has been successfully confirmed.</p>
            </div>

            <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200" id="printable-ticket">
                <div className="bg-primary text-white p-6 flex justify-between items-center border-b-4 border-accent">
                    <div>
                        <h1 className="text-2xl font-bold tracking-wider">BUS TICKET</h1>
                        <p className="opacity-80 mt-1">{booking.bus_name} ({booking.bus_number})</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm opacity-80 uppercase tracking-widest">PNR Number</p>
                        <p className="text-2xl font-mono font-bold text-accent">{booking.pnr}</p>
                    </div>
                </div>

                <div className="p-8">
                    <div className="flex justify-between items-center mb-8">
                        <div className="text-left">
                            <p className="text-sm text-gray-500 uppercase">From</p>
                            <p className="text-xl font-bold text-gray-800">{booking.source}</p>
                            <p className="text-sm font-semibold text-gray-700 mt-1">{booking.boarding_point_name}</p>
                            <p className="text-sm text-gray-500">{booking.departure_time}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-gray-400 font-bold uppercase mb-1">Date of Journey</p>
                            <p className="font-semibold">{new Date(booking.journey_date).toLocaleDateString()}</p>
                            <div className="w-24 border-t-2 border-dashed border-gray-300 my-2 mx-auto relative">
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500 uppercase">To</p>
                            <p className="text-xl font-bold text-gray-800">{booking.destination}</p>
                            <p className="text-sm font-semibold text-gray-700 mt-1">{booking.dropping_point_name}</p>
                            <p className="text-sm text-gray-500">{booking.arrival_time}</p>
                        </div>
                    </div>

                    <div className="border-t border-b border-gray-200 py-4 mb-6">
                        <p className="text-sm text-gray-500 uppercase mb-2">Passenger Details</p>
                        <div className="space-y-2">
                            {booking.passengers.map(p => (
                                <div key={p.id} className="flex justify-between bg-gray-50 p-2 rounded">
                                    <span className="font-semibold">{p.name} ({p.age}, {p.gender.charAt(0)})</span>
                                    <span className="font-bold text-primary">Seat: {p.seat_number}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-sm text-gray-500 uppercase">Total Fare</p>
                            <p className="text-2xl font-bold text-gray-900">₹{booking.total_fare}</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${booking.pnr}`} alt="QR Code" className="w-24 h-24" />
                            <span className="text-xs text-gray-400 mt-1">Scan for details</span>
                        </div>
                    </div>
                </div>
                
                <div className="bg-gray-50 p-4 text-center text-xs text-gray-500">
                    <p>Status: <span className="font-bold text-green-600">CONFIRMED</span> | Payment: SUCCESS</p>
                </div>
            </div>

            <div className="mt-8 flex justify-center space-x-4">
                <button onClick={() => window.print()} className="flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded transition">
                    <Printer className="mr-2 h-4 w-4" /> Print Ticket
                </button>
                <Link to="/my-bookings" className="flex items-center bg-primary hover:bg-blue-900 text-white px-6 py-2 rounded transition">
                    View My Bookings
                </Link>
            </div>
        </div>
    );
};

export default TicketConfirmation;
