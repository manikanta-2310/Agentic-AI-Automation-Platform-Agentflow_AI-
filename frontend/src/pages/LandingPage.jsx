import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity,
  Bot,
  Layers,
  Lock,
  Cpu
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function LandingPage() {
  const { isAuthenticated } = useAuthStore();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.25rem 2rem',
          borderBottom: '1px solid var(--border-color)',
          backgroundColor: 'rgba(9, 13, 22, 0.8)',
          backdropFilter: 'blur(12px)',
          position: 'sticky',
          top: 0,
          zIndex: 30
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.25rem', fontWeight: '800' }}>
          <div className="brand-icon">
            <Sparkles style={{ width: '20px', height: '20px', color: '#ffffff' }} />
          </div>
          <span>
            Agentflow<span style={{ color: '#818cf8' }}>.AI</span>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn btn-primary">
              <span>Open Console</span>
              <ArrowRight style={{ width: '14px', height: '14px' }} />
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary">Sign In</Link>
              <Link to="/register" className="btn btn-primary">Get Started Free</Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '4rem 1.5rem',
          maxWidth: '1000px',
          margin: '0 auto',
          position: 'relative'
        }}
      >
        {/* Release Tag */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 0.85rem',
            backgroundColor: 'rgba(99, 102, 241, 0.12)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontFamily: 'var(--font-mono)',
            color: '#a5b4fc',
            marginBottom: '1.5rem'
          }}
        >
          <Sparkles style={{ width: '12px', height: '12px' }} />
          <span>Next-Gen Multi-Agent Autonomous Automation Platform</span>
        </div>

        <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: '900', letterSpacing: '-0.02em', lineHeight: '1.15', marginBottom: '1.5rem' }}>
          Describe an automation in English.{' '}
          <span style={{ background: 'var(--brand-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            5 cooperating AI agents execute it.
          </span>
        </h1>

        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '720px', lineHeight: '1.6', marginBottom: '2.5rem' }}>
          Agentflow converts natural-language instructions into visual workflow graphs. A resilient 5-agent pipeline plans, validates, routes, and recovers failures in real time.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link
            to={isAuthenticated ? '/dashboard' : '/register'}
            className="btn btn-primary"
            style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}
          >
            <span>Launch Operator Console</span>
            <ArrowRight style={{ width: '16px', height: '16px' }} />
          </Link>
          <Link
            to="/workflows/builder"
            className="btn btn-secondary"
            style={{ padding: '0.85rem 1.5rem', fontSize: '1rem' }}
          >
            <span>Explore AI Builder</span>
          </Link>
        </div>

        {/* 5-Agent Architecture Cards */}
        <div style={{ marginTop: '4.5rem', width: '100%' }}>
          <div style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>
            The 5-Agent Orchestration Chain
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            {[
              { role: '1. Planner Agent', desc: "Kahn's topological sort & confidence score", color: '#60a5fa' },
              { role: '2. Execution Agent', desc: 'Dynamic variable interpolation & tools', color: '#34d399' },
              { role: '3. Validation Agent', desc: 'Output JSON schema enforcement', color: '#facc15' },
              { role: '4. Recovery Agent', desc: 'Error classification & backoff retry', color: '#fb923c' },
              { role: '5. Monitoring Agent', desc: 'Real-time WebSocket telemetry stream', color: '#c084fc' }
            ].map((ag, i) => (
              <div
                key={i}
                className="glass-card"
                style={{
                  padding: '1.25rem',
                  textAlign: 'left',
                  borderTop: `3px solid ${ag.color}`
                }}
              >
                <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#ffffff', marginBottom: '0.4rem' }}>{ag.role}</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{ag.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-color)', padding: '1.5rem 2rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
        Agentflow_AI Platform • Built with React.js 19 + Node.js + Express + MongoDB
      </footer>
    </div>
  );
}
