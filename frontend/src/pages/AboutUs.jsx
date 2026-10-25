import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, CheckCircle, Bus, Ticket, ShieldCheck, Smartphone, Settings, Clock, User, ArrowRight } from 'lucide-react';

const AboutUs = () => {
    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
            {/* HERO SECTION */}
            <div className="relative w-full h-[450px] md:h-[550px] flex items-center justify-center overflow-hidden">
                <div 
                    className="absolute inset-0 w-full h-full bg-cover bg-center transform hover:scale-105 transition-transform duration-[20s]"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&q=80')" }}
                >
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent"></div>
                </div>
                
                <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 text-left animate-fade-in-up">
                    <div className="max-w-2xl">
                        <h1 className="text-5xl md:text-6xl font-black text-white mb-6 drop-shadow-xl tracking-tight leading-tight">
                            About Us
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-200 mb-8 drop-shadow-md font-medium leading-relaxed">
                            Making bus travel simple, reliable, and convenient.
                        </p>
                        <Link to="/" className="inline-flex items-center bg-[#F97316] hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full transition-all shadow-lg hover:shadow-orange-500/30 hover:-translate-y-1 group text-lg">
                            Search Buses 
                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24 space-y-24 w-full">
                
                {/* WHO WE ARE & OUR MISSION */}
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="space-y-6">
                        <div className="inline-block bg-orange-100 text-[#F97316] px-4 py-1.5 rounded-full font-bold text-sm tracking-wide uppercase">
                            Who We Are
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-[#0B2046] leading-tight">
                            Your trusted companion for road journeys.
                        </h2>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            Our platform is designed to make bus ticket booking simple and convenient from start to finish. We provide a secure booking experience where you can easily search for buses, select your preferred boarding and dropping points, choose your favorite seats, and access digital tickets.
                        </p>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            Whether you are commuting for business or planning a holiday, we give you the tools to manage your bookings effortlessly in one place.
                        </p>
                    </div>
                    
                    <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 relative overflow-hidden group hover:shadow-2xl transition-shadow duration-500">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-full -z-0 opacity-50 group-hover:scale-110 transition-transform"></div>
                        <div className="relative z-10">
                            <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mb-8">
                                <Bus className="h-8 w-8 text-[#F97316]" />
                            </div>
                            <h3 className="text-2xl font-bold text-[#0B2046] mb-4">Our Mission</h3>
                            <p className="text-lg text-gray-600 leading-relaxed italic">
                                "Our mission is to make bus travel easier by bringing bus search, seat selection, booking, digital tickets, and trip management into one simple platform."
                            </p>
                        </div>
                    </div>
                </div>

                {/* HOW IT WORKS */}
                <div className="py-12 border-t border-b border-gray-200">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#0B2046] mb-4">How It Works</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">Book your next journey in four simple steps.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                        {/* Connecting Line */}
                        <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-orange-200 -translate-y-1/2 z-0"></div>
                        
                        {[
                            { step: 1, title: 'Search', desc: 'Enter your source, destination, and travel date.', icon: Search },
                            { step: 2, title: 'Choose Your Bus', desc: 'Compare available buses and select the one you prefer.', icon: Bus },
                            { step: 3, title: 'Select Your Seat', desc: 'Choose an available seat and provide passenger details.', icon: User },
                            { step: 4, title: 'Confirm Booking', desc: 'Complete the booking process and receive your digital ticket.', icon: Ticket },
                        ].map((item, idx) => (
                            <div key={idx} className="relative z-10 bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-center hover:-translate-y-2 transition-transform duration-300">
                                <div className="w-16 h-16 bg-[#F97316] rounded-full flex items-center justify-center mx-auto mb-6 text-white shadow-md border-4 border-white">
                                    <item.icon className="h-8 w-8" />
                                </div>
                                <h4 className="text-xl font-bold text-[#0B2046] mb-2">{item.step}. {item.title}</h4>
                                <p className="text-gray-600">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* WHAT WE OFFER */}
                <div>
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#0B2046] mb-4">What We Offer</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">Everything you need for a comfortable journey.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { title: 'Easy Bus Search', desc: 'Find buses based on route and travel date.', icon: Search },
                            { title: 'Simple Seat Selection', desc: 'Choose available seats before confirming your booking.', icon: CheckCircle },
                            { title: 'Flexible Travel Options', desc: 'View different buses, timings, boarding points, and dropping points.', icon: Clock },
                            { title: 'Digital Tickets', desc: 'Access your booking details and ticket information digitally.', icon: Ticket },
                            { title: 'Easy Booking Management', desc: 'View and manage your bookings directly from your account.', icon: Settings },
                            { title: 'Responsive Experience', desc: 'Use the platform comfortably across desktop, tablet, and mobile.', icon: Smartphone },
                        ].map((feature, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl hover:border-orange-200 transition-all duration-300 group">
                                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#F97316] transition-colors">
                                    <feature.icon className="h-6 w-6 text-[#F97316] group-hover:text-white transition-colors" />
                                </div>
                                <h4 className="text-xl font-bold text-[#0B2046] mb-3">{feature.title}</h4>
                                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* WHY CHOOSE US & STATS */}
                <div className="bg-[#0B2046] rounded-3xl p-8 md:p-16 text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-900 rounded-full blur-3xl opacity-50"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-600 rounded-full blur-3xl opacity-20"></div>
                    
                    <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Why Choose Us</h2>
                            <p className="text-blue-200 text-lg mb-8 leading-relaxed">
                                We focus on delivering a seamless digital experience, ensuring your journey begins long before you board the bus.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    'Simple Booking Experience',
                                    'Clear Travel Information',
                                    'Convenient Seat Selection',
                                    'Digital Ticket Access',
                                    'Easy Booking Management',
                                    'Responsive Design'
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center space-x-3 bg-white/10 p-3 rounded-lg backdrop-blur-sm border border-white/5 hover:bg-white/20 transition-colors">
                                        <ShieldCheck className="h-5 w-5 text-orange-400 shrink-0" />
                                        <span className="font-medium text-blue-50">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            {[
                                { label: 'Simple', sub: 'To Use' },
                                { label: 'Fast', sub: 'Search' },
                                { label: 'Convenient', sub: 'Booking' },
                                { label: 'User Friendly', sub: 'Interface' },
                            ].map((stat, idx) => (
                                <div key={idx} className="bg-white/5 border border-white/10 p-6 rounded-2xl text-center backdrop-blur-md hover:bg-white/10 transition-colors">
                                    <div className="text-2xl font-black text-white mb-1">{stat.label}</div>
                                    <div className="text-orange-400 font-medium text-sm uppercase tracking-wider">{stat.sub}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* CALL TO ACTION */}
                <div className="text-center py-12 md:py-20">
                    <h2 className="text-4xl md:text-5xl font-black text-[#0B2046] mb-6">Ready to plan your journey?</h2>
                    <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                        Search available buses and find a journey that works for you.
                    </p>
                    <Link to="/" className="inline-flex items-center bg-[#F97316] hover:bg-orange-600 text-white font-bold py-4 px-10 rounded-full transition-all shadow-xl hover:shadow-orange-500/40 hover:-translate-y-1 text-xl group">
                        Search Buses
                        <Bus className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
                
            </div>
        </div>
    );
};

export default AboutUs;
