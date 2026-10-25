import React from 'react';
import { Link } from 'react-router-dom';
import { Bus, Mail } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-[#0B2046] text-white pt-16 pb-8 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-12">
                {/* Brand */}
                <div className="space-y-4">
                    <Link to="/" className="text-2xl font-black tracking-tight text-white flex items-center hover:text-orange-400 transition">
                        <Bus className="mr-2 h-7 w-7 text-[#F97316]" />
                        BusBooker
                    </Link>
                    <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                        Making bus travel simple, reliable, and convenient. Search, book, and manage your tickets all in one place.
                    </p>
                    <div className="flex space-x-4 pt-2">
                        <a href="#" className="text-gray-400 hover:text-white transition">FB</a>
                        <a href="#" className="text-gray-400 hover:text-white transition">TW</a>
                        <a href="#" className="text-gray-400 hover:text-white transition">IG</a>
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-lg font-bold mb-4 text-white">Quick Links</h3>
                    <ul className="space-y-3 text-sm text-gray-400">
                        <li><Link to="/" className="hover:text-[#F97316] transition">Home</Link></li>
                        <li><Link to="/about" className="hover:text-[#F97316] transition">About Us</Link></li>
                        <li><Link to="/offers" className="hover:text-[#F97316] transition">Offers</Link></li>
                    </ul>
                </div>

                {/* Account */}
                <div>
                    <h3 className="text-lg font-bold mb-4 text-white">Account</h3>
                    <ul className="space-y-3 text-sm text-gray-400">
                        <li><Link to="/login" className="hover:text-[#F97316] transition">Login</Link></li>
                        <li><Link to="/register" className="hover:text-[#F97316] transition">Register</Link></li>
                        <li><Link to="/dashboard" className="hover:text-[#F97316] transition">My Dashboard</Link></li>
                    </ul>
                </div>

                {/* Support (Contact/Help conceptual) */}
                <div>
                    <h3 className="text-lg font-bold mb-4 text-white">Support</h3>
                    <ul className="space-y-3 text-sm text-gray-400">
                        <li className="flex items-center"><Mail className="mr-2 h-4 w-4" /> support@busbooker.com</li>
                        <li><span className="hover:text-[#F97316] transition cursor-pointer">Help Center</span></li>
                        <li><span className="hover:text-[#F97316] transition cursor-pointer">Terms & Conditions</span></li>
                        <li><span className="hover:text-[#F97316] transition cursor-pointer">Privacy Policy</span></li>
                    </ul>
                </div>
            </div>
            
            <div className="max-w-7xl mx-auto px-4 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
                &copy; {new Date().getFullYear()} BusBooker. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
