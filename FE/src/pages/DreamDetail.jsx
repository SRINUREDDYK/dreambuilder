import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiPlus, FiTrash2, FiAward, FiCalendar, FiFlag } from 'react-icons/fi';
import API from '../services/api';
import MilestoneCard from '../components/MilestoneCard';
import './DreamDetail.css';

const DreamDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dream, setDream] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Custom Milestone Form
  const [showAddMilestone, setShowAddMilestone] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPhase, setNewPhase] = useState('Custom Phase');
  const [adding, setAdding] = useState(false);

  const fetchDreamDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await API.get(`/dreams/${id}`);
      setDream(response.data.dream);
      setMilestones(response.data.milestones);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to load roadmap details.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDreamDetails();
  }, [fetchDreamDetails]);

  const handleMilestoneToggle = async (milestoneId) => {
    try {
      const response = await API.put(`/milestones/${milestoneId}/toggle`);
      
      // Update local milestones
      setMilestones(prev => prev.map(m => m._id === milestoneId ? response.data.milestone : m));
      
      // Update dream progress and status
      setDream(prev => ({
        ...prev,
        progress: response.data.dreamProgress,
        status: response.data.dreamStatus
      }));

      if (response.data.newBadges?.length > 0) {
        alert(`🏆 Achievement Unlocked: ${response.data.newBadges.join(', ')}! Check the Achievements tab!`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddMilestoneSubmit = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setAdding(true);
    try {
      const response = await API.post('/milestones', {
        dream_id: dream._id,
        title: newTitle,
        month_or_phase: newPhase
      });

      setMilestones(prev => {
        const updated = [...prev, response.data.milestone];
        updated.sort((a, b) => {
          if (a.month_or_phase !== b.month_or_phase) {
            return a.month_or_phase.localeCompare(b.month_or_phase);
          }
          return a.order - b.order;
        });
        return updated;
      });

      // Update dream progress
      setDream(prev => ({
        ...prev,
        progress: response.data.dream.progress,
        status: response.data.dream.status
      }));

      setNewTitle('');
      setShowAddMilestone(false);
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  const handleMilestoneDelete = async (milestoneId) => {
    try {
      await API.delete(`/milestones/${milestoneId}`);
      setMilestones(prev => prev.filter(m => m._id !== milestoneId));
      
      // Recalculate progress locally
      const remaining = milestones.filter(m => m._id !== milestoneId);
      const total = remaining.length;
      const completed = remaining.filter(m => m.isCompleted).length;
      const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
      
      setDream(prev => ({
        ...prev,
        progress,
        status: progress === 100 ? 'Completed' : 'In Progress'
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDreamDelete = async () => {
    if (window.confirm(`Are you sure you want to permanently delete "${dream?.title}"? This cannot be undone.`)) {
      try {
        await API.delete(`/dreams/${dream._id}`);
        navigate('/dreams');
      } catch (err) {
        console.error(err);
        alert('Failed to delete dream.');
      }
    }
  };

  if (loading) return <div className="loading-state">Accessing dream parameters...</div>;
  if (error) return <div className="error-state">{error}</div>;
  if (!dream) return <div className="error-state">Dream not found.</div>;

  // Group milestones by month/phase
  const groupedMilestones = {};
  milestones.forEach(m => {
    if (!groupedMilestones[m.month_or_phase]) {
      groupedMilestones[m.month_or_phase] = [];
    }
    groupedMilestones[m.month_or_phase].push(m);
  });

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

  return (
    <div className="dream-detail-container fade-in">
      <Link to="/dreams" className="back-link">
        <FiArrowLeft size={16} /> <span>Back to My Dreams</span>
      </Link>

      {/* Dream Header Card */}
      <div className="glass-panel detail-header-card">
        <div className="detail-header-top">
          <span className={`category-badge ${getCategoryClass(dream.category)}`}>
            {dream.category}
          </span>
          <div className="detail-actions">
            <button onClick={handleDreamDelete} className="btn-delete-dream" title="Delete Dream">
              <FiTrash2 size={18} />
            </button>
          </div>
        </div>

        <h1 className="detail-dream-title">{dream.title}</h1>

        <div className="detail-meta-grid">
          <div className="detail-meta-item">
            <FiCalendar size={18} className="meta-icon" />
            <div>
              <span className="meta-label">Target Date</span>
              <span className="meta-val">{dream.targetDate}</span>
            </div>
          </div>

          <div className="detail-meta-item">
            <FiFlag size={18} className="meta-icon" />
            <div>
              <span className="meta-label">Difficulty & Priority</span>
              <span className="meta-val">{dream.difficulty} • {dream.priority} Priority</span>
            </div>
          </div>

          <div className="detail-meta-item">
            <FiAward size={18} className="meta-icon" />
            <div>
              <span className="meta-label">Current Status</span>
              <span className="meta-val">{dream.status}</span>
            </div>
          </div>
        </div>

        <div className="detail-progress-section">
          <div className="progress-label-row">
            <span>Overall Roadmap Progress</span>
            <span className="progress-val">{dream.progress}%</span>
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: `${dream.progress}%` }}></div>
          </div>
        </div>
      </div>

      {/* Roadmap Section */}
      <div className="roadmap-workspace">
        <div className="roadmap-header-row">
          <h2>🎯 Roadmap Milestones</h2>
          <button 
            onClick={() => setShowAddMilestone(!showAddMilestone)} 
            className="btn btn-secondary btn-sm"
          >
            <FiPlus size={16} /> Add Step
          </button>
        </div>

        {/* Add custom milestone form */}
        {showAddMilestone && (
          <form onSubmit={handleAddMilestoneSubmit} className="glass-panel add-milestone-form fade-in">
            <h4>Add Custom Step</h4>
            <div className="add-milestone-grid">
              <div className="form-group">
                <label htmlFor="milestone-title">Task Description</label>
                <input 
                  type="text" 
                  id="milestone-title"
                  className="input-field"
                  placeholder="e.g. Set up hosting server"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="milestone-phase">Month or Phase</label>
                <select 
                  id="milestone-phase"
                  className="input-field select-field"
                  value={newPhase}
                  onChange={(e) => setNewPhase(e.target.value)}
                >
                  <option value="Month 1">Month 1</option>
                  <option value="Month 2">Month 2</option>
                  <option value="Month 3">Month 3</option>
                  <option value="Month 4">Month 4</option>
                  <option value="Month 5">Month 5</option>
                  <option value="Month 6">Month 6</option>
                  <option value="Custom Phase">Custom Phase</option>
                </select>
              </div>
            </div>

            <div className="milestone-form-actions">
              <button type="submit" className="btn btn-primary" disabled={adding}>
                {adding ? 'Adding...' : 'Add Step'}
              </button>
              <button 
                type="button" 
                onClick={() => setShowAddMilestone(false)} 
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Render grouped milestones */}
        {milestones.length === 0 ? (
          <div className="empty-roadmap glass-panel">
            <p>Your roadmap is currently empty. Add steps to begin planning.</p>
          </div>
        ) : (
          <div className="roadmap-timeline">
            {Object.keys(groupedMilestones).map(phase => (
              <div key={phase} className="roadmap-phase-group">
                <h3 className="phase-group-title">{phase}</h3>
                <div className="phase-milestones-list">
                  {groupedMilestones[phase].map(milestone => (
                    <MilestoneCard 
                      key={milestone._id}
                      milestone={milestone}
                      onToggle={handleMilestoneToggle}
                      onDelete={handleMilestoneDelete}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DreamDetail;
