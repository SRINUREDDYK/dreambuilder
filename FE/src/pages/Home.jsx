import React from 'react';
import { Link } from 'react-router-dom';
import { FiCompass, FiAward, FiTrendingUp, FiCheckSquare } from 'react-icons/fi';
import './Home.css';

const Home = ({ user }) => {
  return (
    <div className="home-container fade-in">
      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">🚀 Platform is Live</div>
          <h1 className="hero-title">
            Turn your <span className="highlight-text">dreams</span> into <br />
            actionable roadmaps
          </h1>
          <p className="hero-subtitle">
            DreamBuilder utilizes intelligence to instantly break down your high-level dreams and goals into monthly milestones, daily habits, and tracking metrics. Build the life you want, step by step.
          </p>
          
          <div className="hero-actions">
            {user ? (
              <Link to="/dashboard" className="btn btn-primary hero-btn">
                <span>Go to Dashboard</span>
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary hero-btn">
                  <span>Start Building for Free</span>
                </Link>
                <Link to="/login" className="btn btn-secondary hero-btn">
                  <span>Sign In</span>
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="hero-visual">
          <div className="visual-card-wrapper glass-panel">
            <div className="visual-card-header">
              <span className="category-badge cat-career">Career</span>
              <span className="priority-indicator priority-high">High Priority</span>
            </div>
            <h3 className="visual-card-title">Become a Full Stack Developer</h3>
            <div className="visual-steps-preview">
              <div className="preview-step checked">
                <div className="preview-check">✓</div>
                <span>Learn HTML, CSS & JS Basics</span>
              </div>
              <div className="preview-step checked">
                <div className="preview-check">✓</div>
                <span>Master React.js State Management</span>
              </div>
              <div className="preview-step">
                <div className="preview-check"></div>
                <span>Build Node.js & Express REST APIs</span>
              </div>
            </div>
            <div className="visual-progress">
              <div className="progress-text-row">
                <span>Overall Goal Progress</span>
                <span>65%</span>
              </div>
              <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{ width: '65%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Grid */}
      <section className="features-section">
        <h2 className="section-title">Engines built to power your growth</h2>
        <p className="section-subtitle">A integrated workspace supporting goal planning, micro-habits, and gamified reward feedback.</p>
        
        <div className="features-grid">
          <div className="feature-item glass-panel">
            <div className="feature-icon-box box-indigo">
              <FiCompass size={24} />
            </div>
            <h3>AI Roadmap Generator</h3>
            <p>Type in any high-level objective, and the platform builds a step-by-step month-by-month roadmap automatically.</p>
          </div>

          <div className="feature-item glass-panel">
            <div className="feature-icon-box box-success">
              <FiCheckSquare size={24} />
            </div>
            <h3>Daily Habit Tracker</h3>
            <p>Build habits linked to your identity. Keep streaks alive with daily checks, and trigger motivational spark quotes.</p>
          </div>

          <div className="feature-item glass-panel">
            <div className="feature-icon-box box-violet">
              <FiTrendingUp size={24} />
            </div>
            <h3>Progress Analytics</h3>
            <p>Beautiful chart rendering details your category balances, habit history, and goals velocity over time.</p>
          </div>

          <div className="feature-item glass-panel">
            <div className="feature-icon-box box-rose">
              <FiAward size={24} />
            </div>
            <h3>Gamified Achievements</h3>
            <p>Earn badges such as "First Dream" and "30-Day Streak" as milestones are ticked, and leveling up your stats.</p>
          </div>
        </div>
      </section>

      {/* Quote Banner */}
      <section className="quote-banner glass-panel">
        <p className="banner-quote">"Small steps every day create big results."</p>
        <span className="banner-author">— DreamBuilder Platform Philosophy</span>
      </section>
    </div>
  );
};

export default Home;
