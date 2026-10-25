import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Bus, ArrowRightLeft } from 'lucide-react';
import { destinationImages } from '../utils/destinations';

const CITIES = [
    'Chirala', 'Vetapalem', 'Bapatla', 'Vijayawada', 'Hyderabad', 
    'Bangalore', 'Chennai', 'Nellore', 'Ongole', 'Guntur', 'Tirupati', 'Visakhapatnam'
];

const Autocomplete = ({ label, value, onChange, placeholder, exclude }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(value);
    const wrapperRef = useRef(null);

    useEffect(() => {
        setSearchTerm(value);
    }, [value]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const filtered = CITIES.filter(c => 
        c.toLowerCase().includes(searchTerm.toLowerCase()) && c !== exclude
    );

    return (
        <div className="flex-1 w-full relative" ref={wrapperRef}>
            <label className="block text-gray-500 text-xs font-bold mb-1 uppercase tracking-wide px-1 text-left">{label}</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    className="w-full border border-gray-300 rounded-xl py-3 pl-10 pr-3 text-gray-900 font-semibold focus:ring-2 focus:ring-[#F97316] focus:border-[#F97316] outline-none transition"
                    placeholder={placeholder} required
                />
            </div>
            {isOpen && filtered.length > 0 && (
                <ul className="absolute z-50 w-full bg-white border border-gray-200 mt-1 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                    {filtered.map(city => (
                        <li 
                            key={city} 
                            onClick={() => {
                                onChange(city);
                                setSearchTerm(city);
                                setIsOpen(false);
                            }}
                            className="px-4 py-2 hover:bg-orange-50 cursor-pointer font-medium text-gray-700"
                        >
                            {city}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

const Landing = () => {
    const [source, setSource] = useState('Chirala');
    const [destination, setDestination] = useState('Hyderabad');
    const [date, setDate] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showAllRoutes, setShowAllRoutes] = useState(false);
    const navigate = useNavigate();
    
    // Get today's date in YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        // Set date to tomorrow by default
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setDate(tomorrow.toISOString().split('T')[0]);
    }, []);

    const handleSwap = () => {
        setSource(destination);
        setDestination(source);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setError('');
        
        if (!source || !destination) {
            setError('Please select both source and destination.');
            return;
        }
        if (source === destination) {
            setError('Source and destination cannot be the same.');
            return;
        }
        if (!date || date < today) {
            setError('Please select a valid future journey date.');
            return;
        }
        
        setLoading(true);
        // Simulate a tiny delay for UX
        setTimeout(() => {
            navigate(`/search-results?source=${source}&destination=${destination}&date=${date}`);
        }, 500);
    };

    const popularRoutesData = [
        { from: 'Chirala', to: 'Hyderabad', duration: '7h 30m', price: 650, img: destinationImages['Hyderabad'], buses: '6 Buses' },
        { from: 'Chirala', to: 'Vijayawada', duration: '2h 30m', price: 450, img: destinationImages['Vijayawada'], buses: '4 Buses' },
        { from: 'Chirala', to: 'Bangalore', duration: '11h 00m', price: 1250, img: destinationImages['Bangalore'], buses: '3 Buses' },
        { from: 'Chirala', to: 'Chennai', duration: '6h 00m', price: 550, img: destinationImages['Chennai'], buses: '5 Buses' },
        { from: 'Hyderabad', to: 'Vijayawada', duration: '5h 30m', price: 500, img: destinationImages['Vijayawada'], buses: '5 Buses' },
        { from: 'Hyderabad', to: 'Bangalore', duration: '9h 30m', price: 950, img: destinationImages['Bangalore'], buses: '6 Buses' },
        { from: 'Hyderabad', to: 'Chennai', duration: '12h 00m', price: 1100, img: destinationImages['Chennai'], buses: '4 Buses' },
        { from: 'Hyderabad', to: 'Visakhapatnam', duration: '13h 00m', price: 1250, img: destinationImages['Visakhapatnam'], buses: '5 Buses' },
        { from: 'Vijayawada', to: 'Bangalore', duration: '12h 30m', price: 1399, img: destinationImages['Bangalore'], buses: '3 Buses' },
        { from: 'Vijayawada', to: 'Chennai', duration: '8h 00m', price: 850, img: destinationImages['Chennai'], buses: '4 Buses' },
        { from: 'Bangalore', to: 'Chennai', duration: '6h 30m', price: 800, img: destinationImages['Chennai'], buses: '6 Buses' },
        { from: 'Bangalore', to: 'Tirupati', duration: '5h 00m', price: 550, img: destinationImages['Tirupati'], buses: '5 Buses' },
        { from: 'Chennai', to: 'Tirupati', duration: '3h 30m', price: 400, img: destinationImages['Tirupati'], buses: '4 Buses' },
        { from: 'Nellore', to: 'Bangalore', duration: '7h 00m', price: 750, img: destinationImages['Bangalore'], buses: '3 Buses' },
        { from: 'Chirala', to: 'Visakhapatnam', duration: '8h 30m', price: 950, img: destinationImages['Visakhapatnam'], buses: '4 Buses' },
        { from: 'Chirala', to: 'Tirupati', duration: '5h 30m', price: 550, img: destinationImages['Tirupati'], buses: '4 Buses' },
        { from: 'Chirala', to: 'Nellore', duration: '4h 30m', price: 400, img: destinationImages['Nellore'], buses: '5 Buses' },
        { from: 'Chirala', to: 'Ongole', duration: '1h 30m', price: 200, img: destinationImages['Ongole'], buses: '6 Buses' },
        { from: 'Nellore', to: 'Hyderabad', duration: '9h 00m', price: 899, img: destinationImages['Hyderabad'], buses: '4 Buses' },
        { from: 'Ongole', to: 'Hyderabad', duration: '7h 00m', price: 649, img: destinationImages['Hyderabad'], buses: '5 Buses' }
    ];

    const displayedRoutes = showAllRoutes ? popularRoutesData : popularRoutesData.slice(0, 16);

    const handleRouteClick = (sourceVal, destinationVal) => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dateStr = tomorrow.toISOString().split('T')[0];
        setSource(sourceVal);
        setDestination(destinationVal);
        setDate(dateStr);
        setLoading(true);
        setTimeout(() => {
            navigate(`/search-results?source=${sourceVal}&destination=${destinationVal}&date=${dateStr}`);
        }, 500);
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="relative w-full h-[550px] flex items-center justify-center">
                <div 
                    className="absolute inset-0 w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80')" }}
                >
                    <div className="absolute inset-0 bg-black/70"></div>
                </div>
                
                <div className="relative z-10 text-center px-4 max-w-5xl w-full mt-10">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-lg tracking-tight">
                        Book Your Journey With Confidence
                    </h1>
                    <p className="text-lg md:text-xl text-gray-200 mb-10 drop-shadow font-medium max-w-2xl mx-auto">
                        Search across 100+ routes, choose your favorite seat, and get instant ticket confirmation.
                    </p>

                    {error && (
                        <div className="bg-red-500/90 text-white font-bold px-4 py-2 rounded-lg mb-6 inline-block">
                            {error}
                        </div>
                    )}

                    {/* Search Card */}
                    <form onSubmit={handleSearch} className="bg-white rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row gap-4 items-center">
                        <Autocomplete 
                            label="From" 
                            value={source} 
                            onChange={setSource} 
                            placeholder="Leaving from..."
                            exclude={destination}
                        />

                        <button 
                            type="button" 
                            onClick={handleSwap}
                            className="bg-gray-100 p-3 rounded-full hover:bg-gray-200 transition mt-4 md:mt-5 shrink-0 shadow-sm"
                            title="Swap"
                        >
                            <ArrowRightLeft className="h-5 w-5 text-gray-600" />
                        </button>

                        <Autocomplete 
                            label="To" 
                            value={destination} 
                            onChange={setDestination} 
                            placeholder="Going to..."
                            exclude={source}
                        />

                        <div className="flex-1 w-full relative">
                            <label className="block text-gray-500 text-xs font-bold mb-1 uppercase tracking-wide px-1 text-left">Journey Date</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Calendar className="h-5 w-5 text-gray-400" />
                                </div>
                                <input 
                                    type="date" 
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    min={today}
                                    className="w-full border border-gray-300 rounded-xl py-3 pl-10 pr-3 text-gray-900 font-semibold focus:ring-2 focus:ring-[#F97316] focus:border-[#F97316] outline-none transition"
                                    required
                                />
                            </div>
                        </div>

                        <div className="w-full md:w-auto self-end mt-4 md:mt-0">
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="bg-[#F97316] hover:bg-[#ea580c] disabled:bg-orange-300 text-white font-bold py-3 px-8 rounded-xl w-full flex items-center justify-center transition shadow-lg hover:shadow-xl text-lg h-[50px] mt-1 whitespace-nowrap"
                            >
                                {loading ? 'Searching...' : <><Search className="mr-2 h-5 w-5" /> Search Buses</>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Popular Routes Section */}
            <div className="max-w-7xl mx-auto px-4 py-16 w-full">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Popular Routes</h2>
                    {popularRoutesData.length > 12 && (
                        <button 
                            onClick={() => setShowAllRoutes(!showAllRoutes)}
                            className="text-[#F97316] font-bold hover:text-orange-700 transition-colors"
                        >
                            {showAllRoutes ? 'View Less' : 'View All Routes'}
                        </button>
                    )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {displayedRoutes.map((route, idx) => (
                        <div key={idx} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group cursor-pointer flex flex-col" onClick={() => handleRouteClick(route.from, route.to)}>
                            <div className="h-32 w-full overflow-hidden relative">
                                <img 
                                    src={route.img} 
                                    alt={`${route.from} to ${route.to}`} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                    onError={(e) => { e.target.onerror = null; e.target.src = destinationImages['Default']; }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <span className="absolute bottom-3 right-3 text-xs font-bold text-white bg-[#F97316] px-3 py-1 rounded-full shadow-lg">
                                    From ₹{route.price}
                                </span>
                            </div>
                            <div className="p-5 flex-1 flex flex-col">
                                <div className="flex items-center justify-between text-gray-900 font-bold text-lg mb-2">
                                    <span>{route.from}</span>
                                    <span className="text-gray-300 mx-2">→</span>
                                    <span>{route.to}</span>
                                </div>
                                <div className="flex justify-between items-center mt-auto pt-4">
                                    <span className="text-sm font-medium text-gray-500 flex items-center"><Bus className="w-4 h-4 mr-1"/> {route.buses} Available</span>
                                    <span className="text-sm font-bold text-[#0B2046] group-hover:text-[#F97316] transition-colors">Book Now &rsaquo;</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Landing;
