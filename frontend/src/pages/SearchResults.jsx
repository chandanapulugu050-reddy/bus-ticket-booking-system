import React, { useEffect, useState, useContext } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Filter, ArrowLeft, Heart } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const source = searchParams.get('source');
    const destination = searchParams.get('destination');
    const date = searchParams.get('date');
    const navigate = useNavigate();

    const [buses, setBuses] = useState([]);
    const [filteredBuses, setFilteredBuses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [favorites, setFavorites] = useState([]);
    const { user, token } = useContext(AuthContext);

    // Filters and Sort State
    const [sortBy, setSortBy] = useState('departure_earliest');
    const [typeFilter, setTypeFilter] = useState('all');

    useEffect(() => {
        const fetchBuses = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/buses/search?source=${source}&destination=${destination}&date=${date}`);
                setBuses(res.data);
                setFilteredBuses(res.data);
                
                if (user && token) {
                    const favRes = await axios.get('http://localhost:5000/api/favorites', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setFavorites(favRes.data.map(f => f.target_id));
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Error fetching buses. Backend might be unavailable.');
            } finally {
                setLoading(false);
            }
        };
        fetchBuses();
    }, [source, destination, date, user, token]);

    const toggleFavorite = async (bus) => {
        if (!user) {
            navigate('/login');
            return;
        }
        try {
            const res = await axios.post('http://localhost:5000/api/favorites/toggle', {
                type: 'bus',
                target_id: bus.id,
                target_name: bus.name
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (res.data.action === 'added') {
                setFavorites([...favorites, bus.id]);
            } else {
                setFavorites(favorites.filter(id => id !== bus.id));
            }
        } catch (err) {
            console.error("Error toggling favorite", err);
        }
    };

    useEffect(() => {
        let result = [...buses];

        // Apply Filter
        if (typeFilter !== 'all') {
            if (typeFilter === 'ac') result = result.filter(b => b.type.includes('AC') && !b.type.includes('Non-AC'));
            if (typeFilter === 'non_ac') result = result.filter(b => b.type.includes('Non-AC'));
            if (typeFilter === 'sleeper') result = result.filter(b => b.type.includes('Sleeper'));
            if (typeFilter === 'seater') result = result.filter(b => b.type.includes('Seater') || b.type.includes('Coach'));
        }

        // Apply Sort
        result.sort((a, b) => {
            if (sortBy === 'price_low') return a.starting_price - b.starting_price;
            if (sortBy === 'price_high') return b.starting_price - a.starting_price;
            if (sortBy === 'departure_earliest') return a.departure_time.localeCompare(b.departure_time);
            if (sortBy === 'departure_latest') return b.departure_time.localeCompare(a.departure_time);
            return 0;
        });

        setFilteredBuses(result);
    }, [buses, sortBy, typeFilter]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#F97316]"></div>
            <p className="mt-4 text-xl text-gray-600 font-semibold">Searching for buses...</p>
        </div>
    );
    
    if (error) return (
        <div className="text-center py-20">
            <div className="text-red-500 text-6xl mb-4 text-center mx-auto w-fit">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
            <p className="text-gray-600">{error}</p>
            <Link to="/" className="text-[#F97316] font-bold mt-4 inline-block hover:underline">Go back home</Link>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <button onClick={() => navigate(-1)} className="flex items-center text-[#0B2046] hover:text-[#F97316] font-bold mb-6 transition">
                <ArrowLeft className="mr-2 h-5 w-5" /> Modify Search
            </button>

            <div className="bg-[#0B2046] text-white p-6 rounded-2xl shadow-md mb-8 flex flex-col md:flex-row md:items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold">{source} <span className="text-orange-400">→</span> {destination}</h1>
                    <p className="text-gray-300 mt-2 text-lg font-medium">{new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div className="mt-4 md:mt-0 bg-white/10 px-6 py-3 rounded-xl border border-white/20">
                    <p className="text-sm text-gray-300">Buses Found</p>
                    <p className="text-3xl font-bold text-orange-400">{filteredBuses.length}</p>
                </div>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Filters */}
                <div className="w-full lg:w-1/4">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                        <div className="flex items-center justify-between mb-6 border-b pb-4">
                            <h3 className="text-lg font-bold flex items-center text-gray-800"><Filter className="mr-2 h-5 w-5" /> Filters</h3>
                            <button onClick={() => { setSortBy('departure_earliest'); setTypeFilter('all'); }} className="text-sm text-[#F97316] hover:underline font-semibold">Clear All</button>
                        </div>
                        
                        <div className="mb-6">
                            <h4 className="font-semibold text-gray-700 mb-3 uppercase text-sm tracking-wider">Sort By</h4>
                            <select 
                                value={sortBy} 
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-[#F97316] focus:ring focus:ring-orange-200 focus:ring-opacity-50 py-2.5 px-3 bg-gray-50 border"
                            >
                                <option value="departure_earliest">Departure: Earliest First</option>
                                <option value="departure_latest">Departure: Latest First</option>
                                <option value="price_low">Price: Low to High</option>
                                <option value="price_high">Price: High to Low</option>
                            </select>
                        </div>

                        <div>
                            <h4 className="font-semibold text-gray-700 mb-3 uppercase text-sm tracking-wider">Bus Type</h4>
                            <div className="space-y-3">
                                {['all', 'ac', 'non_ac', 'sleeper', 'seater'].map(type => (
                                    <label key={type} className="flex items-center cursor-pointer group">
                                        <input 
                                            type="radio" 
                                            name="busType"
                                            value={type}
                                            checked={typeFilter === type}
                                            onChange={(e) => setTypeFilter(e.target.value)}
                                            className="text-[#F97316] focus:ring-[#F97316] h-4 w-4 border-gray-300 cursor-pointer"
                                        />
                                        <span className="ml-3 text-gray-600 group-hover:text-gray-900 transition capitalize">
                                            {type === 'non_ac' ? 'Non-AC' : type === 'ac' ? 'AC Only' : type}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results */}
                <div className="w-full lg:w-3/4 space-y-5">
                    {filteredBuses.length === 0 ? (
                        <div className="bg-white p-12 text-center rounded-2xl shadow-sm border border-gray-100">
                            <div className="text-gray-300 mb-4 flex justify-center"><Filter className="h-16 w-16" /></div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">No buses available</h2>
                            <p className="text-gray-500 text-lg">We couldn't find any buses for this route and date with the selected filters.</p>
                            <button onClick={() => { setSortBy('departure_earliest'); setTypeFilter('all'); }} className="mt-6 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-lg transition">Clear Filters</button>
                        </div>
                    ) : (
                        filteredBuses.map(bus => (
                            <div key={bus.id} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 flex flex-col md:flex-row justify-between items-center transition duration-300">
                                <div className="flex-1 w-full md:mb-0">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-[#0B2046] flex items-center gap-2">
                                                {bus.name}
                                                <button onClick={() => toggleFavorite(bus)} className="focus:outline-none ml-2">
                                                    <Heart className={`h-5 w-5 transition ${favorites.includes(bus.id) ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-500'}`} />
                                                </button>
                                            </h3>
                                            <p className="text-sm text-gray-500 font-medium">{bus.type}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between md:justify-start md:space-x-8 mt-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <div className="text-center md:text-left">
                                            <p className="font-extrabold text-2xl text-gray-800">{bus.departure_time.substring(0, 5)}</p>
                                            <p className="text-xs text-gray-500 font-semibold uppercase mt-1">{source}</p>
                                        </div>
                                        <div className="flex-1 max-w-[100px] text-center">
                                            <div className="text-xs text-gray-400 mb-1">{bus.duration}</div>
                                            <div className="border-t-2 border-dashed border-gray-300 relative">
                                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-1 text-gray-300">
                                                    &rarr;
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-center md:text-right">
                                            <p className="font-extrabold text-2xl text-gray-800">{bus.arrival_time.substring(0, 5)}</p>
                                            <p className="text-xs text-gray-500 font-semibold uppercase mt-1">{destination}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4 flex gap-2 flex-wrap">
                                        {bus.amenities && bus.amenities.split(',').map((amenity, i) => (
                                            <span key={i} className="text-xs font-medium bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md border border-blue-100">
                                                {amenity.trim()}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                
                                <div className="md:ml-6 mt-6 md:mt-0 flex flex-row md:flex-col justify-between md:justify-center items-center md:items-end w-full md:w-auto border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 pl-0 md:pl-8">
                                    <div className="text-left md:text-right">
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">Starting from</p>
                                        <p className="text-3xl font-extrabold text-[#F97316] my-1">₹{bus.starting_price}</p>
                                        <p className="text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded inline-block">{bus.available_seats} Seats Left</p>
                                    </div>
                                    <button 
                                        onClick={() => navigate(`/bus/${bus.id}/seat-selection?route_id=${bus.route_id}`)}
                                        className="bg-[#0B2046] hover:bg-blue-900 text-white font-bold py-3 px-8 rounded-xl transition shadow-md hover:shadow-lg md:mt-6 w-full md:w-auto text-center"
                                    >
                                        Select Seats
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchResults;
