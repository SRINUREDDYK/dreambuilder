import React from 'react';
import './BadgeCard.css';

const BadgeCard = ({ badge, isUnlocked }) => {
  return (
    <div className={`glass-panel badge-card-container ${isUnlocked ? 'unlocked' : 'locked'}`}>
      <div className="badge-icon-wrapper">
        <span className="badge-emoji">{badge.icon || '🏅'}</span>
      </div>
      
      <div className="badge-info">
        <h4 className="badge-title">{badge.title}</h4>
        <p className="badge-description">{badge.description}</p>
      </div>

      <div className="badge-status-pill">
        {isUnlocked ? 'Unlocked' : 'Locked'}
      </div>
    </div>
  );
};

export default BadgeCard;
