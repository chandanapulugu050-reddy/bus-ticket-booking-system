import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ShieldCheck, UserCheck, AlertCircle, LogIn } from 'lucide-react';

const BookingSummary = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, token, login } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [authLoading, setAuthLoading] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [loginEmail, setLoginEmail] = useState('demo@example.com');
    const [loginPassword, setLoginPassword] = useState('Demo@123');
    const [loginError, setLoginError] = useState('');
    
    // Coupon state
    const [couponCode, setCouponCode] = useState(localStorage.getItem('saved_coupon') || 'WELCOME100');
    const [couponLoading, setCouponLoading] = useState(false);
    const [couponError, setCouponError] = useState('');
    const [appliedDiscount, setAppliedDiscount] = useState(100);

    useEffect(() => {
        // Auto-apply saved or default coupon if any
        if (couponCode && appliedDiscount === 0) {
            handleApplyCoupon();
        }
        // eslint-disable-next-line
    }, []);

    if (!location.state || !location.state.bookingData) {
        return <Navigate to="/" replace />;
    }

    const { bookingData } = location.state;
    const { bus, selectedSeats, boardingPoint, droppingPoint, passengers } = bookingData;
    
    const baseFare = selectedSeats.length * parseFloat(bus.route.starting_price);
    const taxes = baseFare * 0.05; // 5% tax
    const totalFareBeforeDiscount = baseFare + taxes;
    const totalFare = Math.max(0, totalFareBeforeDiscount - appliedDiscount);

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) {
            setCouponError('Please enter a coupon code.');
            return;
        }
        setCouponLoading(true);
        setCouponError('');
        try {
            const res = await axios.post('http://localhost:5000/api/features/coupons/validate', {
                code: couponCode.trim(),
                amount: baseFare
            });
            if (res.data.valid) {
                setAppliedDiscount(res.data.discount);
                setCouponError('');
            } else {
                setCouponError(res.data.message || 'Invalid coupon');
                setAppliedDiscount(0);
            }
        } catch (err) {
            setCouponError(err.response?.data?.message || 'Invalid or expired coupon');
            setAppliedDiscount(0);
        } finally {
            setCouponLoading(false);
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedDiscount(0);
        setCouponCode('');
        setCouponError('');
        localStorage.removeItem('saved_coupon');
    };

    const handleQuickLogin = async () => {
        setAuthLoading(true);
        setLoginError('');
        try {
            await login('demo@example.com', 'Demo@123');
            setError('');
            setShowLoginModal(false);
        } catch (err) {
            setLoginError('Quick login failed: ' + (err.response?.data?.message || err.message));
        } finally {
            setAuthLoading(false);
        }
    };

    const handleCustomLogin = async (e) => {
        e.preventDefault();
        setAuthLoading(true);
        setLoginError('');
        try {
            await login(loginEmail, loginPassword);
            setError('');
            setShowLoginModal(false);
        } catch (err) {
            setLoginError(err.response?.data?.message || 'Login failed. Please check credentials.');
        } finally {
            setAuthLoading(false);
        }
    };

    const handleConfirm = async () => {
        setError('');
        let currentToken = token || localStorage.getItem('token');
        
        // If not logged in or invalid token string, prompt user or auto-login with Demo account
        if (!currentToken || currentToken === 'null' || currentToken === 'undefined') {
            try {
                setAuthLoading(true);
                const res = await axios.post('http://localhost:5000/api/auth/login', {
                    email: 'demo@example.com',
                    password: 'Demo@123'
                });
                currentToken = res.data.token;
                localStorage.setItem('token', currentToken);
                if (login) {
                    await login('demo@example.com', 'Demo@123');
                }
            } catch (authErr) {
                setShowLoginModal(true);
                setError('Please log in with your account or demo account to confirm your booking.');
                setAuthLoading(false);
                return;
            } finally {
                setAuthLoading(false);
            }
        }

        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/bookings', {
                busId: bus.id,
                routeId: bus.route.id,
                journeyDate: bus.route.journey_date,
                boardingPointId: boardingPoint.id,
                droppingPointId: droppingPoint.id,
                seatIds: selectedSeats.map(s => s.id),
                passengers: passengers,
                discount: appliedDiscount,
                couponCode: appliedDiscount > 0 ? couponCode : null,
                paymentMethod: 'Simulated Card Payment'
            }, {
                headers: { Authorization: `Bearer ${currentToken}` }
            });

            // Redirect to confirmation page with PNR
            navigate(`/ticket-confirmation/${res.data.pnr}`);
        } catch (err) {
            const errorMsg = err.response?.data?.message;
            if (errorMsg === 'Token is not valid' || errorMsg === 'Session expired. Please log in again.' || errorMsg === 'No token, authorization denied') {
                localStorage.removeItem('token');
                setError('Authentication required. Please click "Quick Login" below to continue.');
                setShowLoginModal(true);
            } else {
                setError(errorMsg || 'Error creating booking. Please try again.');
            }
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
            <div className="flex-1 space-y-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-primary">Review Booking</h2>
                    {user ? (
                        <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
                            <UserCheck className="w-4 h-4" />
                            <span>Logged in as <b>{user.name}</b></span>
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowLoginModal(true)}
                            className="flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-full transition"
                        >
                            <LogIn className="w-3.5 h-3.5" />
                            Sign In / Guest
                        </button>
                    )}
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start justify-between gap-3 shadow-sm">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500" />
                            <p className="text-sm font-medium">{error}</p>
                        </div>
                        <button
                            onClick={handleQuickLogin}
                            disabled={authLoading}
                            className="text-xs bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded-lg whitespace-nowrap shadow transition"
                        >
                            {authLoading ? 'Signing In...' : 'Quick Demo Login'}
                        </button>
                    </div>
                )}


                <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
                    <h3 className="font-bold text-lg mb-4 text-gray-800 border-b pb-2">Journey Details</h3>
                    <div className="flex justify-between text-sm">
                        <div>
                            <p className="text-gray-500">From</p>
                            <p className="font-bold text-lg">{bus.route.source}</p>
                            <p className="text-gray-700 mt-2">{boardingPoint.name}</p>
                            <p className="text-xs text-gray-500">{boardingPoint.time.substring(0,5)}</p>
                        </div>
                        <div className="text-center pt-2">
                            <p className="text-gray-400">----- {bus.route.duration} -----</p>
                            <p className="font-semibold text-gray-800 mt-2">{new Date(bus.route.journey_date).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-gray-500">To</p>
                            <p className="font-bold text-lg">{bus.route.destination}</p>
                            <p className="text-gray-700 mt-2">{droppingPoint.name}</p>
                            <p className="text-xs text-gray-500">{droppingPoint.time.substring(0,5)}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
                    <h3 className="font-bold text-lg mb-4 text-gray-800 border-b pb-2">Passenger Details</h3>
                    {passengers.map((p, idx) => (
                        <div key={idx} className="flex justify-between items-center py-2 border-b last:border-0 border-gray-100">
                            <div>
                                <p className="font-semibold">{p.name} <span className="text-gray-500 text-sm font-normal">({p.age} yrs, {p.gender})</span></p>
                            </div>
                            <div className="text-right font-bold text-primary">
                                Seat: {selectedSeats[idx].seat_number}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="w-full md:w-80">
                <div className="bg-white p-6 rounded-xl shadow border border-gray-100 sticky top-4">
                    <h3 className="font-bold text-lg mb-4 text-gray-800 border-b pb-2">Fare Details</h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Base Fare ({selectedSeats.length} seats)</span>
                            <span className="font-semibold">₹{baseFare.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Taxes & Fees</span>
                            <span className="font-semibold">₹{taxes.toFixed(2)}</span>
                        </div>
                        
                        {appliedDiscount > 0 && (
                            <div className="flex justify-between text-green-600 font-bold">
                                <span>Discount Applied</span>
                                <span>- ₹{appliedDiscount.toFixed(2)}</span>
                            </div>
                        )}
                        
                        <div className="flex justify-between pt-3 border-t border-gray-200 mt-3 font-bold text-lg">
                            <span>Total</span>
                            <span className="text-primary">₹{totalFare.toFixed(2)}</span>
                        </div>
                    </div>
                    
                    {/* Offers & Coupons Section */}
                    <div className="mt-6 border-t pt-4">
                        <h4 className="font-bold text-sm text-gray-800 mb-2">Apply Coupon</h4>
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                disabled={appliedDiscount > 0}
                                placeholder="Enter Code" 
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-accent focus:border-accent"
                            />
                            {appliedDiscount > 0 ? (
                                <button onClick={handleRemoveCoupon} className="bg-red-100 text-red-600 px-3 py-2 rounded-lg text-sm font-bold hover:bg-red-200">Remove</button>
                            ) : (
                                <button 
                                    onClick={handleApplyCoupon} 
                                    disabled={couponLoading || !couponCode}
                                    className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-black disabled:opacity-50"
                                >
                                    Apply
                                </button>
                            )}
                        </div>
                        {couponError && <p className="text-red-500 text-xs mt-2">{couponError}</p>}
                    </div>

                    <div className="mt-8">
                        <p className="text-xs text-center text-gray-500 mb-4">By clicking confirm, you agree to our terms and conditions. Payment is simulated for this demo.</p>
                        <button 
                            onClick={handleConfirm}
                            disabled={loading}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition shadow-lg disabled:opacity-50"
                        >
                            {loading ? 'Processing...' : 'Pay & Confirm Ticket'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Sign In / Demo Modal */}
            {showLoginModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100">
                        <div className="flex justify-between items-center mb-4 pb-2 border-b">
                            <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-primary" />
                                Passenger Authentication
                            </h3>
                            <button onClick={() => setShowLoginModal(false)} className="text-gray-400 hover:text-gray-600 font-bold text-xl">&times;</button>
                        </div>

                        {loginError && <div className="bg-red-50 text-red-600 text-xs p-3 rounded-lg mb-4">{loginError}</div>}

                        <p className="text-sm text-gray-600 mb-4">
                            You can log in with the 1-click Demo Account or use your registered email to confirm this booking.
                        </p>

                        <button
                            onClick={handleQuickLogin}
                            disabled={authLoading}
                            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-2.5 rounded-xl shadow mb-4 flex items-center justify-center gap-2 transition"
                        >
                            <UserCheck className="w-4 h-4" />
                            {authLoading ? 'Signing In...' : '1-Click Demo Login (demo@example.com)'}
                        </button>

                        <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-400">Or use your account</span></div>
                        </div>

                        <form onSubmit={handleCustomLogin} className="space-y-3">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={loginEmail}
                                    onChange={(e) => setLoginEmail(e.target.value)}
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-primary focus:border-primary"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
                                <input
                                    type="password"
                                    value={loginPassword}
                                    onChange={(e) => setLoginPassword(e.target.value)}
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-primary focus:border-primary"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={authLoading}
                                className="w-full bg-gray-900 hover:bg-black text-white font-semibold py-2 rounded-xl text-sm transition"
                            >
                                {authLoading ? 'Logging In...' : 'Log In'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingSummary;
