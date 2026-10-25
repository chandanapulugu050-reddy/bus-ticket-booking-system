import React, { useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';

const PassengerDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    const [passengers, setPassengers] = useState(
        location.state?.bookingData?.selectedSeats?.map(() => ({ name: '', age: '', gender: '' })) || []
    );
    const [contactEmail, setContactEmail] = useState('');
    const [contactPhone, setContactPhone] = useState('');

    if (!location.state || !location.state.bookingData) {
        return <Navigate to="/" replace />;
    }

    const { bookingData } = location.state;
    const { bus, selectedSeats, boardingPoint, droppingPoint, totalFare } = bookingData;

    const handlePassengerChange = (index, field, value) => {
        const newPassengers = [...passengers];
        newPassengers[index][field] = value;
        setPassengers(newPassengers);
    };

    const handleContinue = (e) => {
        e.preventDefault();
        
        // Validation handled by required attributes on form
        const finalBookingData = {
            ...bookingData,
            passengers,
            contactEmail,
            contactPhone
        };
        
        navigate('/booking-summary', { state: { bookingData: finalBookingData } });
    };

    const formattedFare = parseFloat(totalFare || (selectedSeats.length * parseFloat(bus?.route?.starting_price || 0))).toFixed(2);

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Journey & Booking Summary Card */}
            <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
                <div className="flex flex-wrap justify-between items-start gap-4 pb-4 border-b border-gray-100">
                    <div>
                        <span className="text-xs uppercase tracking-wider font-bold text-orange-600 bg-orange-100 px-2.5 py-0.5 rounded-full">
                            {bus?.type || 'Express'}
                        </span>
                        <h2 className="text-2xl font-bold text-gray-900 mt-1">{bus?.name}</h2>
                        <p className="text-sm text-gray-500">Bus No: <span className="font-semibold text-gray-700">{bus?.number}</span></p>
                    </div>
                    <div className="text-right">
                        <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Total Fare</span>
                        <p className="text-2xl font-extrabold text-primary">₹{formattedFare}</p>
                        <p className="text-xs text-green-700 font-semibold">{selectedSeats.length} {selectedSeats.length === 1 ? 'Seat' : 'Seats'} Selected</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-sm">
                    <div>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Route & Date</p>
                        <p className="font-bold text-gray-900 mt-0.5">{bus?.route?.source || 'Source'} → {bus?.route?.destination || 'Destination'}</p>
                        <p className="text-xs text-gray-600 mt-0.5">{bus?.route?.journey_date || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Boarding Point</p>
                        <p className="font-bold text-gray-900 mt-0.5">{boardingPoint?.name || 'Selected Point'}</p>
                        <p className="text-xs text-gray-600 mt-0.5">{boardingPoint?.time?.substring(0,5)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Dropping Point</p>
                        <p className="font-bold text-gray-900 mt-0.5">{droppingPoint?.name || 'Selected Point'}</p>
                        <p className="text-xs text-gray-600 mt-0.5">{droppingPoint?.time?.substring(0,5)}</p>
                    </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-sm bg-gray-50/70 p-3 rounded-lg">
                    <span className="text-gray-600 font-medium">Selected Seats:</span>
                    <span className="font-bold text-primary bg-white px-3 py-1 rounded shadow-sm border border-gray-200">
                        {selectedSeats.map(s => s.seat_number).join(', ')}
                    </span>
                </div>
            </div>

            {/* Passenger Forms */}
            <div className="bg-white p-8 rounded-xl shadow border border-gray-100">
                <h3 className="text-xl font-bold text-primary mb-6">Passenger Details</h3>
                
                <form onSubmit={handleContinue} className="space-y-8">
                {selectedSeats.map((seat, idx) => (
                    <div key={seat.id} className="p-6 border border-gray-200 rounded-lg bg-gray-50">
                        <h4 className="font-bold text-lg mb-4 text-gray-800">Passenger {idx + 1} <span className="text-sm font-normal text-gray-500">(Seat: {seat.seat_number})</span></h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Name</label>
                                <input 
                                    type="text" 
                                    required
                                    value={passengers[idx].name}
                                    onChange={(e) => handlePassengerChange(idx, 'name', e.target.value)}
                                    className="w-full border-gray-300 rounded p-2 focus:ring-accent" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Age</label>
                                <input 
                                    type="number" min="1" max="100" required
                                    value={passengers[idx].age}
                                    onChange={(e) => handlePassengerChange(idx, 'age', e.target.value)}
                                    className="w-full border-gray-300 rounded p-2 focus:ring-accent" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Gender</label>
                                <select 
                                    required
                                    value={passengers[idx].gender}
                                    onChange={(e) => handlePassengerChange(idx, 'gender', e.target.value)}
                                    className="w-full border-gray-300 rounded p-2 focus:ring-accent"
                                >
                                    <option value="">Select</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                    </div>
                ))}

                <div className="p-6 border border-gray-200 rounded-lg">
                    <h4 className="font-bold text-lg mb-4 text-gray-800">Contact Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Email ID</label>
                            <input 
                                type="email" required
                                value={contactEmail} onChange={(e) => setContactEmail(e.target.value)}
                                className="w-full border-gray-300 rounded p-2 focus:ring-accent" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number</label>
                            <input 
                                type="tel" required
                                value={contactPhone} onChange={(e) => setContactPhone(e.target.value)}
                                className="w-full border-gray-300 rounded p-2 focus:ring-accent" 
                            />
                        </div>
                    </div>
                </div>
                
                <div className="flex justify-end pt-4">
                    <button type="submit" className="bg-accent hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg transition">
                        Review Booking
                    </button>
                </div>
            </form>
        </div>
        </div>
    );
};

export default PassengerDetails;
