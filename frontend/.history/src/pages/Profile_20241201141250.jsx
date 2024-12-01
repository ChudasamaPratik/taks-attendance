import React, { useState, useEffect } from "react";
import axios from "axios";

const ProfilePage = () => {
  const [salaryRecords, setSalaryRecords] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [formData, setFormData] = useState({
    baseSalary: "",
    deductions: "",
    month: "",
    notes: "",
  });

  useEffect(() => {
    fetchSalaryRecords();
  }, []);

  // Fetch salary records from the server
  const fetchSalaryRecords = async () => {
    try {
      const response = await axios.get("/api/salary");
      setSalaryRecords(response.data.salaries || []);
    } catch (error) {
      console.error("Error fetching salary records:", error);
    }
  };

  // Handle form submission for adding/updating a salary record
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentRecord) {
        // Update existing record
        await axios.put(`/api/salary/${currentRecord._id}`, formData);
      } else {
        // Add new record
        await axios.post("/api/salary", formData);
      }
      fetchSalaryRecords();
      setShowModal(false);
      setFormData({ baseSalary: "", deductions: "", month: "", notes: "" });
    } catch (error) {
      console.error("Error submitting salary form:", error);
    }
  };

  // Open modal for editing or adding a salary record
  const handleOpenModal = (record = null) => {
    setCurrentRecord(record);
    if (record) {
      setFormData({
        baseSalary: record.baseSalary,
        deductions: record.deductions,
        month: record.month,
        notes: record.notes,
      });
    } else {
      setFormData({ baseSalary: "", deductions: "", month: "", notes: "" });
    }
    setShowModal(true);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Profile Page</h2>

      {/* Profile Details */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Personal Details</h3>
        <p className="text-gray-600">Name: John Doe</p>
        <p className="text-gray-600">Email: john.doe@example.com</p>
      </div>

      {/* Salary Management Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Salary Management</h3>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded shadow mb-4"
          onClick={() => handleOpenModal()}
        >
          Add Salary Record
        </button>
        <table className="min-w-full bg-white border border-gray-200 rounded shadow">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Month</th>
              <th className="px-4 py-2 border-b">Base Salary</th>
              <th className="px-4 py-2 border-b">Deductions</th>
              <th className="px-4 py-2 border-b">Attendance-Based Amount</th>
              <th className="px-4 py-2 border-b">Total Salary</th>
              <th className="px-4 py-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {salaryRecords.map((record) => (
              <tr key={record._id}>
                <td className="px-4 py-2 border-b text-gray-600">{record.month}</td>
                <td className="px-4 py-2 border-b text-gray-600">{record.baseSalary}</td>
                <td className="px-4 py-2 border-b text-gray-600">{record.deductions}</td>
                <td className="px-4 py-2 border-b text-gray-600">{record.attendanceBasedAmount}</td>
                <td className="px-4 py-2 border-b text-gray-600">{record.totalSalary}</td>
                <td className="px-4 py-2 border-b">
                  <button
                    className="text-blue-500 underline mr-2"
                    onClick={() => handleOpenModal(record)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Adding/Editing Salary */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {currentRecord ? "Edit Salary Record" : "Add Salary Record"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Month</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded"
                  placeholder="e.g., December-2024"
                  value={formData.month}
                  onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Base Salary</label>
                <input
                  type="number"
                  className="w-full px-4 py-2 border rounded"
                  placeholder="Enter base salary"
                  value={formData.baseSalary}
                  onChange={(e) => setFormData({ ...formData, baseSalary: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Deductions</label>
                <input
                  type="number"
                  className="w-full px-4 py-2 border rounded"
                  placeholder="Enter deductions"
                  value={formData.deductions}
                  onChange={(e) => setFormData({ ...formData, deductions: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Notes</label>
                <textarea
                  className="w-full px-4 py-2 border rounded"
                  placeholder="Add notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
