// src/pages/Task.jsx
import React, { useState } from 'react';
import NavButtons from '../components/NavButtons';

const Task = () => {
    const [tasks, setTasks] = useState([
        { title: 'Design Homepage', dueDate: '2023-11-05', status: 'In Progress' },
        { title: 'Fix Login Bug', dueDate: '2023-11-03', status: 'Completed' },
        { title: 'Prepare Presentation', dueDate: '2023-11-10', status: 'Pending' },
    ]);

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
            <h2 className="text-4xl font-bold mb-6 text-sky-500 drop-shadow-lg">Task Management</h2>
            <div className="w-full max-w-lg bg-gray-800 rounded-lg shadow-lg p-6 space-y-4">
                {tasks.map((task, index) => (
                    <div key={index} className="p-4 bg-gray-700 rounded-md shadow-md">
                        <h3 className="text-2xl font-semibold text-white">{task.title}</h3>
                        <p className="text-sm text-gray-400">Due Date: {task.dueDate}</p>
                        <p className={`mt-1 font-medium ${task.status === 'Completed' ? 'text-green-500' : task.status === 'Pending' ? 'text-yellow-500' : 'text-sky-500'}`}>
                            Status: {task.status}
                        </p>
                    </div>
                ))}
            </div>
            <NavButtons /> {/* Add NavButtons here */}
        </div>
    );
};

export default Task;
