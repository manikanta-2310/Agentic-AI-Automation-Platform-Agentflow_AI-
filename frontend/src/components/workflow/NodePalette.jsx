import React, { useState } from 'react';
import { NODE_CATALOG, NODE_CATEGORIES } from '../../lib/nodeCatalog';
import { Search, Zap, Sparkles, GitFork, Globe } from 'lucide-react';

const categoryIcons = {
  triggers: Zap,
  ai: Sparkles,
  logic: GitFork,
  actions: Globe
};

export default function NodePalette() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const onDragStart = (event, nodeData) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(nodeData));
    event.dataTransfer.effectAllowed = 'move';
  };

  const filteredNodes = NODE_CATALOG.filter((n) => {
    const matchSearch = n.label.toLowerCase().includes(search.toLowerCase()) ||
      n.description.toLowerCase().includes(search.toLowerCase());
    const matchTab = activeTab === 'all' || n.category === activeTab;
    return matchSearch && matchTab;
  });

  return (
    <div
      style={{
        width: '280px',
        height: '100%',
        backgroundColor: 'rgba(9, 13, 22, 0.9)',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        padding: '1rem',
        gap: '0.75rem'
      }}
    >
      <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#ffffff' }}>Node Palette</div>
      <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Drag components onto the canvas</div>

      {/* Search */}
      <div style={{ position: 'relative' }}>
        <Search style={{ position: 'absolute', left: '10px', top: '10px', width: '14px', height: '14px', color: 'var(--text-muted)' }} />
        <input
          type="text"
          placeholder="Filter nodes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input"
          style={{ paddingLeft: '30px', fontSize: '0.75rem' }}
        />
      </div>

      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: '0.25rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
        <button
          onClick={() => setActiveTab('all')}
          style={{
            padding: '4px 8px',
            borderRadius: '6px',
            fontSize: '0.7rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: '600',
            cursor: 'pointer',
            backgroundColor: activeTab === 'all' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
            color: activeTab === 'all' ? '#a5b4fc' : 'var(--text-secondary)',
            border: activeTab === 'all' ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid transparent'
          }}
        >
          All
        </button>
        {Object.entries(NODE_CATEGORIES).map(([key, cat]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            style={{
              padding: '4px 8px',
              borderRadius: '6px',
              fontSize: '0.7rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: '600',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              backgroundColor: activeTab === key ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
              color: activeTab === key ? '#a5b4fc' : 'var(--text-secondary)',
              border: activeTab === key ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid transparent'
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Draggable Node Cards */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {filteredNodes.map((n) => {
          const CatIcon = categoryIcons[n.category] || Zap;

          return (
            <div
              key={n.type}
              draggable
              onDragStart={(e) => onDragStart(e, n)}
              className="glass-card"
              style={{
                padding: '0.65rem 0.85rem',
                cursor: 'grab',
                userSelect: 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#a5b4fc'
                  }}
                >
                  <CatIcon style={{ width: '14px', height: '14px' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#ffffff' }}>{n.label}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {n.description}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
