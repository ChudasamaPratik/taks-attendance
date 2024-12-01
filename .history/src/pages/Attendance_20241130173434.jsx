import React, { useState, useEffect } from 'react';
import NavButtons from '../components/NavButtons';
import axios from 'axios';
import toast from 'react-hot-toast';

const Attendance = ({ onLogout }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [centralDropdownOpen, setCentralDropdownOpen] = useState(false);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [attendanceNote, setAttendanceNote] = useState('');
    
    // New state for attendance records
    const [attendanceRecords, setAttendanceRecords] = useState({});

    // Attendance options
    const attendanceOptions = [
        'Present',
        'Leave',
        'Cancel Leave',
        'Extra Day'
    ];

    const getAttendanceClass = (type) => {
        switch (type) {
            case 'Present':
                return 'bg-green-300 hover:bg-green-200';
            case 'Leave':
                return 'bg-indigo-300 hover:bg-indigo-200';
            case 'Cancel Leave':
                return 'bg-yellow-300 hover:bg-yellow-200';
            case 'Extra Day':
                return 'bg-blue-300 hover:bg-blue-200';
            default:
                return 'bg-gray-300 hover:bg-gray-200';
        }
    };

    // Fetch attendance records for the current month
    const fetchAttendanceRecords = async () => {
        // Get start and end dates of the current month
        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        // Format dates to ISO string
        const startDate = firstDay.toLocaleDateString('en-CA');
        const endDate = lastDay.toLocaleDateString('en-CA');

        // Retrieve the token from localStorage
        const token = localStorage.getItem('token');

        if (!token) {
            toast.error('Please log in again.');
            onLogout();
            return;
        }

        try {
            const response = await axios.get('http://localhost:5001/api/attendance', {
                params: {
                    startDate,
                    endDate
                },
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.success) {
                // Convert attendance records to a map for easy lookup
                const attendanceMap = response.data.attendance.reduce((acc, record) => {
                    const date = new Date(record.date).toLocaleDateString('en-CA');
                    acc[date] = record.attendanceType;
                    return acc;
                }, {});

                setAttendanceRecords(attendanceMap);
            } else {
                toast.error('Failed to fetch attendance records');
            }
        } catch (error) {
            console.error('Error:', error);

            if (error.response) {
                toast.error(error.response.data.message || 'Server error');
            } else if (error.request) {
                toast.error("No response received from server");
            } else {
                toast.error("Error setting up the request");
            }
        }
    };

    // Fetch attendance when component mounts and when month changes
    useEffect(() => {
        fetchAttendanceRecords();
    }, [currentDate]);

    // ... (rest of the existing code remains the same)

    // Modify renderCalendarGrid to use attendanceRecords
    const renderCalendarGrid = () => {
        const startingDayOfWeek = getStartingDayOfWeek();
        const calendarDays = generateCalendarDays();
        const totalSlots = 42; // 6 rows * 7 columns
        const grid = [];

        // Add empty slots before the first day
        for (let i = 0; i < startingDayOfWeek; i++) {
            grid.push(null);
        }

        // Add actual days
        grid.push(...calendarDays);

        // Fill remaining slots
        while (grid.length < totalSlots) {
            grid.push(null);
        }

        return grid;
    };

    // Modify the day rendering to show attendance type
    return (
        <div className="w-full h-screen bg-gray-900 text-gray-100 flex flex-col p-9">
            {/* ... (existing code) ... */}

            <div className="grid grid-cols-7 gap-2 p-4 flex-grow bg-gray-900">
                {renderCalendarGrid().map((day, index) => (
                    day ? (
                        <div
                            key={index}
                            className={`flex flex-col justify-between p-2 border text-center cursor-pointer rounded-lg transition 
                            bg-gray-800 hover:bg-gray-700 text-gray-200
                            ${day.date.toDateString() === new Date().toDateString()
                                    ? 'border-2 border-green-600 font-bold'
                                    : 'border-gray-700'}`}
                            onClick={() => handleDateSelect(day.date)}
                        >
                            {/* Top Section: Day */}
                            <div className="text-lg font-semibold">
                                {day.date.getDate()}
                            </div>
                            {/* Bottom Section: Attendance Option */}
                            <div className="mt-2">
                                <p
                                    className={`text-white py-2 rounded-lg transition ${getAttendanceClass(
                                        attendanceRecords[day.date.toLocaleDateString('en-CA')] || 'Present'
                                    )}`}
                                >
                                    {attendanceRecords[day.date.toLocaleDateString('en-CA')] || 'Present'}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div key={index} className="bg-gray-900"></div>
                    )
                ))}
            </div>

            {/* ... (rest of the existing code) ... */}
        </div>
    );
};

export default Attendance;