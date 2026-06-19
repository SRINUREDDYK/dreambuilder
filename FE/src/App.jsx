import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Dreams from './pages/Dreams';
import DreamDetail from './pages/DreamDetail';
import Habits from './pages/Habits';
import Analytics from './pages/Analytics';
import Achievements from './pages/Achievements';
import Profile from './pages/Profile';
import API from './services/api';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user profile on mount if token exists
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await API.get('/auth/profile');
          setUser(response.data);
        } catch (err) {
          console.error('Error fetching user profile:', err);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const handleLogin = (userData) => {
    localStorage.setItem('token', userData.token);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="loading-state" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Initialising DreamBuilder...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Navbar user={user} handleLogout={handleLogout} />
      <div className="app-container">
        <Sidebar user={user} />
        <main className={`main-content ${!user ? 'no-sidebar' : ''}`}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home user={user} />} />
            <Route 
              path="/login" 
              element={!user ? <Login handleLogin={handleLogin} /> : <Navigate to="/dashboard" />} 
            />
            <Route 
              path="/register" 
              element={!user ? <Register handleLogin={handleLogin} /> : <Navigate to="/dashboard" />} 
            />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={user ? <Dashboard /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/dreams" 
              element={user ? <Dreams /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/dreams/:id" 
              element={user ? <DreamDetail /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/habits" 
              element={user ? <Habits /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/analytics" 
              element={user ? <Analytics /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/achievements" 
              element={user ? <Achievements user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/profile" 
              element={user ? <Profile user={user} handleLogin={handleLogin} /> : <Navigate to="/login" />} 
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
