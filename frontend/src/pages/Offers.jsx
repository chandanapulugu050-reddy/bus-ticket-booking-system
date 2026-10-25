import React from 'react';
import { Tag, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Offers = () => {
    const navigate = useNavigate();
    const coupons = [
        { code: 'WELCOME100', title: 'Flat ₹100 OFF', desc: 'Save ₹100 on your first booking above ₹500.', valid: '31 Dec 2026', terms: 'New users only. Min booking ₹500.' },
        { code: 'TRAVEL10', title: '10% OFF', desc: 'Get 10% discount on selected routes. Max discount ₹200.', valid: '15 Nov 2026', terms: 'Applicable on all routes.' }
    ];

    const handleApply = (code) => {
        // You can also save it to localStorage to auto-fill in booking summary
        localStorage.setItem('saved_coupon', code);
        navigate('/');
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 reveal">
            <h1 className="text-4xl font-black text-[#0B2046] mb-8 text-center">Exclusive <span className="text-[#F97316]">Offers</span></h1>
            
            <div className="grid md:grid-cols-2 gap-8">
                {coupons.map(c => (
                    <div key={c.code} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col md:flex-row items-center gap-6 premium-card hover:shadow-xl transition-shadow cursor-pointer">
                        <div className="bg-orange-100 p-4 rounded-full text-orange-500">
                            <Tag className="h-10 w-10" />
                        </div>
                        <div className="flex-1 w-full">
                            <h2 className="text-2xl font-bold text-gray-800">{c.title}</h2>
                            <p className="text-gray-600 mt-2">{c.desc}</p>
                            <p className="text-xs text-gray-400 mt-1">T&C: {c.terms}</p>
                            <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="bg-gray-100 px-4 py-2 rounded-lg font-mono font-bold text-gray-800 border-dashed border-2 border-gray-300 text-center">
                                    {c.code}
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-sm text-gray-500 font-medium mb-2">Valid till {c.valid}</span>
                                    <button 
                                        onClick={() => handleApply(c.code)}
                                        className="bg-[#0B2046] hover:bg-blue-900 text-white px-6 py-2 rounded-lg font-bold transition w-full sm:w-auto"
                                    >
                                        Apply / Use
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Offers;
