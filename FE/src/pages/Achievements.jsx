import React from 'react';
import BadgeCard from '../components/BadgeCard';
import './Achievements.css';

const Achievements = ({ user }) => {
  const defaultBadges = [
    {
      title: 'First Dream',
      description: 'Began your journey by creating your first dream!',
      icon: '🏅',
      requirementType: 'dream_created',
      requirementValue: 1
    },
    {
      title: '7 Day Streak',
      description: 'Kept the fire burning for 7 consecutive days!',
      icon: '🔥',
      requirementType: 'habit_streak',
      requirementValue: 7
    },
    {
      title: '30 Day Streak',
      description: 'Demonstrated incredible consistency for 30 days!',
      icon: '⚡',
      requirementType: 'habit_streak',
      requirementValue: 30
    },
    {
      title: '50% Completed',
      description: 'Crossed the halfway point of a dream roadmap!',
      icon: '📈',
      requirementType: 'progress_milestone',
      requirementValue: 50
    },
    {
      title: 'Dream Achieved',
      description: 'Reached 100% progress and completed your dream!',
      icon: '🏆',
      requirementType: 'dream_completed',
      requirementValue: 100
    }
  ];

  const earnedBadges = user?.badges || [];

  return (
    <div className="achievements-page-container fade-in">
      <header className="achievements-header">
        <h1>Your Achievements</h1>
        <p className="welcome-sub">Unlocked milestones marking your progressive transformation.</p>
      </header>

      <div className="achievements-stats glass-panel">
        <div className="ach-stat-item">
          <span className="ach-stat-val">{earnedBadges.length} / {defaultBadges.length}</span>
          <span className="ach-stat-label">Badges Unlocked</span>
        </div>
        <div className="ach-stat-item">
          <span className="ach-stat-val">{Math.round((earnedBadges.length / defaultBadges.length) * 100)}%</span>
          <span className="ach-stat-label">Completion Rate</span>
        </div>
      </div>

      <div className="achievements-grid">
        {defaultBadges.map(badge => {
          const isUnlocked = earnedBadges.includes(badge.title);
          return (
            <BadgeCard 
              key={badge.title} 
              badge={badge} 
              isUnlocked={isUnlocked} 
            />
          );
        })}
      </div>
    </div>
  );
};

export default Achievements;
