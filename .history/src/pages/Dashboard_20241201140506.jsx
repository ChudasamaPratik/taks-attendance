import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Dashboard.css';
import NavButtons from '../components/NavButtons';

const Dashboard = ({ onLogout }) => {
    const navigate = useNavigate();
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
    const [timeLeft, setTimeLeft] = useState('');
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    // User Profile State
    const [userProfile, setUserProfile] = useState({
        name: 'John Doe',
        email: 'john.doe@company.com',
        department: 'Engineering',
        position: 'Software Developer',
        startDate: '2023-01-15',
        employeeId: 'EMP-001'
    });

    // Function to calculate time left until 6 PM
    const calculateTimeLeft = () => {
        const now = new Date();
        const jobOverTime = new Date();
        jobOverTime.setHours(18, 0, 0, 0);

        const timeDifference = jobOverTime - now;

        if (timeDifference <= 0) {
            return 'Job is Over';
        } else {
            const hoursLeft = Math.floor(timeDifference / (1000 * 60 * 60));
            const minutesLeft = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
            const secondsLeft = Math.floor((timeDifference % (1000 * 60)) / 1000);
            return `${hoursLeft} hours, ${minutesLeft} minutes, and ${secondsLeft} seconds left`;
        }
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString());
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

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

    // Toggle Profile View
    const toggleProfile = () => {
        setIsProfileOpen(!isProfileOpen);
    };

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white relative">
            {/* Profile Modal */}
            {isProfileOpen && (
                <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-90 z-50 flex items-center justify-center">
                    <div className="bg-gray-800 p-8 rounded-lg w-96 relative">
                        <button
                            onClick={toggleProfile}
                            className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300"
                        >
                            ×
                        </button>
                        <h2 className="text-2xl font-bold mb-6 text-center">My Profile</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400">Name</label>
                                <p className="text-xl">{userProfile.name}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400">Employee ID</label>
                                <p className="text-xl">{userProfile.employeeId}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400">Email</label>
                                <p className="text-xl">{userProfile.email}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400">Department</label>
                                <p className="text-xl">{userProfile.department}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400">Position</label>
                                <p className="text-xl">{userProfile.position}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400">Start Date</label>
                                <p className="text-xl">{userProfile.startDate}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
            <NavButtons
                onClick={handleButtonClick}
                handleLogout={onLogout}
                onProfileClick={toggleProfile}
            />
        </div>
    );
};

export default Dashboard;