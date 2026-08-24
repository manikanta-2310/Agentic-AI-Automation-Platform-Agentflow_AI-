import React from 'react';

export default function LoadingSpinner({ size = 'md' }) {
  const dimensions = {
    sm: '16px',
    md: '28px',
    lg: '44px'
  };

  const dim = dimensions[size] || dimensions.md;

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <div
        style={{
          width: dim,
          height: dim,
          borderRadius: '50%',
          border: '3px solid rgba(99, 102, 241, 0.2)',
          borderTopColor: '#6366f1',
          borderRightColor: '#6366f1',
          animation: 'spin 0.8s linear infinite'
        }}
      />
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
