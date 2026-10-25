import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Heart, Bus, ArrowRight } from 'lucide-react';

const Favorites = () => {
    const { user, token } = useContext(AuthContext);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchFavorites = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/favorites', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setFavorites(res.data);
            } catch (err) {
                console.error("Error fetching favorites", err);
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, [user, token, navigate]);

    const removeFavorite = async (id, targetId) => {
        try {
            await axios.post('http://localhost:5000/api/favorites/toggle', {
                type: 'bus',
                target_id: targetId
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFavorites(favorites.filter(f => f.id !== id));
        } catch (err) {
            console.error("Error removing favorite", err);
        }
    };

    if (loading) return <div className="text-center py-20 text-xl font-bold">Loading your favorites...</div>;

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            <h1 className="text-3xl font-black text-[#0B2046] mb-8 flex items-center">
                <Heart className="mr-3 h-8 w-8 text-red-500 fill-red-500" /> My Wishlist
            </h1>

            {favorites.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-2xl shadow-sm border border-gray-100">
                    <Heart className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">No favorites yet</h2>
                    <p className="text-gray-500 mb-6">You haven't saved any buses to your wishlist.</p>
                    <button onClick={() => navigate('/')} className="bg-[#F97316] hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-lg transition">
                        Explore Buses
                    </button>
                </div>
            ) : (
                <div className="grid gap-6">
                    {favorites.map(bus => (
                        <div key={bus.favorite_id} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 flex flex-col md:flex-row justify-between items-center transition duration-300">
                            <div className="flex-1 w-full md:mb-0">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-[#0B2046] flex items-center gap-2">
                                            {bus.name || bus.target_name}
                                            <button onClick={() => removeFavorite(bus.favorite_id, bus.bus_id)} className="focus:outline-none ml-2">
                                                <Heart className="h-5 w-5 transition fill-red-500 text-red-500" />
                                            </button>
                                        </h3>
                                        <p className="text-sm text-gray-500 font-medium">{bus.type || 'Standard Bus'}</p>
                                    </div>
                                    <div className="flex items-center bg-green-50 px-2 py-1 rounded text-green-700 font-bold text-sm">
                                        ★ {bus.rating || '4.5'}
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-between md:justify-start md:space-x-8 mt-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <div className="text-center md:text-left">
                                        <p className="font-extrabold text-2xl text-gray-800">{bus.departure_time ? bus.departure_time.substring(0, 5) : '--:--'}</p>
                                        <p className="text-xs text-gray-500 font-semibold uppercase mt-1">{bus.source || 'Unknown'}</p>
                                    </div>
                                    <div className="flex-1 max-w-[100px] text-center">
                                        <div className="text-xs text-gray-400 mb-1">{bus.duration || '--'}</div>
                                        <div className="border-t-2 border-dashed border-gray-300 relative">
                                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-1 text-gray-300">
                                                &rarr;
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-center md:text-right">
                                        <p className="font-extrabold text-2xl text-gray-800">{bus.arrival_time ? bus.arrival_time.substring(0, 5) : '--:--'}</p>
                                        <p className="text-xs text-gray-500 font-semibold uppercase mt-1">{bus.destination || 'Unknown'}</p>
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
                                    <p className="text-3xl font-extrabold text-[#F97316] my-1">₹{bus.starting_price || '---'}</p>
                                </div>
                                {bus.route_id ? (
                                    <button 
                                        onClick={() => navigate(`/bus/${bus.bus_id}/seat-selection?route_id=${bus.route_id}`)}
                                        className="bg-[#0B2046] hover:bg-blue-900 text-white font-bold py-3 px-8 rounded-xl transition shadow-md hover:shadow-lg md:mt-6 w-full md:w-auto text-center"
                                    >
                                        Select Seats
                                    </button>
                                ) : (
                                    <button 
                                        onClick={() => navigate('/')}
                                        className="bg-[#F97316] hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-xl transition shadow-md hover:shadow-lg md:mt-6 w-full md:w-auto text-center"
                                    >
                                        Search Dates
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

export default Favorites;
