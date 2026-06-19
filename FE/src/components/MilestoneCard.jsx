import React from 'react';
import { FiCheck, FiTrash2 } from 'react-icons/fi';
import './MilestoneCard.css';

const MilestoneCard = ({ milestone, onToggle, onDelete }) => {
  return (
    <div className={`milestone-item ${milestone.isCompleted ? 'completed' : ''}`}>
      <button 
        onClick={() => onToggle(milestone._id)} 
        className={`milestone-checkbox ${milestone.isCompleted ? 'checked' : ''}`}
        aria-label="Toggle Complete"
      >
        {milestone.isCompleted && <FiCheck size={14} className="checkmark-icon" />}
      </button>

      <div className="milestone-content">
        <span className="milestone-phase">{milestone.month_or_phase}</span>
        <h4 className="milestone-title">{milestone.title}</h4>
      </div>

      {onDelete && (
        <button 
          onClick={() => {
            if (window.confirm('Delete this milestone?')) {
              onDelete(milestone._id);
            }
          }} 
          className="milestone-delete-btn"
          aria-label="Delete Milestone"
        >
          <FiTrash2 size={14} />
        </button>
      )}
    </div>
  );
};

export default MilestoneCard;
