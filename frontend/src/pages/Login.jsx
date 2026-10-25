import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [loginMode, setLoginMode] = useState('customer'); // 'customer' or 'admin'
    const [email, setEmail] = useState('user@example.com');
    const [password, setPassword] = useState('user123');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleModeSwitch = (mode) => {
        setLoginMode(mode);
        setError('');
        if (mode === 'admin') {
            setEmail('admin@busbooker.com');
            setPassword('Admin@123');
        } else {
            setEmail('user@example.com');
            setPassword('user123');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (loginMode === 'admin') {
            try {
                const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
                if (res.data.user.role !== 'admin') {
                    setError('Unauthorized. This portal is for administrators only.');
                    setLoading(false);
                    return;
                }
                localStorage.setItem('token', res.data.token);
                window.location.href = '/admin/dashboard';
            } catch (err) {
                setError(err.response?.data?.message || 'Invalid admin credentials');
                setLoading(false);
            }
        } else {
            try {
                await login(email, password);
                navigate('/');
            } catch (err) {
                setError(err.response?.data?.message || 'Invalid email or password.');
                setLoading(false);
            }
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-3xl font-bold text-center text-primary mb-6">Welcome Back</h2>
            
            <div className="flex justify-center mb-6 bg-gray-100 p-1 rounded-lg">
                <button 
                    type="button"
                    className="flex-1 py-2 text-sm font-bold rounded-md transition bg-white shadow text-primary"
                >
                    User Login
                </button>
                <Link 
                    to="/admin/login"
                    className="flex-1 py-2 text-sm font-bold rounded-md transition text-center text-gray-500 hover:text-gray-700"
                >
                    Admin Login
                </Link>
            </div>

            {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">{error}</div>}
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Email</label>
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border-gray-300 rounded p-3 bg-gray-50 focus:bg-white focus:ring-accent focus:border-accent transition"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Password</label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border-gray-300 rounded p-3 bg-gray-50 focus:bg-white focus:ring-accent focus:border-accent transition"
                        required
                    />
                </div>
                <button 
                    type="submit" 
                    disabled={loading}
                    className={`w-full bg-primary hover:bg-blue-900 text-white font-bold py-3 rounded-lg transition mt-4 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                    {loading ? 'Logging in...' : `Login as ${loginMode === 'admin' ? 'Admin' : 'Customer'}`}
                </button>
            </form>
            
            {loginMode === 'customer' && (
                <p className="mt-6 text-center text-gray-600">
                    Don't have an account? <Link to="/register" className="text-secondary hover:underline">Register</Link>
                </p>
            )}
        </div>
    );
};

export default Login;
