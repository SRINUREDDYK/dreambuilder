import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import './Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    if (!email) {
      setError('Please provide your email address.');
      return;
    }

    setLoading(true);
    try {
      const response = await API.post('/auth/forgot-password', { email });
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container fade-in">
      <div className="glass-panel auth-card">
        <div className="auth-header">
          <span className="auth-logo">🔒</span>
          <h2>Reset Password</h2>
          <p>Recover your credentials to access your dreams</p>
        </div>

        {error && <div className="auth-error-alert">{error}</div>}
        {message && <div className="auth-success-alert">{message}</div>}

        {!message ? (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input 
                type="email" 
                id="email" 
                className="input-field" 
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary auth-submit-btn" disabled={loading}>
              {loading ? 'Sending...' : 'Recover Password'}
            </button>
          </form>
        ) : (
          <Link to="/login" className="btn btn-primary auth-submit-btn" style={{ textDecoration: 'none' }}>
            Go to Login
          </Link>
        )}

        <div className="auth-footer">
          <span>Remember your details?</span>
          <Link to="/login" className="auth-redirect-link">Log In</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
