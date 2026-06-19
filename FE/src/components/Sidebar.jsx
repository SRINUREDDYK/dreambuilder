import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiActivity, FiCompass, FiCheckSquare, FiTrendingUp, FiAward, FiSettings } from 'react-icons/fi';
import './Sidebar.css';

const Sidebar = ({ user }) => {
  if (!user) return null;

  return (
    <aside className="sidebar-container">
      <div className="sidebar-links">
        <NavLink to="/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <FiActivity size={20} />
          <span className="link-text">Dashboard</span>
        </NavLink>

        <NavLink to="/dreams" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <FiCompass size={20} />
          <span className="link-text">My Dreams</span>
        </NavLink>

        <NavLink to="/habits" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <FiCheckSquare size={20} />
          <span className="link-text">Habit Tracker</span>
        </NavLink>

        <NavLink to="/analytics" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <FiTrendingUp size={20} />
          <span className="link-text">Analytics</span>
        </NavLink>

        <NavLink to="/achievements" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <FiAward size={20} />
          <span className="link-text">Achievements</span>
        </NavLink>

        <NavLink to="/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <FiSettings size={20} />
          <span className="link-text">Profile Settings</span>
        </NavLink>
      </div>

      <div className="sidebar-footer">
        <div className="avatar-section">
          <div className="avatar-placeholder">
            {user.username.substring(0, 2).toUpperCase()}
          </div>
          <div className="avatar-info">
            <h4 className="avatar-name">{user.username}</h4>
            <span className="avatar-role">Dreamer</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
