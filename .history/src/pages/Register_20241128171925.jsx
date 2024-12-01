// src/pages/Register.js
import React, { useState } from 'react';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
    } else {
      // Handle registration logic
      console.log('Registering with', { email, password });
      setError('');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-4">Create an Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300" htmlFor="email">
              Email
            </label>
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
            <label className="block text-sm font-medium text-gray-300" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full mt-2 px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300" htmlFor="confirm-password">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm-password"
              className="w-full mt-2 px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          <button type="submit" className="w-full py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 focus:outline-none">
            Register
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm">
            Already have an account? <a href="/login" className="text-sky-500 hover:underline">Log in here</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
