import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }
        try {
            await register(name, email, phone, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Error registering');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-3xl font-bold text-center text-primary mb-6">Register</h2>
            {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">{error}</div>}
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Full Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full border-gray-300 rounded p-3 bg-gray-50 focus:bg-white focus:ring-accent focus:border-accent transition" />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full border-gray-300 rounded p-3 bg-gray-50 focus:bg-white focus:ring-accent focus:border-accent transition" />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Phone</label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required className="w-full border-gray-300 rounded p-3 bg-gray-50 focus:bg-white focus:ring-accent focus:border-accent transition" />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength="6" className="w-full border-gray-300 rounded p-3 bg-gray-50 focus:bg-white focus:ring-accent focus:border-accent transition" />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Confirm Password</label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full border-gray-300 rounded p-3 bg-gray-50 focus:bg-white focus:ring-accent focus:border-accent transition" />
                </div>
                
                <button type="submit" className="w-full bg-primary hover:bg-blue-900 text-white font-bold py-3 rounded-lg transition mt-4">
                    Register
                </button>
            </form>
            <p className="mt-6 text-center text-gray-600">
                Already have an account? <Link to="/login" className="text-secondary hover:underline">Login</Link>
            </p>
        </div>
    );
};

export default Register;
