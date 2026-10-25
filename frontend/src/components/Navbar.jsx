import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Bus, Map, Tag, User, Heart, Shield } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="bg-[#0B2046] text-white py-4 shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-black tracking-tight text-white flex items-center hover:text-orange-400 transition">
                    <Bus className="mr-2 h-7 w-7 text-[#F97316]" />
                    BusBooker
                </Link>
                <div className="hidden md:flex space-x-6 items-center font-medium">
                    <Link to="/" className="hover:text-orange-400 transition">Home</Link>
                    <Link to="/about" className="hover:text-orange-400 transition">About Us</Link>
                    <Link to="/offers" className="hover:text-orange-400 transition flex items-center"><Tag className="mr-1 h-4 w-4" /> Offers</Link>
                    <Link to="/track" className="hover:text-orange-400 transition flex items-center"><Map className="mr-1 h-4 w-4" /> Track Bus</Link>
                    {user?.role === 'admin' && (
                        <Link to="/admin" className="text-orange-400 hover:text-white transition flex items-center bg-white/10 px-3 py-1 rounded-full"><Shield className="mr-1 h-4 w-4" /> Admin Dashboard</Link>
                    )}
                </div>
                <div className="flex items-center space-x-4">
                    {user ? (
                        <>
                            <Link to="/dashboard" className="hover:text-orange-400 transition flex items-center">
                                <User className="mr-1 h-5 w-5" /> Profile
                            </Link>
                            <button 
                                onClick={handleLogout}
                                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg font-bold transition shadow-sm"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="hover:text-orange-400 font-bold transition">User Login</Link>
                            <Link to="/admin/login" className="hover:text-orange-400 font-bold transition border-l border-white/20 pl-4 ml-4">Admin Login</Link>
                            <Link to="/register" className="bg-[#F97316] hover:bg-orange-600 text-white px-5 py-2 rounded-lg font-bold transition shadow-sm ml-4">
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
