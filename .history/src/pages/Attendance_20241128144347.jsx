import React, { useState } from 'react';

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [centralDropdownOpen, setCentralDropdownOpen] = useState(false);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

    // ... (previous methods remain the same)

    const handleDateSelect = (day) => {
        setSelectedDate(day);
        setCentralDropdownOpen(true);
    };

    // Updated dropdown actions
    const attendanceOptions = [
        'Present',
        'Leave',
        'Cancel',
        'Extra Day'
    ];

    return (
        <div className="w-full h-screen bg-gray-900 text-gray-100 flex flex-col">
            {/* ... (previous header and calendar grid code remains the same) */}

            {/* Central Dropdown */}
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
                                        onClick={() => {
                                            alert(`${option} selected for ${selectedDate.toDateString()}`);
                                            setCentralDropdownOpen(false);
                                        }}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>

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
                    <div className="bg-gray-800 rounded-xl shadow-2xl p-6 w-96 border border-gray-700">
                        <h3 className="text-xl font-bold mb-4 text-center text-gray-100">
                            Add Task for {selectedDate && selectedDate.toDateString()}
                        </h3>

                        <form className="space-y-4">
                            <div>
                                <label htmlFor="taskTitle" className="block text-gray-300 mb-2">Task Title</label>
                                <input 
                                    type="text" 
                                    id="taskTitle" 
                                    className="w-full p-2 bg-gray-700 text-gray-100 rounded-lg border border-gray-600"
                                    placeholder="Enter task title"
                                />
                            </div>

                            <div>
                                <label htmlFor="taskDescription" className="block text-gray-300 mb-2">Description</label>
                                <textarea 
                                    id="taskDescription"
                                    className="w-full p-2 bg-gray-700 text-gray-100 rounded-lg border border-gray-600"
                                    placeholder="Enter task description"
                                    rows="4"
                                ></textarea>
                            </div>

                            <div className="flex space-x-4">
                                <button
                                    type="button"
                                    className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                                    onClick={() => {
                                        alert('Task Added');
                                        setIsTaskModalOpen(false);
                                    }}
                                >
                                    Save Task
                                </button>
                                <button
                                    type="button"
                                    className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
                                    onClick={() => setIsTaskModalOpen(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Calendar;