import React, { useState, useEffect } from 'react';
import { FiTrendingUp, FiCheckSquare, FiAward, FiPieChart } from 'react-icons/fi';
import API from '../services/api';
import ProgressChart from '../components/ProgressChart';
import './Analytics.css';

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await API.get('/analytics');
        setData(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load analytics data.');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div className="loading-state">Crunching statistics...</div>;
  if (error) return <div className="error-state">{error}</div>;
  if (!data) return <div className="error-state">No data available.</div>;

  const { summary, categoryStats, weeklyCompletions, monthlyProgress } = data;

  // Chart 1: Habit completion rate over past 7 days (Line Chart)
  const lineChartData = {
    labels: weeklyCompletions.map(w => w.dayName),
    datasets: [
      {
        label: 'Completion Rate (%)',
        data: weeklyCompletions.map(w => w.rate),
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
  };

  // Chart 2: Category Distribution (Doughnut Chart)
  const categoryLabels = Object.keys(categoryStats);
  const categoryValues = Object.values(categoryStats);
  const doughnutChartData = {
    labels: categoryLabels,
    datasets: [
      {
        data: categoryValues,
        backgroundColor: [
          '#6366f1', // Career (Indigo)
          '#10b981', // Fitness (Emerald)
          '#f59e0b', // Business (Amber)
          '#06b6d4', // Education (Cyan)
          '#ec4899', // Travel (Pink)
          '#8b5cf6'  // Finance (Violet)
        ],
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)'
      }
    ]
  };

  // Chart 3: Dream Velocity (Bar Chart)
  const barChartData = {
    labels: monthlyProgress.map(m => m.name),
    datasets: [
      {
        label: 'Average Goal Progress (%)',
        data: monthlyProgress.map(m => m.progress),
        backgroundColor: 'rgba(139, 92, 246, 0.65)',
        borderColor: '#8b5cf6',
        borderWidth: 1,
        borderRadius: 4
      }
    ]
  };

  return (
    <div className="analytics-page-container fade-in">
      <header className="analytics-header">
        <h1>Analytics Workspace</h1>
        <p className="welcome-sub">Insightful breakdowns of your daily discipline and long-term velocity.</p>
      </header>

      {/* Summary Cards */}
      <section className="stats-row">
        <div className="glass-panel stat-card">
          <div className="stat-icon-wrapper box-indigo">
            <FiTrendingUp size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Average Progress</span>
            <span className="stat-value">{summary.avgProgress || 0}%</span>
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-icon-wrapper box-success">
            <FiCheckSquare size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Habits Today</span>
            <span className="stat-value">{summary.habitsCompletedToday} / {summary.totalHabits}</span>
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-icon-wrapper box-violet">
            <FiAward size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Highest Habit Streak</span>
            <span className="stat-value">🔥 {summary.maxStreak || 0} Days</span>
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div className="stat-icon-wrapper box-rose">
            <FiPieChart size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Goals Mapped</span>
            <span className="stat-value">{summary.totalDreams} Total</span>
          </div>
        </div>
      </section>

      {/* Charts Grid */}
      <div className="analytics-charts-grid">
        <div className="glass-panel chart-card-large">
          <h3>Habit Completion Trend (Last 7 Days)</h3>
          <div className="chart-wrapper">
            <ProgressChart type="line" data={lineChartData} />
          </div>
        </div>

        <div className="glass-panel chart-card-small">
          <h3>Category Distribution</h3>
          <div className="chart-wrapper">
            {categoryValues.reduce((a, b) => a + b, 0) === 0 ? (
              <div className="no-chart-data">No goals category distribution yet.</div>
            ) : (
              <ProgressChart type="doughnut" data={doughnutChartData} />
            )}
          </div>
        </div>

        <div className="glass-panel chart-card-full grid-span-full">
          <h3>Monthly Dream Velocity (Progression)</h3>
          <div className="chart-wrapper">
            <ProgressChart type="bar" data={barChartData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
