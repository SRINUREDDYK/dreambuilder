import React, { useState } from 'react';
import { FiUser, FiMail, FiLock, FiCheck } from 'react-icons/fi';
import API from '../services/api';
import './Profile.css';

const Profile = ({ user, handleLogin }) => {
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const payload = { username, email };
      if (password) {
        payload.password = password;
      }
      const response = await API.put('/auth/profile', payload);
      handleLogin(response.data);
      setMessage('Profile updated successfully!');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page-container fade-in">
      <header className="profile-header">
        <h1>Profile & Security Settings</h1>
        <p className="welcome-sub">Customize your digital identity and account credentials.</p>
      </header>

      <div className="profile-workspace">
        <div className="glass-panel profile-card">
          <div className="profile-avatar-large">
            {user?.username ? user.username.substring(0, 2).toUpperCase() : 'DB'}
          </div>
          <h3>{user?.username}</h3>
          <p className="profile-role">Registered Dreamer</p>
          <span className="profile-joined">
            Joined: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
          </span>
        </div>

        <div className="glass-panel profile-settings-form-panel">
          <h3>Edit Details</h3>
          
          {error && <div className="profile-alert alert-error">{error}</div>}
          {message && <div className="profile-alert alert-success">{message}</div>}

          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="prof-username">
                <FiUser size={16} /> <span>Username</span>
              </label>
              <input 
                type="text" 
                id="prof-username" 
                className="input-field" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="prof-email">
                <FiMail size={16} /> <span>Email Address</span>
              </label>
              <input 
                type="email" 
                id="prof-email" 
                className="input-field" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <hr className="divider" />
            <h4 className="section-subtitle">Update Password (optional)</h4>

            <div className="form-group">
              <label htmlFor="prof-pass">
                <FiLock size={16} /> <span>New Password</span>
              </label>
              <input 
                type="password" 
                id="prof-pass" 
                className="input-field" 
                placeholder="Leave blank to keep current"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="prof-confirm">
                <FiLock size={16} /> <span>Confirm Password</span>
              </label>
              <input 
                type="password" 
                id="prof-confirm" 
                className="input-field" 
                placeholder="Leave blank to keep current"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary save-profile-btn" disabled={loading}>
              {loading ? 'Saving...' : (
                <>
                  <FiCheck size={18} /> <span>Save Changes</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
