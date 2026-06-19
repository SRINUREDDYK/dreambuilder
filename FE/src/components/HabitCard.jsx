import React from 'react';
import { FiCheck, FiTrash2 } from 'react-icons/fi';
import './HabitCard.css';

const HabitCard = ({ habit, onCheckIn, onDelete }) => {
  const tzOffset = (new Date()).getTimezoneOffset() * 60000;
  const todayStr = new Date(Date.now() - tzOffset).toISOString().slice(0, 10);
  const isCompletedToday = habit.history && habit.history.includes(todayStr);

  return (
    <div className={`glass-panel habit-card-container ${isCompletedToday ? 'completed-habit' : ''}`}>
      <div className="habit-card-left">
        <button 
          onClick={() => onCheckIn(habit._id)} 
          className={`habit-check-btn ${isCompletedToday ? 'checked' : ''}`}
          aria-label="Toggle Complete Today"
        >
          {isCompletedToday ? <FiCheck size={18} /> : <FiCheck size={18} className="placeholder-check" />}
        </button>

        <div className="habit-details">
          <h3 className="habit-title">{habit.title}</h3>
          <span className="habit-freq">{habit.frequency}</span>
        </div>
      </div>

      <div className="habit-card-right">
        {habit.streak > 0 && (
          <div className="habit-streak-badge">
            <span className="streak-flame">🔥</span>
            <span className="streak-count">{habit.streak} Days</span>
          </div>
        )}
        
        <button 
          onClick={() => {
            if (window.confirm(`Are you sure you want to delete "${habit.title}"?`)) {
              onDelete(habit._id);
            }
          }} 
          className="habit-delete-btn"
          aria-label="Delete Habit"
        >
          <FiTrash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default HabitCard;
