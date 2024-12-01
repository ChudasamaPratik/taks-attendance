import React, { useState, useEffect } from 'react';
import NavButtons from '../components/NavButtons';

// Helper function to get all the dates in a specific month, including empty days before the 1st of the month
const getMonthDates = (year, month) => {
    const dates = [];
    const lastDay = new Date(year, month + 1, 0).getDate(); // Get the last day of the month
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // Get the day of the week for the 1st day of the month

    // Add empty cells before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
        dates.push(null); // Add a null to create empty space for the starting day
    }

    // Add the actual days of the month
    for (let day = 1; day <= lastDay; day++) {
        dates.push(new Date(year, month, day));
    }

    return dates;
};

// Helper function to get the name of the day (Sunday, Monday, etc.)
const getDayName = (date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
};

const Attendance = () => {
    const [attendance, setAttendance] = useState({}); // Store attendance for each day
    const [currentDate, setCurrentDate] = useState(new Date()); // Current date to track the selected month
    const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth()); // Selected month
    const userId = 1; // Simulating user ID for now

    // Get the dates of the selected month
    const dates = getMonthDates(currentDate.getFullYear(), selectedMonth);

    // Fetch attendance data when the component mounts
    useEffect(() => {
        const storedAttendance = JSON.parse(localStorage.getItem(`attendance_${userId}`)); // Fetch data based on userId
        if (storedAttendance) {
            setAttendance(storedAttendance);
        }
    }, []);

    // Handle attendance change
    const handleAttendanceChange = (date, type) => {
        const dateString = `${date.getMonth() + 1}-${date.getDate()}`;
        const updatedAttendance = { ...attendance, [dateString]: { type, date } };

        setAttendance(updatedAttendance);
        localStorage.setItem(`attendance_${userId}`, JSON.stringify(updatedAttendance)); // Save to localStorage with userId
    };

    // Handle month navigation (previous and next)
    const changeMonth = (direction) => {
        let newMonth = selectedMonth + direction;
        if (newMonth > 11) {
            newMonth = 0;
        } else if (newMonth < 0) {
            newMonth = 11;
        }
        setSelectedMonth(newMonth);
        setCurrentDate(new Date(currentDate.getFullYear(), newMonth));
    };

    // Go to today's date (current month)
    const goToToday = () => {
        setSelectedMonth(currentDate.getMonth());
        setCurrentDate(new Date());
    };

    // Function to check if a given date is today's date
    const isToday = (date) => {
        const today = new Date();
        return today.getDate() === date.getDate() &&
            today.getMonth() === date.getMonth() &&
            today.getFullYear() === date.getFullYear();
    };

    // Helper function to get the border color based on attendance type
    const getBorderColor = (attendanceType) => {
        switch (attendanceType) {
            case 'Present':
                return '#4CAF50'; // Green
            case 'Leave':
                return '#F44336'; // Red (for Leave)
            case 'Cancel Leave':
                return '#FFEB3B'; // Yellow (for Cancel Leave)
            case 'Extra Day':
                return '#3F51B5'; // Blue
            default:
                return 'transparent'; // No border
        }
    };

    // Function to calculate the attendance count for each type in the selected month
    const getAttendanceCount = () => {
        const counts = {
            Present: 0,
            Leave: 0,
            'Cancel Leave': 0,
            'Extra Day': 0
        };

        // Iterate through all attendance records and count those that match the selected month
        Object.keys(attendance).forEach((key) => {
            const [month, day] = key.split('-');
            if (parseInt(month) === selectedMonth + 1) { // Compare the month
                const status = attendance[key].type; // Access type from the object
                if (status) {
                    counts[status]++;
                }
            }
        });

        return counts;
    };

    const attendanceCounts = getAttendanceCount();

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-start text-white py-10 px-4">
            <h2 className="text-4xl font-semibold mb-6 text-center tracking-wider">
                Attendance for {new Date(currentDate.getFullYear(), selectedMonth).toLocaleString('default', { month: 'long' })}
            </h2>

            {/* Navigation buttons for months */}
            <div className="flex justify-center items-center w-full mb-6 space-x-6">
                <button
                    onClick={() => changeMonth(-1)}
                    className="text-xl bg-transparent border-2 border-white px-8 py-3 rounded-full hover:bg-gray-700 hover:text-blue-500 transition-all duration-300"
                >
                    Previous Month
                </button>

                <button
                    onClick={goToToday}
                    className="text-xl bg-transparent border-2 border-white px-8 py-3 rounded-full hover:bg-gray-700 hover:text-blue-500 transition-all duration-300"
                >
                    Today
                </button>

                <button
                    onClick={() => changeMonth(1)}
                    className="text-xl bg-transparent border-2 border-white px-8 py-3 rounded-full hover:bg-gray-700 hover:text-blue-500 transition-all duration-300"
                >
                    Next Month
                </button>
            </div>

            {/* Attendance Summary */}
            <div className="text-center mb-6">
             {/* <h3 className="text-2xl font-semibold mb-4">Attendance Summary for {new Date(currentDate.getFullYear(), selectedMonth).toLocaleString('default', { month: 'long' })}</h3> */}
                <div className="grid grid-cols-4 gap-6 text-lg">
                    <div className="bg-green-700 p-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                        <p className="font-semibold text-white">Present</p>
                        <p className="text-white">{attendanceCounts.Present}</p>
                    </div>
                    <div className="bg-red-700 p-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                        <p className="font-semibold text-white">Leave</p>
                        <p className="text-white">{attendanceCounts.Leave}</p>
                    </div>
                    <div className="bg-yellow-700 p-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                        <p className="font-semibold text-white">Cancel Leave</p>
                        <p className="text-white">{attendanceCounts['Cancel Leave']}</p>
                    </div>
                    <div className="bg-blue-700 p-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                        <p className="font-semibold text-white">Extra Day</p>
                        <p className="text-white">{attendanceCounts['Extra Day']}</p>
                    </div>
                </div>
            </div>

            {/* Calendar layout */}
            <div className="grid grid-cols-7 gap-4 mb-8 text-center">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="font-semibold text-lg text-gray-300">{day}</div>
                ))}

                {dates.map((date) => {
                    if (!date) return <div key="empty" className="bg-gray-800"></div>; // For empty spaces before 1st of month
                    const dateString = `${date.getMonth() + 1}-${date.getDate()}`;
                    const dayName = getDayName(date);

                    return (
                        <div
                            key={dateString}
                            className={`relative flex flex-col justify-between items-center p-4 rounded-lg transition-all transform hover:scale-105 ${isToday(date) ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-800 text-gray-100'} `}
                            style={{
                                border: `3px solid ${getBorderColor(attendance[dateString]?.type)}`, // Border color based on attendance type
                                minHeight: '150px', // Reduced card height
                                width: '140px', // Increased card width
                            }}
                        >
                            <p className="font-semibold text-2xl">{date.getDate()}</p>
                            <select
                                value={attendance[dateString]?.type || ""}
                                onChange={(e) => handleAttendanceChange(date, e.target.value)}
                                className="absolute bottom-2 left-2 w-4/5 bg-gray-700 text-white rounded-lg focus:outline-none py-2 px-3"
                            >
                                <option value="">Select</option>
                                <option value="Present">Present</option>
                                <option value="Leave">Leave</option>
                                <option value="Cancel Leave">Cancel Leave</option>
                                <option value="Extra Day">Extra Day</option>
                            </select>
                        </div>
                    );
                })}
            </div>

            <NavButtons />
        </div>
    );
};

export default Attendance;
