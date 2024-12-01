import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NavButtons = ({ handleLogout, onProfileClick }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { 
            route: 'dashboard', 
            label: 'Dashboard'
        },
        { 
            route: 'attendance', 
            label: 'Attendance'
        },
        { 
            route: 'task', 
            label: 'Task'
        },
        { 
            route: 'projects', 
            label: 'Projects'
        },
        { 
            route: 'profile', 
            label: 'Profile'
        }
    ];

    const handleButtonClick = (route) => {
        // For profile, use the onProfileClick prop
        if (route === 'profile') {
            onProfileClick();
            return;
        }
        
        navigate(`/${route}`);
    };

    return (
        <div className="flex space-x-6 mt-6">
            {navItems.map((item) => (
                // Exclude current route buttons and profile button if on a route
                (location.pathname !== `/${item.route}` && !(item.route === 'profile' && location.pathname !== '/dashboard')) && (
                    <button
                        key={item.route}
                        onClick={() => handleButtonClick(item.route)}
                        className="px-6 py-3 bg-transparent text-blue-600 font-semibold hover:text-white transition-colors duration-200 rounded-md"
                    >
                        {item.label}
                    </button>
                )
            ))}
            <button
                onClick={handleLogout}
                className="px-6 py-3 bg-transparent text-red-600 font-semibold hover:text-white transition-colors duration-200 rounded-md"
            >
                Log out
            </button>
        </div>
    );
};

export default NavButtons;