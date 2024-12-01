import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Attendance from './pages/Attendance';
import Task from './pages/Task';
import Projects from './pages/Projects';
import { Toaster } from 'react-hot-toast';
import Profile from './pages/Profile';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogin = (token) => {
    localStorage.setItem('token', token);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };


  return (
    <BrowserRouter>
      <Toaster position="top-center" reverseOrder={true} />
      <Routes>
        <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
        <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} />
        <Route path="/register" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Register onRegister={handleLogin} />} />
        <Route path="/dashboard" element={isLoggedIn ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/login" />} />
        <Route path="/attendance" element={isLoggedIn ? <Attendance onLogout={handleLogout} /> : <Navigate to="/login" />} />
        <Route path="/task" element={isLoggedIn ? <Task /> : <Navigate to="/login" />} />
        <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/projects" element={isLoggedIn ? <Projects /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;