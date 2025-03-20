import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import DoctorDashboard from './components/DocDashboard';
import { ToastContainer } from 'react-toastify';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/doctor" element={<DoctorDashboard />} />
      </Routes>
      <ToastContainer position="top-center" autoClose={5000} hideProgressBar />
    </Router>
  );
};

export default App;