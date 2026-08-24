import React from 'react';

export default function SkeletonLoader({ count = 3, height = '60px' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          style={{
            height,
            width: '100%',
            backgroundColor: 'rgba(30, 38, 56, 0.5)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            animation: 'skeleton-pulse 1.5s ease-in-out infinite'
          }}
        />
      ))}
      <style>{`
        @keyframes skeleton-pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
