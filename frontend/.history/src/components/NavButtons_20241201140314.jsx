const NavButtons = ({ onClick, handleLogout, onProfileClick }) => {
    const buttons = [
        'Attendance',
        'Task',
        'Projects',
        'Profile',  // Add this new button
        'Logout'
    ];

    const handleButtonClick = (button) => {
        if (button === 'Logout') {
            handleLogout();
        } else if (button === 'Profile') {
            onProfileClick();
        } else {
            onClick(button);
        }
    };

    return (
        <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            {buttons.map((button) => (
                <button
                    key={button}
                    onClick={() => handleButtonClick(button)}
                    className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded transition duration-300"
                >
                    {button}
                </button>
            ))}
        </div>
    );
};