import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, error, clearError, isLoading } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    const result = await login({ email, password });
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
          maxWidth: '420px',
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
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#ffffff' }}>Operator Login</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Sign in to access your autonomous workflow console
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label className="form-label">Work Email</label>
            <div style={{ position: 'relative' }}>
              <Mail style={{ position: 'absolute', left: '10px', top: '10px', width: '16px', height: '16px', color: 'var(--text-muted)' }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@agentflow.io"
                className="input"
                style={{ paddingLeft: '32px' }}
              />
            </div>
          </div>

          <div>
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock style={{ position: 'absolute', left: '10px', top: '10px', width: '16px', height: '16px', color: 'var(--text-muted)' }} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input"
                style={{ paddingLeft: '32px' }}
              />
            </div>
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
                <span>Sign In to Console</span>
                <ArrowRight style={{ width: '14px', height: '14px' }} />
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          Don't have an operator account?{' '}
          <Link to="/register" style={{ color: '#818cf8', fontWeight: '600' }}>
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
