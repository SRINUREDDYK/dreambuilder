import React, { useState, useEffect, useCallback } from 'react';
import { FiPlus } from 'react-icons/fi';
import API from '../services/api';
import HabitCard from '../components/HabitCard';
import './Habits.css';

const Habits = () => {
  const [habits, setHabits] = useState([]);
  const [title, setTitle] = useState('');
  const [frequency, setFrequency] = useState('Daily');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchHabits = useCallback(async () => {
    try {
      setLoading(true);
      const response = await API.get('/habits');
      setHabits(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch habits. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    setError('');
    try {
      const response = await API.post('/habits', { title, frequency });
      setHabits(prev => [response.data, ...prev]);
      setTitle('');
    } catch (err) {
      console.error(err);
      setError('Failed to create habit.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCheckIn = async (habitId) => {
    try {
      const response = await API.put(`/habits/${habitId}/checkin`);
      setHabits(prev => prev.map(h => h._id === habitId ? response.data.habit : h));
      if (response.data.newBadges?.length > 0) {
        alert(`🏆 Achievement Unlocked: ${response.data.newBadges.join(', ')}! Check the Achievements tab!`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (habitId) => {
    try {
      await API.delete(`/habits/${habitId}`);
      setHabits(prev => prev.filter(h => h._id !== habitId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="habits-page-container fade-in">
      <header className="habits-header">
        <div>
          <h1>Habits & Consistency</h1>
          <p className="welcome-sub">Map daily action triggers that keep your roadmaps moving.</p>
        </div>
      </header>

      {error && <div className="habits-error-alert">{error}</div>}

      <div className="habits-workspace">
        {/* Habit Form Panel */}
        <div className="glass-panel habit-form-panel">
          <h3>⚡ Build a New Habit</h3>
          <form onSubmit={handleSubmit} className="habit-creation-form">
            <div className="form-group">
              <label htmlFor="habit-title">What habit do you want to build?</label>
              <input 
                type="text" 
                id="habit-title"
                className="input-field"
                placeholder="e.g. Read 10 Pages, Meditate 15 mins, Drink 3L Water"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="habit-frequency">Frequency</label>
              <select 
                id="habit-frequency"
                className="input-field select-field"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
              >
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary submit-habit-btn" disabled={submitting}>
              {submitting ? 'Creating...' : (
                <>
                  <FiPlus size={16} /> <span>Start Habit</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Habits Checklist */}
        <div className="habits-list-section">
          <h2>Active Habits</h2>
          {loading ? (
            <div className="loading-state">Accessing habits tracker...</div>
          ) : habits.length === 0 ? (
            <div className="empty-habits glass-panel">
              <span className="empty-emoji">📝</span>
              <h3>No habits tracked yet</h3>
              <p>Habits are the compound interest of self-improvement. Create your first habit above!</p>
            </div>
          ) : (
            <div className="habits-cards-grid">
              {habits.map(habit => (
                <HabitCard 
                  key={habit._id} 
                  habit={habit} 
                  onCheckIn={handleCheckIn}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Habits;
