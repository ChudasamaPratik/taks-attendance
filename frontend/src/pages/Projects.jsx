// src/pages/Projects.jsx
import React, { useState } from 'react';
import NavButtons from '../components/NavButtons';

const Projects = () => {
    const [projects, setProjects] = useState([
        { name: 'Website Redesign', description: 'Complete overhaul of the company website.', status: 'In Progress' },
        { name: 'Marketing Campaign', description: 'Create social media content for new product.', status: 'Planning' },
        { name: 'Backend Optimization', description: 'Improve API performance by 30%.', status: 'Completed' },
    ]);

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
            <h2 className="text-4xl font-bold mb-6 text-sky-500 drop-shadow-lg">Projects</h2>
            <div className="w-full max-w-lg space-y-4">
                {projects.map((project, index) => (
                    <div key={index} className="p-6 bg-gray-800 rounded-lg shadow-md">
                        <h3 className="text-2xl font-semibold text-sky-500">{project.name}</h3>
                        <p className="text-gray-300 mt-1">{project.description}</p>
                        <p className={`mt-2 font-medium ${project.status === 'Completed' ? 'text-green-500' : project.status === 'In Progress' ? 'text-yellow-500' : 'text-gray-500'}`}>
                            Status: {project.status}
                        </p>
                    </div>
                ))}
            </div>
            <NavButtons /> {/* Add NavButtons here */}
        </div>
    );
};

export default Projects;
