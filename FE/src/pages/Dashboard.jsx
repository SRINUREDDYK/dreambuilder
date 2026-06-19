import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiCompass, FiAward, FiCheckSquare, FiTrendingUp } from 'react-icons/fi';
import API from '../services/api';
import QuoteCard from '../components/QuoteCard';
import HabitCard from '../components/HabitCard';
import ProgressChart from '../components/ProgressChart';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, habitsRes] = await Promise.all([
        API.get('/analytics'),
        API.get('/habits')
      ]);
      setStats(analyticsRes.data);
      setHabits(habitsRes.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleHabitCheckIn = async (habitId) => {
    try {
      const response = await API.put(`/habits/${habitId}/checkin`);
      // Update local habits state
      setHabits(prev => prev.map(h => h._id === habitId ? response.data.habit : h));
      
      // Refresh analytics to update streaks/completion count
      const analyticsRes = await API.get('/analytics');
      setStats(analyticsRes.data);

      if (response.data.newBadges?.length > 0) {
        alert(`🏆 Achievement Unlocked: ${response.data.newBadges.join(', ')}! Check the Achievements tab!`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleHabitDelete = async (habitId) => {
    try {
      await API.delete(`/habits/${habitId}`);
      setHabits(prev => prev.filter(h => h._id !== habitId));
      const analyticsRes = await API.get('/analytics');
      setStats(analyticsRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="loading-state">Syncing your progress...</div>;
  if (error) return <div className="error-state">{error}</div>;

  // Compile Chart Data
  const weeklyData = stats?.weeklyCompletions ? {
    labels: stats.weeklyCompletions.map(w => w.dayName),
    datasets: [
      {
        label: 'Completions (%)',
        data: stats.weeklyCompletions.map(w => w.rate),
        fill: true,
        backgroundColor: 'rgba(99, 102, 241, 0.15)',
        borderColor: '#6366f1',
        tension: 0.3,
        borderWidth: 2,
        pointBackgroundColor: '#8b5cf6',
        pointBorderColor: '#ffffff',
        pointRadius: 4
      }
    ]
  } : null;

  return (
    <div className="dashboard-container fade-in">
      <header className="dashboard-header">
        <div>
          <h1>Your Workspace</h1>
          <p className="welcome-sub">Small choices define your trajectory. Keep building.</p>
        </div>
      </header>

      {/* Overview Cards */}
      <section className="stats-row">
        <div className="glass-panel stat-card">
          <div className="stat-icon-wrapper box-indigo">
            <FiCompass size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Active Dreams</span>
            <span className="stat-value">{stats?.summary.activeDreams || 0}</span>
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-icon-wrapper box-success">
            <FiCheckSquare size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Overall Progress</span>
            <span className="stat-value">{stats?.summary.avgProgress || 0}%</span>
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-icon-wrapper box-violet">
            <FiTrendingUp size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Streak Value</span>
            <span className="stat-value">🔥 {stats?.summary.maxStreak || 0} Days</span>
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-icon-wrapper box-rose">
            <FiAward size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Completed Goals</span>
            <span className="stat-value">{stats?.summary.completedDreams || 0}</span>
          </div>
        </div>
      </section>

      {/* Grid Dashboard */}
      <div className="dashboard-grid">
        {/* Left column: Quotes, habits checklist */}
        <div className="dashboard-main-col">
          <QuoteCard />

          <div className="glass-panel habits-checklist-section">
            <div className="section-header-row">
              <h3>Today's Habit Checklist</h3>
              <Link to="/habits" className="btn btn-secondary btn-icon-only">
                <FiPlus size={16} /> Add Habit
              </Link>
            </div>
            
            {habits.length === 0 ? (
              <div className="empty-checklist">
                <p>No habits tracked yet.</p>
                <Link to="/habits" className="btn btn-primary btn-sm">Create First Habit</Link>
              </div>
            ) : (
              <div className="checklist-items">
                {habits.map(habit => (
                  <HabitCard 
                    key={habit._id} 
                    habit={habit} 
                    onCheckIn={handleHabitCheckIn}
                    onDelete={handleHabitDelete}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column: Charts, Achievements */}
        <div className="dashboard-side-col">
          <div className="glass-panel chart-widget">
            <h3>Habit Completion Trend</h3>
            <div className="chart-container">
              {weeklyData ? (
                <ProgressChart type="line" data={weeklyData} />
              ) : (
                <p className="no-chart-data">No history available yet.</p>
              )}
            </div>
          </div>

          <div className="glass-panel quick-achievements-widget">
            <div className="section-header-row">
              <h3>Achievements Log</h3>
              <Link to="/achievements" className="view-all-link">View All</Link>
            </div>
            <div className="achievements-preview-list">
              <div className="quick-badge-preview">
                <span className="preview-badge-emoji">🏅</span>
                <div>
                  <h4>First Dream</h4>
                  <p>Unlocks when your first dream is mapped.</p>
                </div>
              </div>
              <div className="quick-badge-preview">
                <span className="preview-badge-emoji">🔥</span>
                <div>
                  <h4>7 Day Streak</h4>
                  <p>Unlocks when habits hit a 7-day streak.</p>
                </div>
              </div>
              <div className="quick-badge-preview font-locked">
                <span className="preview-badge-emoji">🏆</span>
                <div>
                  <h4>Dream Achieved</h4>
                  <p>Unlocks when goal progress is 100%.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
