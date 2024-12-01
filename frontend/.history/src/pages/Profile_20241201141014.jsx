import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const navigate = useNavigate();
    const [userProfile, setUserProfile] = useState({
        name: 'John Doe',
        email: 'john.doe@company.com',
        department: 'Engineering',
        position: 'Software Developer',
        startDate: '2023-01-15',
        employeeId: 'EMP-001',
        phoneNumber: '+1 (555) 123-4567',
        address: '123 Tech Lane, Silicon Valley, CA 94000'
    });

    const handleBack = () => {
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-md">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold">My Profile</h2>
                    <button
                        onClick={handleBack}
                        className="text-blue-500 hover:text-blue-400 transition-colors"
                    >
                        Back to Dashboard
                    </button>
                </div>

                <div className="space-y-4">
                    <ProfileField label="Name" value={userProfile.name} />
                    <ProfileField label="Employee ID" value={userProfile.employeeId} />
                    <ProfileField label="Email" value={userProfile.email} />
                    <ProfileField label="Department" value={userProfile.department} />
                    <ProfileField label="Position" value={userProfile.position} />
                    <ProfileField label="Start Date" value={userProfile.startDate} />
                    <ProfileField label="Phone Number" value={userProfile.phoneNumber} />
                    <ProfileField label="Address" value={userProfile.address} />
                </div>

                <div className="mt-8 flex justify-center">
                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
                    >
                        Edit Profile
                    </button>
                </div>
            </div>
        </div>
    );
};

// Reusable component for profile fields
const ProfileField = ({ label, value }) => (
    <div>
        <label className="block text-sm font-medium text-gray-400">{label}</label>
        <p className="text-xl">{value}</p>
    </div>
);

export default Profile;