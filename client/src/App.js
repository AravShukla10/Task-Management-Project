/* src/App.js */
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import './App.css';
import { ToastContainer } from 'react-toastify';
import React, { useEffect, useState } from 'react';

function App() {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  useEffect(() => {

    setUser(localStorage.getItem('user'))



  }, []);
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup setUser={setUser} />} />
        <Route path="/dashboard" element={<Dashboard user={user} />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </div>
  );
}

// Wrap App with Router to access useNavigate
export default function WrappedApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}