import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Fetch doctors from the backend
  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/admin/doctors', {
        headers: { Authorization: token },
      });
      setDoctors(res.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch doctors data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Approve a doctor
  const handleApprove = async (doctorId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/admin/approve/${doctorId}`,
        {},
        {
          headers: { Authorization: token },
        }
      );
      fetchDoctors(); // Refresh the list
    } catch (err) {
      setError('Failed to approve doctor');
      console.error(err);
    }
  };

  // Delete a doctor
  const handleDelete = async (doctorId) => {
    try {
      if (window.confirm('Are you sure you want to delete this doctor?')) {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/admin/delete/${doctorId}`, {
          headers: { Authorization: token },
        });
        fetchDoctors(); // Refresh the list
      }
    } catch (err) {
      setError('Failed to delete doctor');
      console.error(err);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Filter doctors based on search term
  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.hospital_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Separate doctors into pending and approved
  const pendingDoctors = filteredDoctors.filter((doctor) => !doctor.approved);
  const approvedDoctors = filteredDoctors.filter((doctor) => doctor.approved);

  // Render the doctors table
  const renderDoctorTable = (doctorsList, showApproveButton) => {
    if (doctorsList.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-32">
          <p className="text-gray-500">No doctors found</p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hospital</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {doctorsList.map((doctor) => (
              <tr key={doctor._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{doctor.username}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doctor.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doctor.hospital_name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doctor.contact_number}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  {showApproveButton && (
                    <button
                      onClick={() => handleApprove(doctor._id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md transition duration-200"
                    >
                      Approve
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(doctor._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition duration-200"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Fetch doctors on component mount
  useEffect(() => {
    fetchDoctors();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white mb-4 md:mb-0">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search doctors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg border-0 focus:ring-2 focus:ring-blue-400 focus:outline-none w-full"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 absolute left-3 top-2.5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Refresh Button */}
            <button
              onClick={fetchDoctors}
              className="bg-white text-purple-700 px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition duration-200 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition duration-200 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow">
            <p>{error}</p>
          </div>
        )}

        {/* Pending Approval Section */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden mb-6">
          <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
            <h2 className="text-xl font-semibold text-blue-800">Doctors Requiring Approval</h2>
          </div>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            renderDoctorTable(pendingDoctors, true)
          )}
          {!loading && pendingDoctors.length > 0 && (
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Showing {pendingDoctors.length} doctors pending approval
              </p>
            </div>
          )}
        </div>

        {/* Approved Doctors Section */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="bg-green-50 px-6 py-4 border-b border-green-100">
            <h2 className="text-xl font-semibold text-green-800">Approved Doctors</h2>
          </div>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            renderDoctorTable(approvedDoctors, false)
          )}
          {!loading && approvedDoctors.length > 0 && (
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Showing {approvedDoctors.length} approved doctors
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;