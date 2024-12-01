import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

const Attendance = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Generate days for the current month
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    // Days to show from previous month
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
    const remainingDays = 42 - totalDays; // 6 rows * 7 columns
    for (let i = 1; i <= remainingDays; i++) {
      const nextMonthDay = new Date(year, month + 1, i);
      calendarDays.push({
        date: nextMonthDay,
        currentMonth: false
      });
    }
    
    return calendarDays;
  };

  // Navigate to previous month
  const handlePreviousMonth = () => {
    setCurrentDate(new Date(
      currentDate.getFullYear(), 
      currentDate.getMonth() - 1, 
      1
    ));
  };

  // Navigate to next month
  const handleNextMonth = () => {
    setCurrentDate(new Date(
      currentDate.getFullYear(), 
      currentDate.getMonth() + 1, 
      1
    ));
  };

  // Go to today
  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Sample dropdown actions (you can customize these)
  const sampleDropdownActions = [
    'Add Event',
    'Mark as Holiday',
    'Add Note',
    'Set Reminder'
  ];

  return (
    <div className="w-full h-screen p-4 bg-gray-100">
      {/* Header with navigation */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
            <span className="text-xl">&lt;</span>
          </Button>
          <Button variant="outline" size="icon" onClick={handleNextMonth}>
            <span className="text-xl">&gt;</span>
          </Button>
          <Button variant="outline" onClick={handleToday}>
            Today
          </Button>
        </div>
        
        {/* Month and Year Display */}
        <h2 className="text-2xl font-bold">
          {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
        </h2>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-2 text-center font-bold mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2 bg-gray-200">{day}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {generateCalendarDays().map((day, index) => (
          <DropdownMenu key={index}>
            <DropdownMenuTrigger asChild>
              <div 
                className={`
                  p-2 border text-center cursor-pointer 
                  ${day.currentMonth 
                    ? 'bg-white hover:bg-gray-50' 
                    : 'bg-gray-100 text-gray-400'}
                  ${day.date.toDateString() === new Date().toDateString() 
                    ? 'border-2 border-blue-500' 
                    : 'border'}
                `}
              >
                {day.date.getDate()}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {sampleDropdownActions.map((action) => (
                <DropdownMenuItem key={action} onSelect={() => alert(`${action} for ${day.date.toDateString()}`)}>
                  {action}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ))}
      </div>
    </div>
  );
};

export default Attendance;