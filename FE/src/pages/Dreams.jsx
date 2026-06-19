import React, { useState, useEffect } from 'react';
import { FiPlus, FiX } from 'react-icons/fi';
import API from '../services/api';
import DreamCard from '../components/DreamCard';
import './Dreams.css';

const Dreams = () => {
  const [dreams, setDreams] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Career');
  const [priority, setPriority] = useState('Medium');
  const [difficulty, setDifficulty] = useState('Medium');
  const [targetDate, setTargetDate] = useState('');

  const fetchDreams = async () => {
    try {
      setLoading(true);
      const response = await API.get('/dreams');
      setDreams(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load dreams. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDreams();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!title || !category || !priority || !difficulty || !targetDate) {
      setError('Please fill in all fields.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await API.post('/dreams', {
        title,
        category,
        priority,
        difficulty,
        targetDate
      });

      // Reset form
      setTitle('');
      setCategory('Career');
      setPriority('Medium');
      setDifficulty('Medium');
      setTargetDate('');
      setShowAddForm(false);
      
      // Update local dreams state
      setDreams(prev => [response.data.dream, ...prev]);

      if (response.data.newBadges?.length > 0) {
        alert(`🏅 Achievement Unlocked: ${response.data.newBadges.join(', ')}! Check the Achievements tab!`);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to create dream.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/dreams/${id}`);
      setDreams(prev => prev.filter(d => d._id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete dream.');
    }
  };

  return (
    <div className="dreams-page-container fade-in">
      <header className="dreams-header">
        <div>
          <h1>My Dreams & Roadmaps</h1>
          <p className="welcome-sub">Envision your targets and let AI break down the steps to get there.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)} 
          className={`btn ${showAddForm ? 'btn-secondary' : 'btn-primary'}`}
        >
          {showAddForm ? (
            <>
              <FiX size={16} /> <span>Cancel</span>
            </>
          ) : (
            <>
              <FiPlus size={16} /> <span>Create A Dream</span>
            </>
          )}
        </button>
      </header>

      {error && <div className="dreams-error-alert">{error}</div>}

      {/* Add Dream Panel */}
      {showAddForm && (
        <div className="glass-panel add-dream-panel fade-in">
          <h3>🚀 Map a New Goal</h3>
          <form onSubmit={handleSubmit} className="add-dream-form">
            <div className="form-group grid-span-full">
              <label htmlFor="dream-title">What is your dream or goal?</label>
              <input 
                type="text" 
                id="dream-title"
                className="input-field"
                placeholder="e.g. Become a Full Stack Developer, Run a Marathon, Launch a Startup"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="dream-category">Category</label>
              <select 
                id="dream-category" 
                className="input-field select-field"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Career">Career</option>
                <option value="Fitness">Fitness</option>
                <option value="Business">Business</option>
                <option value="Education">Education</option>
                <option value="Travel">Travel</option>
                <option value="Finance">Finance</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="dream-priority">Priority</label>
              <select 
                id="dream-priority" 
                className="input-field select-field"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="dream-difficulty">Difficulty</label>
              <select 
                id="dream-difficulty" 
                className="input-field select-field"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="dream-date">Target Achievement Date</label>
              <input 
                type="date" 
                id="dream-date"
                className="input-field"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary submit-dream-btn" disabled={submitting}>
              {submitting ? 'Generating AI Roadmap...' : 'Generate Roadmap'}
            </button>
          </form>
        </div>
      )}

      {/* Dreams Grid */}
      {loading ? (
        <div className="loading-state">Accessing your dreams log...</div>
      ) : dreams.length === 0 ? (
        <div className="empty-dreams-state glass-panel">
          <span className="empty-emoji">💭</span>
          <h3>No dreams mapped yet</h3>
          <p>Every reality starts with a dream. Map your first goal to generate a detailed roadmap!</p>
          <button onClick={() => setShowAddForm(true)} className="btn btn-primary">
            Map My First Goal
          </button>
        </div>
      ) : (
        <div className="dreams-grid">
          {dreams.map(dream => (
            <DreamCard 
              key={dream._id} 
              dream={dream} 
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dreams;
