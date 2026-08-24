import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import WorkflowBuilderPage from './pages/WorkflowBuilderPage.jsx';
import WorkflowEditorPage from './pages/WorkflowEditorPage.jsx';
import ExecutionsPage from './pages/ExecutionsPage.jsx';
import IntegrationsPage from './pages/IntegrationsPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';

export default function App() {
  const initialize = useAuthStore((s) => s.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/workflows/builder" element={<WorkflowBuilderPage />} />
        <Route path="/workflows/:id" element={<WorkflowEditorPage />} />
        <Route path="/executions" element={<ExecutionsPage />} />
        <Route path="/integrations" element={<IntegrationsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
