import React, { useState } from 'react';
import { Sparkles, ArrowRight, Lightbulb } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';

const SUGGESTIONS = [
  'When a high-priority customer email arrives, classify intent with AI, send an urgent Slack message, and log to Google Sheets.',
  'When a webhook receives a new lead, extract company details, score lead quality, and notify discord sales channel.',
  'Daily schedule trigger to read recent Google Sheets transactions, summarize financial anomalies with AI, and email the executive team.'
];

export default function PromptInputPanel({ onGenerate, isGenerating }) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;
    onGenerate(prompt);
  };

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
          <Sparkles style={{ width: '20px', height: '20px', color: '#818cf8' }} />
          <h2 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#ffffff' }}>
            Natural Language AI Workflow Generator
          </h2>
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          Describe your business automation in plain English. The AI reasoning engine will compile it into an executable graph.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <textarea
          rows={4}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. When a support ticket arrives in Gmail, analyze sentiment with AI. If negative, post to #critical-support in Slack and record in Google Sheets..."
          className="textarea"
          style={{ fontSize: '0.85rem', lineHeight: '1.5' }}
        />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            Cascade: OpenRouter ➔ Gemini ➔ Deterministic Builder
          </span>

          <button
            type="submit"
            disabled={!prompt.trim() || isGenerating}
            className="btn btn-primary"
            style={{ padding: '0.6rem 1.25rem' }}
          >
            {isGenerating ? (
              <>
                <LoadingSpinner size="sm" />
                <span>Generating Graph...</span>
              </>
            ) : (
              <>
                <Sparkles style={{ width: '14px', height: '14px' }} />
                <span>Generate Workflow Graph</span>
                <ArrowRight style={{ width: '14px', height: '14px' }} />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Suggestion Chips */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
          <Lightbulb style={{ width: '12px', height: '12px', color: '#facc15' }} />
          <span>Quick Inspiration Templates</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {SUGGESTIONS.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setPrompt(s)}
              className="glass-card"
              style={{
                textAlign: 'left',
                padding: '0.5rem 0.75rem',
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)'
              }}
            >
              "{s}"
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
