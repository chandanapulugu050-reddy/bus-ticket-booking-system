import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, Wallet, History, Heart, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useContext(AuthContext);

    if (!user) return <div className="text-center p-20 text-2xl font-bold">Please login to view your dashboard.</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 reveal">
            <h1 className="text-3xl font-black text-[#0B2046] mb-8">My Profile Dashboard</h1>
            
            <div className="grid md:grid-cols-4 gap-6">
                <div className="md:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
                    <div className="bg-blue-100 p-6 rounded-full text-blue-600 mb-4">
                        <User className="h-12 w-12" />
                    </div>
                    <h2 className="text-xl font-bold">{user.name}</h2>
                    <p className="text-gray-500">{user.email}</p>
                    <button className="mt-6 w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2 rounded-lg transition">Edit Profile</button>
                </div>

                <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Link to="/my-bookings" className="premium-card bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
                        <div className="bg-orange-100 p-4 rounded-xl text-orange-500 mr-4"><History className="h-8 w-8" /></div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">My Bookings</h3>
                            <p className="text-sm text-gray-500">View and manage your trips</p>
                        </div>
                    </Link>
                    
                    <div className="premium-card bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center cursor-pointer">
                        <div className="bg-green-100 p-4 rounded-xl text-green-500 mr-4"><Wallet className="h-8 w-8" /></div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">My Wallet</h3>
                            <p className="text-sm text-gray-500">Demo Balance: ₹500</p>
                        </div>
                    </div>

                    <Link to="/favorites" className="premium-card bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center cursor-pointer hover:shadow-md transition">
                        <div className="bg-red-100 p-4 rounded-xl text-red-500 mr-4"><Heart className="h-8 w-8" /></div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">Favorites</h3>
                            <p className="text-sm text-gray-500">View Wishlist</p>
                        </div>
                    </Link>

                    <div className="premium-card bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center cursor-pointer">
                        <div className="bg-yellow-100 p-4 rounded-xl text-yellow-500 mr-4"><Bell className="h-8 w-8" /></div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">Notifications</h3>
                            <p className="text-sm text-gray-500">0 Unread</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
