import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DoctorDashboard = () => {
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    hospital_name: '',
    contact_number: '',
    approved: false
  });
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/doctor/profile', {
        headers: { Authorization: token }
      });
      setProfile(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load profile information');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploadStatus('');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setUploadStatus('Please select a file to upload');
      return;
    }

    if (!profile.approved) {
      setUploadStatus('Your account is not approved yet. Please wait for admin approval.');
      return;
    }

    try {
      setUploadStatus('Uploading...');
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', file);

      await axios.post('http://localhost:5000/doctor/upload', formData, {
        headers: {
          Authorization: token,
          'Content-Type': 'multipart/form-data'
        }
      });

      setUploadStatus('File uploaded successfully!');
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setUploadStatus(err.response?.data?.message || 'Upload failed');
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
      
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-cyan-600 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">Doctor Dashboard</h1>
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
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow">
            <p>{error}</p>
          </div>
        )}

        {!profile.approved && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded shadow">
            <p className="font-medium">Your account is pending approval</p>
            <p>You will be able to upload files once an administrator approves your account.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Section */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-blue-600 px-6 py-4">
              <h2 className="text-xl font-semibold text-white">My Profile</h2>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-blue-100 rounded-full p-6">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-16 w-16 text-blue-600" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                    />
                  </svg>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Username</label>
                  <p className="text-gray-900 font-medium">{profile.username}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900">{profile.email}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500">Hospital</label>
                  <p className="text-gray-900">{profile.hospital_name}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500">Contact Number</label>
                  <p className="text-gray-900">{profile.contact_number}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500">Status</label>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    profile.approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {profile.approved ? 'Approved' : 'Pending Approval'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* File Upload Section */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-blue-600 px-6 py-4">
              <h2 className="text-xl font-semibold text-white">Upload Files</h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleUpload}>
                <div className="mb-6">
                  <label 
                    htmlFor="file-upload" 
                    className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 ${
                      profile.approved ? 'border-blue-300' : 'border-gray-300 opacity-60'
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-10 w-10 text-blue-500 mb-3" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                        />
                      </svg>
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        {file ? file.name : 'Supported file types: JPG, PNG, PDF'}
                      </p>
                    </div>
                    <input 
                      id="file-upload" 
                      type="file" 
                      className="hidden" 
                      onChange={handleFileChange}
                      ref={fileInputRef}
                      disabled={!profile.approved}
                    />
                  </label>
                </div>

                {uploadStatus && (
                  <div className={`p-4 mb-4 rounded ${
                    uploadStatus.includes('success') 
                      ? 'bg-green-100 text-green-700' 
                      : uploadStatus === 'Uploading...' 
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-red-100 text-red-700'
                  }`}>
                    {uploadStatus}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!profile.approved || !file}
                  className={`w-full py-2 px-4 rounded-md ${
                    profile.approved && file
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  } transition duration-200`}
                >
                  Upload File
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;