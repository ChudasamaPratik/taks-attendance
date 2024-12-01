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

    // Projects dropdown
    const projectOptions = [
        'Select Project',
        'Project A',
        'Project B',
        'Project C',
        'Personal',
        'Other'
    ];

    // State for managing multiple tasks
    const [tasks, setTasks] = useState([
        {
            id: 1,
            project: 'Select Project',
            title: ''
        }
    ]);

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

    useEffect(() => {
        fetchAttendanceRecords();
    }, [currentDate]);


    // Generate days for the current month
    const generateCalendarDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        // First day of the month
        const firstDay = new Date(year, month, 1);
        // Last day of the month
        const lastDay = new Date(year, month + 1, 0);

        const calendarDays = [];

        // Current month's days
        for (let i = 1; i <= lastDay.getDate(); i++) {
            const day = new Date(year, month, i);
            calendarDays.push({
                date: day,
                currentMonth: true
            });
        }

        return calendarDays;
    };

    // Navigation and date selection handlers
    const handlePreviousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const handleToday = () => {
        setCurrentDate(new Date());
    };

    const handleDateSelect = (day) => {
        setSelectedDate(day);
        setCentralDropdownOpen(true);
    };

    // Determine the starting day of the week for the first day of the month
    const getStartingDayOfWeek = () => {
        return new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    };

    // Pad the calendar grid
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

    // Task Management Functions
    const addNewTask = () => {
        const newTask = {
            id: tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
            project: 'Select Project',
            title: ''
        };
        setTasks([...tasks, newTask]);
    };

    const removeTask = (idToRemove) => {
        // Ensure at least one task remains
        if (tasks.length > 1) {
            setTasks(tasks.filter(task => task.id !== idToRemove));
        }
    };

    const updateTask = (id, field, value) => {
        const updatedTasks = tasks.map(task =>
            task.id === id ? { ...task, [field]: value } : task
        );
        setTasks(updatedTasks);
    };

    const handleTaskSubmit = () => {
        // Validate tasks
        const validTasks = tasks.filter(task =>
            task.project && task.project !== 'Select Project' &&
            task.title.trim() !== ''
        );

        if (validTasks.length === 0) {
            alert('Please add at least one valid task');
            return;
        }

        // Here you would typically save the tasks
        console.log('Tasks to save:', validTasks);
        alert(`${validTasks.length} task(s) added for ${selectedDate.toDateString()}`);

        // Reset tasks and close modal
        setTasks([{ id: 1, project: 'Select Project', title: '' }]);
        setIsTaskModalOpen(false);
    };

    const submitAttendance = async (selectedDate, option, setCentralDropdownOpen) => {
        // Retrieve the token from localStorage
        const token = localStorage.getItem('token');

        // Check if token exists
        if (!token) {
            toast.error('Please log in again.');
            onLogout();
            return;
        }

        const attendanceData = {
            date: selectedDate.toLocaleDateString('en-CA'),
            attendanceType: option,
            notes: attendanceNote
        };

        try {
            const response = await axios.post('http://localhost:5001/api/attendance', attendanceData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            // Use the response data for more specific feedback
            if (response.data.success) {
                toast.success(response.data.message);
                // Refresh attendance records after successful submission
                fetchAttendanceRecords();
                setCentralDropdownOpen(false);
            } else {
                toast.error('Failed to record attendance');
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
        setCentralDropdownOpen(false);
    };

    return (
        <div className="w-full h-screen bg-gray-900 text-gray-100 flex flex-col p-9">
            <div className="bg-gray-800 shadow-md p-4 flex justify-evenly items-center rounded-t-lg">
                <div className="flex space-x-2">
                    <button
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                        onClick={handlePreviousMonth}
                    >
                        Previous
                    </button>
                    <button
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                        onClick={handleToday}
                    >
                        Today
                    </button>
                    <button
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                        onClick={handleNextMonth}
                    >
                        Next
                    </button>
                </div>

                <h2 className="text-2xl font-bold text-gray-100">
                    {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
                </h2>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-2 p-4 bg-gray-800 rounded-b-lg">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center font-bold text-gray-400">{day}</div>
                ))}
            </div>

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
                                <p>{day.date.toLocaleString()}</p>
                                <p
                                    className={`text-white py-2 rounded-lg transition ${getAttendanceClass(
                                        attendanceRecords[day.date.toLocaleDateString('en-CA')]?.attendanceType || 'Present'
                                    )}`}
                                >
                                    {attendanceRecords[day.date.toLocaleDateString('en-CA')]?.attendanceType || 'Present'}
                                </p>
                                {/* Optional: Display note if available */}

                                <p className="text-xs text-gray-400 mt-1 truncate">
                                    {Object.entries(attendanceRecords).map(([date, type], index) => {
                                        return (
                                            <span key={index} className="block">
                                                {date}: {type}

                                                day.date.toDateString()
                                            </span>

                                            
                                        );
                                    })}
                                </p>

                            </div>
                        </div>
                    ) : (
                        <div key={index} className="bg-gray-900"></div>
                    )
                ))}
            </div>

            {/* Attendance Dropdown */}
            {centralDropdownOpen && selectedDate && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="bg-gray-800 rounded-xl shadow-2xl p-6 w-96 border border-gray-700">
                        <h3 className="text-xl font-bold mb-4 text-center text-gray-100">
                            {selectedDate.toDateString()}
                        </h3>

                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-indigo-400">Attendance</h4>

                            <div className="grid grid-cols-2 gap-4">
                                {attendanceOptions.map((option) => (
                                    <button
                                        key={option}
                                        className="bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
                                        onClick={() => submitAttendance(selectedDate, option, setCentralDropdownOpen)}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>

                            <input
                                type="text"
                                value={attendanceNote}
                                onChange={(e) => setAttendanceNote(e.target.value)}
                                placeholder="Optional note"
                                className="w-full p-2 bg-gray-600 text-gray-100 rounded-lg border border-gray-500"
                            />

                            <div className="mt-4">
                                <button
                                    className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                                    onClick={() => {
                                        setCentralDropdownOpen(false);
                                        setIsTaskModalOpen(true);
                                    }}
                                >
                                    Show/Add Task
                                </button>
                            </div>

                            <button
                                className="mt-4 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
                                onClick={() => setCentralDropdownOpen(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Task Modal */}
            {isTaskModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="bg-gray-800 rounded-xl shadow-2xl p-6 w-[500px] border border-gray-700">
                        <h3 className="text-xl font-bold mb-4 text-center text-gray-100">
                            Add Task for {selectedDate && selectedDate.toDateString()}
                        </h3>

                        <div className="space-y-4 max-h-[500px] overflow-y-auto">
                            {tasks.map((task, index) => (
                                <div key={task.id} className="bg-gray-700 p-4 rounded-lg mb-4 relative">
                                    {tasks.length > 1 && (
                                        <button
                                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                            onClick={() => removeTask(task.id)}
                                        >
                                            ✕
                                        </button>
                                    )}

                                    <div className="mb-3">
                                        <label className="block text-gray-300 mb-2">Project</label>
                                        <select
                                            value={task.project}
                                            onChange={(e) => updateTask(task.id, 'project', e.target.value)}
                                            className="w-full p-2 bg-gray-600 text-gray-100 rounded-lg border border-gray-500"
                                        >
                                            {projectOptions.map((project) => (
                                                <option key={project} value={project}>
                                                    {project}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-gray-300 mb-2">Task Title</label>
                                        <input
                                            type="text"
                                            value={task.title}
                                            onChange={(e) => updateTask(task.id, 'title', e.target.value)}
                                            className="w-full p-2 bg-gray-600 text-gray-100 rounded-lg border border-gray-500"
                                            placeholder="Enter task title"
                                        />
                                    </div>
                                </div>
                            ))}

                            <div className="flex justify-center">
                                <button
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                                    onClick={addNewTask}
                                >
                                    + Add Another Task
                                </button>
                            </div>
                        </div>

                        <div className="flex space-x-4 mt-6">
                            <button
                                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                                onClick={handleTaskSubmit}
                            >
                                Save Tasks
                            </button>
                            <button
                                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
                                onClick={() => {
                                    setIsTaskModalOpen(false);
                                    setTasks([{ id: 1, project: 'Select Project', title: '' }]);
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>

                </div>
            )}
            <div className="flex justify-center ">
                <NavButtons />
            </div>
        </div>


    );
};

export default Attendance;