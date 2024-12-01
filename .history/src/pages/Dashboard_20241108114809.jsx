// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Dashboard.css';
import NavButtons from '../components/NavButtons';

const Dashboard = () => {
    const navigate = useNavigate();
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString());

            // Set "Job Over" time to 6 PM
            const jobOverTime = new Date();
            jobOverTime.setHours(18, 0, 0, 0); // Set to 6:00 PM today

            // Calculate time left until 6 PM
            const timeDifference = jobOverTime - now;
            if (timeDifference <= 0) {
                setTimeLeft('Job is Over'); // Job is over if the current time is after 6 PM
            } else {
                // Calculate hours and minutes left
                const hoursLeft = Math.floor(timeDifference / (1000 * 60 * 60)); // Hours left
                const minutesLeft = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60)); // Minutes left

                setTimeLeft(`${hoursLeft} hours and ${minutesLeft} minutes left`);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleLogout = () => {
        navigate('/login');
    };

    const handleButtonClick = (buttonName) => {
        if (buttonName === 'Attendance') {
            navigate('/attendance');
        } else if (buttonName === 'Task') {
            navigate('/task');
        } else if (buttonName === 'Projects') {
            navigate('/projects');
        }
    };

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
            {/* Centered Main Time Display */}
            <div className="text-center mb-8">
                <h2 className="text-8xl font-bold text-white drop-shadow-md jura-time">
                    {currentTime}
                </h2>
                {/* Left and Right Times under the main time */}
                <div className="flex justify-center w-full mb-6">
                    <div className="text-right text-sm font-medium text-white">
                        {timeLeft}
                    </div>
                </div>
            </div>

            <NavButtons /> {/* Add NavButtons here */}
        </div>
    );
};

export default Dashboard;
