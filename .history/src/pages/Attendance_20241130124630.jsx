import React, { useState } from 'react';
import NavButtons from '../components/NavButtons';
import axios from 'axios';
import toast from 'react-hot-toast';

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [centralDropdownOpen, setCentralDropdownOpen] = useState(false);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [attendanceNote, setAttendanceNote] = useState('');

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
    const [tasks, setTasks] = useState([{ id: 1, project: 'Select Project', title: '' }]);

    // Function to generate the days of the current month
    const generateCalendarDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        const calendarDays = [];

        for (let i = 1; i <= lastDay.getDate(); i++) {
            const day = new Date(year, month, i);
            calendarDays.push({ date: day, currentMonth: true });
        }

        return calendarDays;
    };

    const getStartingDayOfWeek = () => new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    // Navigation handlers
    const handlePreviousMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    const handleToday = () => setCurrentDate(new Date());

    const handleDateSelect = (day) => {
        setSelectedDate(day);
        setCentralDropdownOpen(true);
    };

    const renderCalendarGrid = () => {
        const startingDayOfWeek = getStartingDayOfWeek();
        const calendarDays = generateCalendarDays();
        const totalSlots = 42;
        const grid = [];

        // Fill in the grid
        for (let i = 0; i < startingDayOfWeek; i++) {
            grid.push(null);
        }

        grid.push(...calendarDays);

        while (grid.length < totalSlots) {
            grid.push(null);
        }

        return grid;
    };

    // Task Management Functions
    const addNewTask = () => {
        const newTask = { id: tasks.length + 1, project: 'Select Project', title: '' };
        setTasks([...tasks, newTask]);
    };

    const removeTask = (idToRemove) => {
        if (tasks.length > 1) {
            setTasks(tasks.filter(task => task.id !== idToRemove));
        }
    };

    const updateTask = (id, field, value) => {
        setTasks(tasks.map(task => task.id === id ? { ...task, [field]: value } : task));
    };

    const handleTaskSubmit = async () => {
        const validTasks = tasks.filter(task => task.project !== 'Select Project' && task.title.trim() !== '');

        if (validTasks.length === 0) {
            alert('Please add at least one valid task');
            return;
        }

        // Assuming you're sending data to an API
        try {
            await axios.post('/api/tasks', { tasks: validTasks });
            alert(`${validTasks.length} task(s) added for ${selectedDate.toDateString()}`);
        } catch (error) {
            console.error('Error submitting tasks:', error);
            alert('There was an error submitting your tasks.');
        }

        setTasks([{ id: 1, project: 'Select Project', title: '' }]);
        setIsTaskModalOpen(false);
    };

    const handleAttendance = async (attendanceType) => {
        const token = localStorage.getItem('token');

        if (!token) {
            alert('Authentication token not found. Please log in again.');
            return;
        }

        const attendanceData = {
            date: selectedDate.toISOString().split('T')[0],
            attendanceType,
            note: attendanceNote || ''
        };

        try {
            await axios.post('/api/attendance', attendanceData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            alert(`${attendanceType} attendance recorded for ${selectedDate.toDateString()}`);
            setCentralDropdownOpen(false);
        } catch (error) {
            console.error('Error recording attendance:', error);
            alert('There was an error recording your attendance.');
        }
    };

    return (
        <div className="w-full h-screen bg-gray-900 text-gray-100 flex flex-col p-9">
            {/* Header */}
            <div className="bg-gray-800 shadow-md p-4 flex justify-evenly items-center rounded-t-lg">
                <div className="flex space-x-2">
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg" onClick={handlePreviousMonth}>
                        Previous
                    </button>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg" onClick={handleToday}>
                        Today
                    </button>
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg" onClick={handleNextMonth}>
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

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2 p-4 flex-grow bg-gray-900">
                {renderCalendarGrid().map((day, index) => (
                    day ? (
                        <div
                            key={index}
                            className={`p-2 border text-center cursor-pointer rounded-lg transition 
                                bg-gray-800 hover:bg-gray-700 text-gray-200
                                ${day.date.toDateString() === new Date().toDateString()
                                ? 'border-2 border-green-600 font-bold'
                                : 'border-gray-700'}`}
                            onClick={() => handleDateSelect(day.date)}
                        >
                            {day.date.getDate()}
                        </div>
                    ) : <div key={index} className="bg-gray-900"></div>
                ))}
            </div>

            {/* Attendance Dropdown */}
            {centralDropdownOpen && selectedDate && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="bg-gray-800 rounded-xl shadow-2xl p-6 w-96 border border-gray-700">
                        <h3 className="text-xl font-bold mb-4 text-center text-gray-100">{selectedDate.toDateString()}</h3>
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-indigo-400">Attendance</h4>
                            <div className="grid grid-cols-2 gap-4">
                                {attendanceOptions.map(option => (
                                    <button
                                        key={option}
                                        className="bg-indigo-600 text-white py-2 rounded-lg"
                                        onClick={() => handleAttendance(option)}
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
                                className="w-full p-2 bg-gray-700 text-gray-200 rounded-lg"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Tasks Modal */}
            {isTaskModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="bg-gray-800 rounded-xl shadow-2xl p-6 w-96 border border-gray-700">
                        <h3 className="text-xl font-bold mb-4 text-center text-gray-100">Add Tasks</h3>
                        {tasks.map((task, index) => (
                            <div key={task.id} className="mb-4">
                                <input
                                    type="text"
                                    value={task.title}
                                    onChange={(e) => updateTask(task.id, 'title', e.target.value)}
                                    placeholder="Task Title"
                                    className="w-full p-2 mb-2 bg-gray-700 text-gray-200 rounded-lg"
                                />
                                <select
                                    value={task.project}
                                    onChange={(e) => updateTask(task.id, 'project', e.target.value)}
                                    className="w-full p-2 bg-gray-700 text-gray-200 rounded-lg"
                                >
                                    {projectOptions.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                                <button
                                    onClick={() => removeTask(task.id)}
                                    className="mt-2 text-red-600"
                                >
                                    Remove Task
                                </button>
                            </div>
                        ))}
                        <div className="flex justify-between">
                            <button onClick={addNewTask} className="bg-green-600 text-white px-4 py-2 rounded-lg">
                                Add New Task
                            </button>
                            <button onClick={handleTaskSubmit} className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                                Submit Tasks
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Calendar;
