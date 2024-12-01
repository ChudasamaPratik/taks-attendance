import React, { useState } from 'react';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [centralDropdownOpen, setCentralDropdownOpen] = useState(false);

  // Generate days for the current month
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const startingDay = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    
    const calendarDays = [];
    
    // Previous month's days
    for (let i = 0; i < startingDay; i++) {
      const prevMonthDay = new Date(year, month, -startingDay + i + 1);
      calendarDays.push({
        date: prevMonthDay,
        currentMonth: false
      });
    }
    
    // Current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      const day = new Date(year, month, i);
      calendarDays.push({
        date: day,
        currentMonth: true
      });
    }
    
    // Next month's days to fill the grid
    const totalDays = calendarDays.length;
    const remainingDays = 42 - totalDays;
    for (let i = 1; i <= remainingDays; i++) {
      const nextMonthDay = new Date(year, month + 1, i);
      calendarDays.push({
        date: nextMonthDay,
        currentMonth: false
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

  // Dropdown actions
  const dateDropdownActions = [
    'Add Attendance',
    'Mark Holiday'
  ];

  const centralDropdownActions = [
    'Create Event',
    'Add Reminder'
  ];

  return (
    <div className="w-full h-screen bg-gradient-to-br from-blue-100 to-blue-200 flex flex-col">
      {/* Header with navigation */}
      <div className="bg-white shadow-md p-4 flex justify-between items-center">
        <div className="flex space-x-2">
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition" 
            onClick={handlePreviousMonth}
          >
            Previous
          </button>
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition" 
            onClick={handleToday}
          >
            Today
          </button>
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition" 
            onClick={handleNextMonth}
          >
            Next
          </button>
        </div>
        
        <h2 className="text-2xl font-bold text-blue-800">
          {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
        </h2>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-2 p-4 bg-white">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-bold text-blue-600">{day}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2 p-4 flex-grow bg-white">
        {generateCalendarDays().map((day, index) => (
          <div 
            key={index} 
            className={`
              p-2 border text-center cursor-pointer rounded-lg transition 
              ${day.currentMonth 
                ? 'bg-white hover:bg-blue-100' 
                : 'bg-gray-100 text-gray-400'}
              ${day.date.toDateString() === new Date().toDateString() 
                ? 'border-2 border-blue-500 font-bold' 
                : 'border'}
            `}
            onClick={() => handleDateSelect(day.date)}
          >
            {day.date.getDate()}
          </div>
        ))}
      </div>

      {/* Central Dropdown */}
      {centralDropdownOpen && selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-96">
            <h3 className="text-xl font-bold mb-4 text-center">
              {selectedDate.toDateString()}
            </h3>
            
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-blue-700">Date Actions</h4>
              <div className="grid grid-cols-2 gap-4">
                {dateDropdownActions.map((action) => (
                  <button 
                    key={action} 
                    className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                    onClick={() => {
                      alert(`${action} for ${selectedDate.toDateString()}`);
                      setCentralDropdownOpen(false);
                    }}
                  >
                    {action}
                  </button>
                ))}
              </div>

              <div className="border-t my-4"></div>

              <h4 className="text-lg font-semibold text-green-700">Additional Options</h4>
              <div className="grid grid-cols-2 gap-4">
                {centralDropdownActions.map((action) => (
                  <button 
                    key={action} 
                    className="bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
                    onClick={() => {
                      alert(`${action} for ${selectedDate.toDateString()}`);
                      setCentralDropdownOpen(false);
                    }}
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>

            <button 
              className="mt-6 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
              onClick={() => setCentralDropdownOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;