import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShieldCheck } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    
    // We will bypass the context login to handle the admin role check explicitly here
    // But we still want to set the token globally if it succeeds.
    
    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            
            if (res.data.user.role !== 'admin') {
                setError('Unauthorized. This portal is for administrators only.');
                setLoading(false);
                return;
            }
            
            // Set global auth state manually to avoid redirecting to regular dashboard
            localStorage.setItem('token', res.data.token);
            // We force a page reload so the AuthContext picks up the new token and role 
            // naturally, and we redirect to /admin/dashboard
            window.location.href = '/admin/dashboard';
            
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid admin credentials');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0B2046]">
            <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md">
                <div className="flex justify-center mb-6">
                    <div className="bg-blue-100 p-4 rounded-full text-[#0B2046]">
                        <ShieldCheck className="h-12 w-12" />
                    </div>
                </div>
                
                <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-2">Admin Portal</h1>
                <p className="text-center text-gray-500 mb-8 font-medium">Restricted Access</p>
                
                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm font-bold border border-red-100 text-center">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Admin Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-[#F97316] focus:ring focus:ring-orange-200 transition outline-none"
                            placeholder="admin@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-[#F97316] focus:ring focus:ring-orange-200 transition outline-none"
                            placeholder="••••••••"
                        />
                    </div>
                    
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-[#F97316] hover:bg-orange-600 text-white font-bold py-3.5 px-4 rounded-xl transition shadow-lg shadow-orange-500/30 flex justify-center items-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Authenticating...' : 'Secure Login'}
                    </button>
                </form>
                
                <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                    <a href="/" className="text-sm font-bold text-gray-400 hover:text-[#0B2046] transition">
                        &larr; Return to main website
                    </a>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
