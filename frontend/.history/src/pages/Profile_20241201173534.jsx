import React, { useState, useEffect } from "react";
import axios from "axios";
import {  toast } from "react-hot-toast";
import NavButtons from "../components/NavButtons";

const ProfilePage = ({onLogout}) => {
    const [salaryRecords, setSalaryRecords] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentRecord, setCurrentRecord] = useState(null);
    const [formData, setFormData] = useState({
        baseSalary: "",
        deductions: "",
        month: "",
        notes: "",
    });

    const months = [
        "January-2024",
        "February-2024",
        "March-2024",
        "April-2024",
        "May-2024",
        "June-2024",
        "July-2024",
        "August-2024",
        "September-2024",
        "October-2024",
        "November-2024",
        "December-2024",
    ];

    useEffect(() => {
        fetchSalaryRecords();
    }, []);

    const fetchSalaryRecords = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get("http://localhost:5001/api/salary", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSalaryRecords(response.data.salaries || []);
        } catch (error) {
            console.error("Error fetching salary records:", error);
            toast.error("Failed to fetch salary records", );
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (currentRecord) {
                // Update the existing record
                await axios.put(`http://localhost:5001/api/salary/${currentRecord._id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                toast.success("Salary record updated successfully!", {
                    position: "top-right",
                    duration: 3000,
                });
            } else {
                // Add a new salary record
                await axios.post("http://localhost:5001/api/salary", formData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                toast.success("Salary record added successfully!", {
                    position: "top-right",
                    duration: 3000,
                });
            }
            fetchSalaryRecords();
            setShowModal(false);
            setFormData({ baseSalary: "", deductions: "", month: "", notes: "" });
        } catch (error) {
            console.error("Error submitting salary form:", error);
            toast.error("An error occurred while saving the salary record.", );
        }
    };

    const handleDelete = async (recordId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5001/api/salary/${recordId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchSalaryRecords();
            toast.success("Salary record deleted successfully!", );
        } catch (error) {
            console.error("Error deleting salary record:", error);
            toast.error("Failed to delete salary record", );
        }
    };

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
        <div className="min-h-screen bg-black text-white p-6">

            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded shadow"
                        onClick={() => handleOpenModal()}
                    >
                        Add Salary Record
                    </button>
                </div>

                <table className="w-full bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                    <thead>
                        <tr className="bg-gray-700">
                            <th className="py-3 px-4 text-left">Month</th>
                            <th className="py-3 px-4 text-left">Base Salary</th>
                            <th className="py-3 px-4 text-left">Deductions</th>
                            <th className="py-3 px-4 text-left">Attendance-Based Amount</th>
                            <th className="py-3 px-4 text-left">Total Salary</th>
                            <th className="py-3 px-4 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {salaryRecords.map((record) => (
                            <tr key={record._id} className="border-t border-gray-700">
                                <td className="py-3 px-4">{record.month}</td>
                                <td className="py-3 px-4">{record.baseSalary}</td>
                                <td className="py-3 px-4">{record.deductions}</td>
                                <td className="py-3 px-4">{record.attendanceBasedAmount}</td>
                                <td className="py-3 px-4">{record.totalSalary}</td>
                                <td className="py-3 px-4 space-x-2">
                                    <button
                                        className="text-blue-400 hover:underline"
                                        onClick={() => handleOpenModal(record)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="text-red-400 hover:underline"
                                        onClick={() => {
                                            // Add confirmation before deletion
                                            const confirmDelete = window.confirm(
                                                "Are you sure you want to delete this salary record?"
                                            );
                                            if (confirmDelete) {
                                                handleDelete(record._id);
                                            }
                                        }}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal for Adding/Editing Salary */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-900 p-6 rounded shadow w-full max-w-md">
                        <h3 className="text-xl font-semibold mb-4">
                            {currentRecord ? "Edit Salary Record" : "Add Salary Record"}
                        </h3>
                        <form onSubmit={handleSubmit}>
                            {/* Month Dropdown */}
                            <div className="mb-4">
                                <label className="block text-gray-400 mb-2">Month</label>
                                <select
                                    className="w-full px-4 py-2 bg-gray-800 text-white rounded border border-gray-700"
                                    value={formData.month}
                                    onChange={(e) =>
                                        setFormData({ ...formData, month: e.target.value })
                                    }
                                    required
                                >
                                    <option value="" disabled>
                                        Select a month
                                    </option>
                                    {months.map((month) => (
                                        <option key={month} value={month}>
                                            {month}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-400 mb-2">Base Salary</label>
                                <input
                                    type="number"
                                    className="w-full px-4 py-2 bg-gray-800 text-white rounded border border-gray-700"
                                    placeholder="Enter base salary"
                                    value={formData.baseSalary}
                                    onChange={(e) =>
                                        setFormData({ ...formData, baseSalary: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-400 mb-2">Deductions</label>
                                <input
                                    type="number"
                                    className="w-full px-4 py-2 bg-gray-800 text-white rounded border border-gray-700"
                                    placeholder="Enter deductions"
                                    value={formData.deductions}
                                    onChange={(e) =>
                                        setFormData({ ...formData, deductions: e.target.value })
                                    }
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-400 mb-2">Notes</label>
                                <textarea
                                    className="w-full px-4 py-2 bg-gray-800 text-white rounded border border-gray-700"
                                    placeholder="Add notes"
                                    value={formData.notes}
                                    onChange={(e) =>
                                        setFormData({ ...formData, notes: e.target.value })
                                    }
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="bg-gray-600 text-gray-300 px-4 py-2 rounded mr-2"
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

            <div className="flex justify-center ">
                <NavButtons handleLogout={onLogout} /> 
            </div>
        </div>
    );
};

export default ProfilePage;