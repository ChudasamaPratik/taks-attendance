import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState({
    name: '',
    email: '',
    department: '',
    position: '',
    startDate: '',
    phoneNumber: ''
  });

  // Simulate fetching user profile data
  useEffect(() => {
    // In a real application, replace this with an actual API call
    const fetchUserProfile = () => {
      const mockProfile = {
        name: 'John Doe',
        email: 'john.doe@company.com',
        department: 'Engineering',
        position: 'Software Developer',
        startDate: '2023-01-15',
        phoneNumber: '+1 (555) 123-4567'
      };
      setUserProfile(mockProfile);
    };

    fetchUserProfile();
  }, []);

  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center">My Profile</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Name</label>
            <p className="text-xl">{userProfile.name}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300">Email</label>
            <p className="text-xl">{userProfile.email}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300">Department</label>
            <p className="text-xl">{userProfile.department}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300">Position</label>
            <p className="text-xl">{userProfile.position}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300">Start Date</label>
            <p className="text-xl">{userProfile.startDate}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300">Phone Number</label>
            <p className="text-xl">{userProfile.phoneNumber}</p>
          </div>
        </div>
        
        <div className="mt-8 flex justify-center">
          <button 
            onClick={handleBack}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;