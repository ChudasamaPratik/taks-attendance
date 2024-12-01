import React, { useState } from 'react';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [centralDropdownOpen, setCentralDropdownOpen] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [attendanceStatus, setAttendanceStatus] = useState(null);

  // Existing calendar generation methods remain the same...
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const calendarDays = [];
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const day = new Date(year, month, i);
      calendarDays.push({
        date: day,
        currentMonth: true
      });
    }
    
    return calendarDays;
  };

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
    // Reset attendance status when new date is selected
    setAttendanceStatus(null);
  };

  // Attendance status handler
  const handleAttendanceStatus = (status) => {
    setAttendanceStatus(status);
    // You might want to add logic to save this status
    console.log(`Attendance status set to: ${status} for ${selectedDate}`);
  };

  // Task Modal Component
  const TaskModal = () => {
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [taskPriority, setTaskPriority] = useState('medium');

    const handleSaveTask = () => {
      // Logic to save task
      console.log({
        date: selectedDate,
        title: taskTitle,
        description: taskDescription,
        priority: taskPriority
      });
      setTaskModalOpen(false);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-800 rounded-xl p-6 w-96 border border-gray-700">
          <h2 className="text-xl font-bold mb-4 text-white">Add Task</h2>
          
          <div className="space-y-4">
            <input 
              type="text" 
              placeholder="Task Title" 
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="w-full p-2 bg-gray-700 text-white rounded"
            />
            
            <textarea 
              placeholder="Task Description" 
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              className="w-full p-2 bg-gray-700 text-white rounded h-24"
            />
            
            <select 
              value={taskPriority}
              onChange={(e) => setTaskPriority(e.target.value)}
              className="w-full p-2 bg-gray-700 text-white rounded"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>
          
          <div className="flex justify-between mt-6">
            <button 
              onClick={() => setTaskModalOpen(false)}
              className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
            >
              Cancel
            </button>
            <button 
              onClick={handleSaveTask}
              className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
            >
              Save Task
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Existing getStartingDayOfWeek and renderCalendarGrid methods...
  const getStartingDayOfWeek = () => {
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  };

  const renderCalendarGrid = () => {
    const startingDayOfWeek = getStartingDayOfWeek();
    const calendarDays = generateCalendarDays();
    const totalSlots = 42;
    const grid = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      grid.push(null);
    }

    grid.push(...calendarDays);

    while (grid.length < totalSlots) {
      grid.push(null);
    }

    return grid;
  };

  return (
    <div className="w-full h-screen bg-gray-900 text-gray-100 flex flex-col">
      {/* Existing header and weekday header sections remain the same */}
      
      {/* Calendar Grid and Central Dropdown */}
      {centralDropdownOpen && selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl shadow-2xl p-6 w-96 border border-gray-700">
            <h3 className="text-xl font-bold mb-4 text-center text-gray-100">
              {selectedDate.toDateString()}
            </h3>
            
            {/* Attendance Dropdown */}
            {!attendanceStatus ? (
              <div className="grid grid-cols-2 gap-4">
                {['Present', 'Leave', 'Cancel', 'Extra Day'].map((status) => (
                  <button 
                    key={status} 
                    className="bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
                    onClick={() => handleAttendanceStatus(status)}
                  >
                    {status}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center mb-4">
                <p className="text-green-400 font-semibold">
                  Attendance Status: {attendanceStatus}
                </p>
                <button 
                  className="mt-2 bg-gray-600 text-white py-1 px-3 rounded"
                  onClick={() => setAttendanceStatus(null)}
                >
                  Change Status
                </button>
              </div>
            )}

            {/* Add Task Button */}
            <div className="mt-4">
              <button 
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                onClick={() => {
                  setCentralDropdownOpen(false);
                  setTaskModalOpen(true);
                }}
              >
                Add Task
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
      )}

      {/* Task Modal */}
      {taskModalOpen && <TaskModal />}

      {/* Rest of the calendar rendering remains the same */}
    </div>
  );
};

export default Calendar;