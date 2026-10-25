import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SeatSelection = () => {
    const { id } = useParams(); // bus_id
    const [searchParams] = useSearchParams();
    const routeId = searchParams.get('route_id');
    const navigate = useNavigate();

    const [bus, setBus] = useState(null);
    const [seats, setSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [boardingPoint, setBoardingPoint] = useState('');
    const [droppingPoint, setDroppingPoint] = useState('');
    const [validationError, setValidationError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const busRes = await axios.get(`http://localhost:5000/api/buses/${id}?route_id=${routeId}`);
                setBus(busRes.data);
                const seatsRes = await axios.get(`http://localhost:5000/api/buses/${id}/seats?route_id=${routeId}`);
                setSeats(seatsRes.data);
            } catch (err) {
                console.error('Error fetching seat selection data:', err);
            }
        };
        fetchData();
    }, [id, routeId]);

    const handleSeatClick = (seat) => {
        if (seat.status !== 'AVAILABLE') return;
        
        const isSelected = selectedSeats.some(s => s.id === seat.id);
        if (isSelected) {
            setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
        } else {
            setSelectedSeats([...selectedSeats, seat]);
        }
        setValidationError('');
    };

    const seatPrice = parseFloat(bus?.route?.starting_price) || 0;
    const totalFare = selectedSeats.length * seatPrice;

    // Validation checks
    const hasSeats = selectedSeats.length > 0;
    const seatsAvailable = hasSeats && selectedSeats.every(s => s.status === 'AVAILABLE');
    const hasBoarding = Boolean(boardingPoint && bus?.boardingPoints?.some(bp => String(bp.id) === String(boardingPoint)));
    const hasDropping = Boolean(droppingPoint && bus?.droppingPoints?.some(dp => String(dp.id) === String(droppingPoint)));
    const hasValidFare = totalFare > 0;

    const isFormValid = hasSeats && seatsAvailable && hasBoarding && hasDropping && hasValidFare;

    // Determine user guidance message
    const getGuidanceMessage = () => {
        if (!hasSeats) {
            return 'Please select at least one available seat to proceed.';
        }
        if (!hasBoarding && !hasDropping) {
            return 'Please select both a Boarding Point and a Dropping Point.';
        }
        if (!hasBoarding) {
            return 'Please select a Boarding Point.';
        }
        if (!hasDropping) {
            return 'Please select a Dropping Point.';
        }
        if (!seatsAvailable) {
            return 'One or more selected seats are no longer available. Please select another seat.';
        }
        if (!hasValidFare) {
            return 'Invalid fare calculated for the selected seats.';
        }
        return '';
    };

    const guidanceMessage = validationError || getGuidanceMessage();

    const handleContinue = () => {
        if (!hasSeats) {
            setValidationError('Please select at least one available seat.');
            return;
        }
        if (!hasBoarding) {
            setValidationError('Please select a valid Boarding Point.');
            return;
        }
        if (!hasDropping) {
            setValidationError('Please select a valid Dropping Point.');
            return;
        }
        if (!seatsAvailable) {
            setValidationError('Selected seat is no longer available.');
            return;
        }

        const selectedBp = bus.boardingPoints?.find(bp => String(bp.id) === String(boardingPoint));
        const selectedDp = bus.droppingPoints?.find(dp => String(dp.id) === String(droppingPoint));

        const bookingData = {
            bus,
            route: bus.route,
            routeId: routeId || bus.route?.id,
            selectedSeats,
            boardingPoint: selectedBp,
            droppingPoint: selectedDp,
            totalFare,
            baseFare: totalFare,
            journeyDate: bus.route?.journey_date
        };
        
        // Pass data via state to existing passenger-details route
        navigate('/passenger-details', { state: { bookingData } });
    };

    if (!bus) return <div className="text-center py-20 text-lg font-semibold text-gray-600">Loading seat layout...</div>;

    return (
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
            {/* Seat Layout Area */}
            <div className="flex-1 bg-white p-8 rounded-xl shadow border border-gray-100">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                    <div>
                        <h2 className="text-2xl font-bold text-primary">Select Seats</h2>
                        <p className="text-sm text-gray-500 mt-0.5">{bus.name} • {bus.type}</p>
                    </div>
                    {bus.route && (
                        <div className="text-right text-xs text-gray-600">
                            <span className="font-bold text-gray-900">{bus.route.source} → {bus.route.destination}</span>
                            <div className="text-gray-500">{bus.route.journey_date}</div>
                        </div>
                    )}
                </div>
                
                <div className="flex justify-center mb-8 space-x-6 text-sm text-gray-600">
                    <div className="flex items-center"><div className="w-6 h-6 border-2 border-gray-300 rounded mr-2 bg-white"></div> Available</div>
                    <div className="flex items-center"><div className="w-6 h-6 border-2 border-blue-500 bg-blue-100 rounded mr-2"></div> Selected</div>
                    <div className="flex items-center"><div className="w-6 h-6 border-2 border-gray-400 bg-gray-200 rounded mr-2"></div> Booked</div>
                </div>

                <div className="max-w-xs mx-auto border-2 border-gray-200 rounded-2xl p-6 relative bg-gray-50/50">
                    <div className="absolute right-4 top-4 text-xs font-bold text-gray-400 bg-gray-200 px-2 py-0.5 rounded">DRIVER</div>
                    <div className="mt-12 grid grid-cols-4 gap-4 gap-x-8 justify-items-center">
                        {seats.map(seat => {
                            const isBooked = seat.status === 'BOOKED';
                            const isSelected = selectedSeats.some(s => s.id === seat.id);

                            let seatClass = "w-12 h-12 rounded flex items-center justify-center font-semibold border-2 transition select-none ";
                            if (isBooked) {
                                seatClass += "bg-gray-200 border-gray-400 text-gray-500 cursor-not-allowed";
                            } else if (isSelected) {
                                seatClass += "bg-blue-100 border-blue-500 text-blue-700 cursor-pointer shadow-sm scale-105";
                            } else {
                                seatClass += "bg-white border-gray-300 text-gray-700 hover:border-accent hover:text-accent cursor-pointer";
                            }

                            return (
                                <button
                                    type="button"
                                    key={seat.id} 
                                    className={seatClass}
                                    onClick={() => handleSeatClick(seat)}
                                    disabled={isBooked}
                                    aria-label={`Seat ${seat.seat_number} - ${seat.status}`}
                                    title={isBooked ? `Seat ${seat.seat_number} is already booked` : `Click to ${isSelected ? 'deselect' : 'select'} Seat ${seat.seat_number}`}
                                >
                                    {seat.seat_number}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Selection Summary Area */}
            <div className="w-full md:w-96 bg-white p-8 rounded-xl shadow border border-gray-100 h-fit">
                <h3 className="text-xl font-bold text-primary mb-4">Journey Details</h3>
                
                <div className="mb-6 space-y-4">
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label htmlFor="boarding-point-select" className="block text-sm font-bold text-gray-700">Boarding Point</label>
                            {hasSeats && !boardingPoint && (
                                <span className="text-xs text-amber-600 font-semibold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">Required</span>
                            )}
                        </div>
                        <select 
                            id="boarding-point-select"
                            className={`w-full rounded p-2.5 border transition ${
                                hasSeats && !boardingPoint 
                                    ? 'border-amber-400 bg-amber-50/40 ring-1 ring-amber-300' 
                                    : 'border-gray-300 focus:ring-accent focus:border-accent'
                            }`}
                            value={boardingPoint}
                            onChange={(e) => {
                                setBoardingPoint(e.target.value);
                                setValidationError('');
                            }}
                        >
                            <option value="">Select Boarding Point</option>
                            {bus.boardingPoints?.map(bp => (
                                <option key={bp.id} value={bp.id}>{bp.time?.substring(0,5)} - {bp.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label htmlFor="dropping-point-select" className="block text-sm font-bold text-gray-700">Dropping Point</label>
                            {hasSeats && !droppingPoint && (
                                <span className="text-xs text-amber-600 font-semibold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">Required</span>
                            )}
                        </div>
                        <select 
                            id="dropping-point-select"
                            className={`w-full rounded p-2.5 border transition ${
                                hasSeats && !droppingPoint 
                                    ? 'border-amber-400 bg-amber-50/40 ring-1 ring-amber-300' 
                                    : 'border-gray-300 focus:ring-accent focus:border-accent'
                            }`}
                            value={droppingPoint}
                            onChange={(e) => {
                                setDroppingPoint(e.target.value);
                                setValidationError('');
                            }}
                        >
                            <option value="">Select Dropping Point</option>
                            {bus.droppingPoints?.map(dp => (
                                <option key={dp.id} value={dp.id}>{dp.time?.substring(0,5)} - {dp.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                    <p className="text-gray-600 mb-2">
                        Selected Seats:{' '}
                        <span className="font-bold text-gray-900">
                            {selectedSeats.length > 0 ? selectedSeats.map(s => s.seat_number).join(', ') : 'None'}
                        </span>
                    </p>
                    <div className="flex justify-between items-end mt-4">
                        <div>
                            <p className="text-sm text-gray-500">Total Fare</p>
                            <p className="text-xs text-gray-400">₹{seatPrice} × {selectedSeats.length} seat(s)</p>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">₹{totalFare.toFixed(2)}</p>
                    </div>

                    {/* Clear validation message if incomplete */}
                    {guidanceMessage && (
                        <div className="mt-5 p-3 bg-amber-50 border border-amber-300 text-amber-900 text-sm rounded-lg flex items-start space-x-2">
                            <span className="text-amber-600 font-bold text-base leading-none">⚠️</span>
                            <span>{guidanceMessage}</span>
                        </div>
                    )}
                    
                    <button 
                        type="button"
                        onClick={handleContinue}
                        disabled={!isFormValid}
                        aria-disabled={!isFormValid}
                        title={!isFormValid ? guidanceMessage : 'Proceed to enter passenger details'}
                        className={`w-full font-bold py-3.5 px-4 rounded-lg transition mt-5 flex items-center justify-center space-x-2 shadow-sm ${
                            isFormValid
                                ? 'bg-accent hover:bg-orange-600 text-white cursor-pointer hover:shadow-md'
                                : 'bg-gray-200 text-gray-500 cursor-not-allowed border border-gray-300'
                        }`}
                    >
                        <span>Continue to Passenger Details</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SeatSelection;
