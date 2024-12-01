import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
    HomeIcon, 
    ClipboardListIcon, 
    TaskIcon, 
    FolderIcon, 
    LogOutIcon 
} from 'lucide-react'; // Optional: if you want icons

const NavButtons = ({ handleLogout }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { 
            route: 'dashboard', 
            label: 'Dashboard', 
            icon: HomeIcon 
        },
        { 
            route: 'attendance', 
            label: 'Attendance', 
            icon: ClipboardListIcon 
        },
        { 
            route: 'task', 
            label: 'Task', 
            icon: TaskIcon 
        },
        { 
            route: 'projects', 
            label: 'Projects', 
            icon: FolderIcon 
        }
    ];

    const handleButtonClick = (route) => {
        navigate(`/${route}`);
    };

    return (
        <div className="flex space-x-6 mt-6">
            {navItems.map((item) => (
                location.pathname !== `/${item.route}` && (
                    <button
                        key={item.route}
                        onClick={() => handleButtonClick(item.route)}
                        className="flex items-center px-4 py-2 bg-transparent text-blue-600 font-semibold hover:text-white transition-colors duration-200 rounded-md"
                    >
                        {item.icon && <item.icon className="mr-2 w-5 h-5" />}
                        {item.label}
                    </button>
                )
            ))}
            <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 bg-transparent text-red-600 font-semibold hover:text-white transition-colors duration-200 rounded-md"
            >
                <LogOutIcon className="mr-2 w-5 h-5" />
                Log out
            </button>
        </div>
    );
};

export default NavButtons;