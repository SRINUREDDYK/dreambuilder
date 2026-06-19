import React from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiTrash2, FiTrendingUp, FiCheckCircle } from 'react-icons/fi';
import './DreamCard.css';

const DreamCard = ({ dream, onDelete }) => {
  const getCategoryClass = (category) => {
    switch (category) {
      case 'Career': return 'cat-career';
      case 'Fitness': return 'cat-fitness';
      case 'Business': return 'cat-business';
      case 'Education': return 'cat-education';
      case 'Travel': return 'cat-travel';
      case 'Finance': return 'cat-finance';
      default: return '';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'priority-high';
      case 'Medium': return 'priority-medium';
      case 'Low': return 'priority-low';
      default: return '';
    }
  };

  return (
    <div className={`glass-panel dream-card-container ${dream.status === 'Completed' ? 'completed-dream-card' : ''}`}>
      <div className="dream-card-header">
        <span className={`category-badge ${getCategoryClass(dream.category)}`}>
          {dream.category}
        </span>
        <span className={`priority-indicator ${getPriorityColor(dream.priority)}`}>
          {dream.priority} Priority
        </span>
      </div>

      <div className="dream-card-body">
        <h3 className="dream-card-title">{dream.title}</h3>
        
        <div className="dream-meta-row">
          <div className="meta-item">
            <FiCalendar className="meta-icon" />
            <span>Target: {dream.targetDate}</span>
          </div>
          <div className="meta-item">
            <FiTrendingUp className="meta-icon" />
            <span>{dream.difficulty}</span>
          </div>
        </div>

        <div className="dream-progress-section">
          <div className="progress-text-row">
            <span>Progress</span>
            <span className="progress-percent-label">{dream.progress}%</span>
          </div>
          <div className="progress-bar-container">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${dream.progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="dream-card-footer">
        <Link to={`/dreams/${dream._id}`} className="btn btn-secondary view-roadmap-btn">
          {dream.status === 'Completed' ? (
            <>
              <FiCheckCircle className="success-icon" />
              <span>View Completed Roadmap</span>
            </>
          ) : (
            <span>Manage Roadmap</span>
          )}
        </Link>
        <button 
          onClick={(e) => {
            e.preventDefault();
            if (window.confirm(`Are you sure you want to delete "${dream.title}"?`)) {
              onDelete(dream._id);
            }
          }} 
          className="delete-card-btn"
          aria-label="Delete Dream"
        >
          <FiTrash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default DreamCard;
