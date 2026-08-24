import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, User, Mail, Lock, Shield, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, error, clearError, isLoading } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('operator');

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    const result = await register({ name, email, password, role });
    if (result && result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-main)', padding: '1.5rem' }}>
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '2rem',
          backgroundColor: '#0c101a',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="brand-icon" style={{ margin: '0 auto 0.75rem auto' }}>
            <Sparkles style={{ width: '20px', height: '20px', color: '#ffffff' }} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#ffffff' }}>Create Operator Account</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Join the autonomous AI operations pipeline
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: '0.75rem',
              backgroundColor: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              borderRadius: 'var(--radius-md)',
              color: '#fb7185',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1.25rem'
            }}
          >
            <AlertCircle style={{ width: '16px', height: '16px', flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div>
            <label className="form-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <User style={{ position: 'absolute', left: '10px', top: '10px', width: '16px', height: '16px', color: 'var(--text-muted)' }} />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Mercer"
                className="input"
                style={{ paddingLeft: '32px' }}
              />
            </div>
          </div>

          <div>
            <label className="form-label">Work Email</label>
            <div style={{ position: 'relative' }}>
              <Mail style={{ position: 'absolute', left: '10px', top: '10px', width: '16px', height: '16px', color: 'var(--text-muted)' }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@ops.io"
                className="input"
                style={{ paddingLeft: '32px' }}
              />
            </div>
          </div>

          <div>
            <label className="form-label">Password (Min 6 chars)</label>
            <div style={{ position: 'relative' }}>
              <Lock style={{ position: 'absolute', left: '10px', top: '10px', width: '16px', height: '16px', color: 'var(--text-muted)' }} />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input"
                style={{ paddingLeft: '32px' }}
              />
            </div>
          </div>

          <div>
            <label className="form-label">Operator Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="select"
            >
              <option value="operator">Operator (Standard)</option>
              <option value="admin">Administrator (Full Access)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary"
            style={{ padding: '0.75rem', marginTop: '0.5rem' }}
          >
            {isLoading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <>
                <span>Create Operator Account</span>
                <ArrowRight style={{ width: '14px', height: '14px' }} />
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          Already registered?{' '}
          <Link to="/login" style={{ color: '#818cf8', fontWeight: '600' }}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
