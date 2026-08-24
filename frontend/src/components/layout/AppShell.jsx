import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Sidebar from './Sidebar.jsx';
import NotificationsDrawer from './NotificationsDrawer.jsx';
import { useAuthStore } from '../../store/authStore';
import LoadingSpinner from '../common/LoadingSpinner.jsx';

export default function AppShell({ children, requireAuth = true }) {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && requireAuth && !isAuthenticated) {
      navigate('/login');
    }
  }, [isLoading, isAuthenticated, requireAuth, navigate]);

  if (isLoading && requireAuth) {
    return (
      <div style={{ display: 'flex', height: '100vh', width: '100vw', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-main)' }}>
        <div style={{ textAlign: 'center' }}>
          <LoadingSpinner size="lg" />
          <p style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', marginTop: '0.75rem' }}>
            Loading Agentflow Console...
          </p>
        </div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return null;
  }

  return (
    <div className="app-shell">
      <Navbar />
      <div className="app-body">
        {requireAuth && <Sidebar />}
        <main className="main-content">
          {children}
        </main>
      </div>
      <NotificationsDrawer />
    </div>
  );
}
