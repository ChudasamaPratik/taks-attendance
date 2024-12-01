import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError(''); // Clear any previous error
            const response = await axios.post('/http://localhost:5000/api/auth/login', { email, password });

            if (response.data.success) {
                const { token } = response.data;
                onLogin(token); // Save token via the parent App
                navigate('/dashboard'); // Redirect to dashboard
            }
        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data.message || 'Invalid email or password');
            } else {
                setError('An error occurred. Please try again.');
            }
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
            <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold text-center mb-4">Log in</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300" htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="w-full mt-2 px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300" htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="w-full mt-2 px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                    <button type="submit" className="w-full py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 focus:outline-none">
                        Log in
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <p className="text-sm">Don't have an account? <a href="/register" className="text-sky-500 hover:underline">Register here</a></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
