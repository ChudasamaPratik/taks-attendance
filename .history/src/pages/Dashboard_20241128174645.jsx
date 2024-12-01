import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Dashboard.css';
import NavButtons from '../components/NavButtons';

const Dashboard = () => {
    const navigate = useNavigate();
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
    const [timeLeft, setTimeLeft] = useState('');

    // Function to calculate time left until 6 PM
    const calculateTimeLeft = () => {
        const now = new Date();

        // Set "Job Over" time to 6 PM
        const jobOverTime = new Date();
        jobOverTime.setHours(18, 0, 0, 0);

        const timeDifference = jobOverTime - now;

        if (timeDifference <= 0) {
            return 'Job is Over';
        } else {
            const hoursLeft = Math.floor(timeDifference / (1000 * 60 * 60));
            const minutesLeft = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
            return `${hoursLeft} hours and ${minutesLeft} minutes left`;
        }
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString());
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token'); // Clear authentication token
        navigate('/login');
    };

    const handleButtonClick = (buttonName) => {
        switch (buttonName) {
            case 'Attendance':
                navigate('/attendance');
                break;
            case 'Task':
                navigate('/task');
                break;
            case 'Projects':
                navigate('/projects');
                break;
            default:
                break;
        }
    };

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
            {/* Centered Main Time Display */}
            <div className="text-center mb-8">
                <h2 className="text-8xl font-bold text-white drop-shadow-md jura-time">
                    {currentTime}
                </h2>
                {/* Time left display */}
                <div className="text-sm font-medium text-white">
                    {timeLeft}
                </div>
            </div>

            {/* Navigation Buttons */}
            <NavButtons onClick={handleButtonClick} />

            {/* Logout Button */}
            <button
                className="mt-8 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                onClick={handleLogout}
            >
                Logout
            </button>
        </div>
    );
};

export default Dashboard;
