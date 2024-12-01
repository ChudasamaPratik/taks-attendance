import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { 
  Edit2, 
  Trash2, 
  PlusCircle, 
  ChevronDown, 
  DollarSign, 
  FileText 
} from "lucide-react";
import NavButtons from "../components/NavButtons";

const ProfilePage = ({ onLogout }) => {
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
        "January-2024", "February-2024", "March-2024", "April-2024", 
        "May-2024", "June-2024", "July-2024", "August-2024", 
        "September-2024", "October-2024", "November-2024", "December-2024",
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
            const errorMsg = error.response?.data?.message || "Failed to fetch salary records";
            console.error("Error fetching salary records:", error);
            toast.error(errorMsg);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            let response;
            if (currentRecord) {
                response = await axios.put(`http://localhost:5001/api/salary/${currentRecord._id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            } else {
                response = await axios.post("http://localhost:5001/api/salary", formData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
            }

            const successMsg = response.data.message || 
                (currentRecord ? "Salary record updated successfully!" : "Salary record added successfully!");
            
            toast.success(successMsg, {
                position: "top-right",
                duration: 3000,
            });

            fetchSalaryRecords();
            setShowModal(false);
            setFormData({ baseSalary: "", deductions: "", month: "", notes: "" });
        } catch (error) {
            const errorMsg = error.response?.data?.message || 
                "An error occurred while saving the salary record.";
            console.error("Error submitting salary form:", error);
            toast.error(errorMsg);
        }
    };

    const handleDelete = async (recordId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`http://localhost:5001/api/salary/${recordId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const successMsg = response.data.message || "Salary record deleted successfully!";
            
            toast.success(successMsg);
            fetchSalaryRecords();
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Failed to delete salary record";
            console.error("Error deleting salary record:", error);
            toast.error(errorMsg);
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

    const calculateNetSalary = (baseSalary, deductions) => {
        return (parseFloat(baseSalary) - parseFloat(deductions || 0)).toLocaleString();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    <header className="mb-8 flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-blue-400">Salary Tracker</h1>
                        <button
                            className="flex items-center bg-blue-600 hover:bg-blue-700 
                                       text-white px-4 py-2 rounded-lg transition duration-300 
                                       transform hover:scale-105 shadow-lg"
                            onClick={() => handleOpenModal()}
                        >
                            <PlusCircle className="mr-2" size={20} />
                            Add Salary Record
                        </button>
                    </header>

                    <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-700">
                                    <tr>
                                        <th className="py-4 px-6 text-left">
                                            <div className="flex items-center">
                                                <ChevronDown className="mr-2" size={16} />
                                                Month
                                            </div>
                                        </th>
                                        <th className="py-4 px-6 text-left">
                                            <div className="flex items-center">
                                                <DollarSign className="mr-2" size={16} />
                                                Base Salary
                                            </div>
                                        </th>
                                        <th className="py-4 px-6 text-left">
                                            <div className="flex items-center">
                                                <Trash2 className="mr-2" size={16} />
                                                Deductions
                                            </div>
                                        </th>
                                        <th className="py-4 px-6 text-left">
                                            <div className="flex items-center">
                                                <DollarSign className="mr-2" size={16} />
                                                Net Salary
                                            </div>
                                        </th>
                                        <th className="py-4 px-6 text-left">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {salaryRecords.map((record) => (
                                        <tr 
                                            key={record._id} 
                                            className="border-t border-gray-700 hover:bg-gray-700/50 transition duration-200"
                                        >
                                            <td className="py-4 px-6">{record.month}</td>
                                            <td className="py-4 px-6">₹{record.baseSalary.toLocaleString()}</td>
                                            <td className="py-4 px-6">₹{record.deductions?.toLocaleString() || '0'}</td>
                                            <td className="py-4 px-6 font-semibold text-green-400">
                                                ₹{calculateNetSalary(record.baseSalary, record.deductions)}
                                            </td>
                                            <td className="py-4 px-6 space-x-3">
                                                <button
                                                    className="text-blue-400 hover:text-blue-300 
                                                               flex items-center transition duration-300"
                                                    onClick={() => handleOpenModal(record)}
                                                >
                                                    <Edit2 size={16} className="mr-1" /> Edit
                                                </button>
                                                <button
                                                    className="text-red-400 hover:text-red-300 
                                                               flex items-center transition duration-300"
                                                    onClick={() => {
                                                        const confirmDelete = window.confirm(
                                                            "Are you sure you want to delete this salary record?"
                                                        );
                                                        if (confirmDelete) {
                                                            handleDelete(record._id);
                                                        }
                                                    }}
                                                >
                                                    <Trash2 size={16} className="mr-1" /> Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Modal remains mostly the same, with some styling updates */}
                    {showModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                            <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md border-2 border-blue-600/50">
                                <h3 className="text-2xl font-bold mb-6 text-blue-400 flex items-center">
                                    <FileText className="mr-3" size={24} />
                                    {currentRecord ? "Edit Salary Record" : "Add Salary Record"}
                                </h3>
                                <form onSubmit={handleSubmit}>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-gray-300 mb-2 flex items-center">
                                                <ChevronDown className="mr-2" size={16} />
                                                Month
                                            </label>
                                            <select
                                                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg 
                                                           border border-gray-600 focus:ring-2 focus:ring-blue-500"
                                                value={formData.month}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, month: e.target.value })
                                                }
                                                required
                                            >
                                                <option value="" disabled>Select a month</option>
                                                {months.map((month) => (
                                                    <option key={month} value={month}>
                                                        {month}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-gray-300 mb-2 flex items-center">
                                                <DollarSign className="mr-2" size={16} />
                                                Base Salary
                                            </label>
                                            <input
                                                type="number"
                                                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg 
                                                           border border-gray-600 focus:ring-2 focus:ring-blue-500"
                                                placeholder="Enter base salary"
                                                value={formData.baseSalary}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, baseSalary: e.target.value })
                                                }
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-gray-300 mb-2 flex items-center">
                                                <Trash2 className="mr-2" size={16} />
                                                Deductions
                                            </label>
                                            <input
                                                type="number"
                                                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg 
                                                           border border-gray-600 focus:ring-2 focus:ring-blue-500"
                                                placeholder="Enter deductions"
                                                value={formData.deductions}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, deductions: e.target.value })
                                                }
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-gray-300 mb-2 flex items-center">
                                                <FileText className="mr-2" size={16} />
                                                Notes
                                            </label>
                                            <textarea
                                                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg 
                                                           border border-gray-600 focus:ring-2 focus:ring-blue-500"
                                                placeholder="Add notes"
                                                value={formData.notes}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, notes: e.target.value })
                                                }
                                            />
                                        </div>

                                        <div className="flex justify-end space-x-4 mt-6">
                                            <button
                                                type="button"
                                                className="bg-gray-600 text-gray-300 px-4 py-2 rounded-lg 
                                                           hover:bg-gray-700 transition duration-300"
                                                onClick={() => setShowModal(false)}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="bg-blue-600 text-white px-4 py-2 rounded-lg 
                                                           hover:bg-blue-700 transition duration-300 
                                                           transform hover:scale-105"
                                            >
                                                Save
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-center mt-8">
                        <NavButtons handleLogout={onLogout} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;