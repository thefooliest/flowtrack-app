export const CSS = `
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Outfit:wght@300;400;500;600;700&display=swap');
:root {
  --bg-primary: #0a0a0f;
  --bg-secondary: #12121a;
  --bg-tertiary: #1a1a26;
  --bg-elevated: #22222e;
  --bg-hover: #2a2a38;
  --border: #2a2a3a;
  --border-subtle: #1e1e2e;
  --text-primary: #e8e8f0;
  --text-secondary: #8888a0;
  --text-muted: #555570;
  --accent: #6ee7b7;
  --accent-dim: #6ee7b720;
  --accent-mid: #6ee7b740;
  --warning: #fbbf24;
  --danger: #f87171;
  --issue-color: #f472b6;
  --issue-dim: #f472b620;
  --active-glow: #6ee7b730;
  --paused-glow: #fbbf2430;
  --font-display: 'Outfit', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  --radius: 12px;
  --radius-sm: 8px;
  --radius-xs: 6px;
  --transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
* { margin: 0; padding: 0; box-sizing: border-box; }
body, #root {
  font-family: var(--font-display);
  background: var(--bg-primary);
  color: var(--text-primary);
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
}
.app {
  max-width: 480px;
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
}

/* Header */
.header {
  padding: 20px 20px 16px;
  border-bottom: 1px solid var(--border-subtle);
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky; top: 0;
  background: var(--bg-primary);
  z-index: 100;
}
.header h1 {
  font-size: 1.3rem; font-weight: 600; letter-spacing: -0.02em;
  display: flex; align-items: center; gap: 8px;
}
.header .dot {
  width: 8px; height: 8px; border-radius: 50%; background: var(--accent);
  animation: pulse-dot 2s ease-in-out infinite;
}
@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
}
.badge {
  font-size: 0.75rem; font-family: var(--font-mono);
  padding: 4px 10px; border-radius: 20px;
}

/* Buttons */
.btn {
  border: none; background: var(--bg-tertiary); color: var(--text-primary);
  font-family: var(--font-display); font-size: 0.85rem; font-weight: 500;
  padding: 8px 14px; border-radius: var(--radius-sm); cursor: pointer;
  transition: all var(--transition); display: inline-flex; align-items: center;
  gap: 6px; white-space: nowrap;
}
.btn:hover { background: var(--bg-hover); }
.btn:active { transform: scale(0.97); }
.btn-accent { background: var(--accent); color: var(--bg-primary); font-weight: 600; }
.btn-accent:hover { background: #5ddba6; }
.btn-ghost { background: transparent; color: var(--text-secondary); padding: 8px; }
.btn-ghost:hover { color: var(--text-primary); background: var(--bg-tertiary); }
.btn-danger { background: #f8717120; color: var(--danger); }
.btn-danger:hover { background: #f8717135; }
.btn-sm { padding: 6px 10px; font-size: 0.8rem; }
.btn-xs { padding: 4px 8px; font-size: 0.72rem; border-radius: var(--radius-xs); }
.btn-issue { background: var(--issue-dim); color: var(--issue-color); }
.btn-issue:hover { background: #f472b635; }

/* Nav */
.nav {
  display: flex; gap: 2px; padding: 10px 16px;
  border-bottom: 1px solid var(--border-subtle);
  background: var(--bg-primary);
  position: sticky; top: 65px; z-index: 99;
  overflow-x: auto;
}
.nav-item {
  flex: 1; padding: 9px 6px; text-align: center;
  font-size: 0.75rem; font-weight: 500; color: var(--text-muted);
  background: none; border: none; border-radius: var(--radius-sm);
  cursor: pointer; transition: all var(--transition); font-family: var(--font-display);
  min-width: 0;
}
.nav-item:hover { color: var(--text-secondary); background: var(--bg-tertiary); }
.nav-item.active { color: var(--accent); background: var(--accent-dim); }

/* Content */
.content { flex: 1; padding: 16px 20px 100px; overflow-y: auto; }

/* Activity Cards */
.activity-card {
  background: var(--bg-secondary); border: 1px solid var(--border-subtle);
  border-radius: var(--radius); padding: 16px; margin-bottom: 10px;
  transition: all var(--transition); cursor: pointer;
}
.activity-card:hover { border-color: var(--border); background: var(--bg-tertiary); }
.activity-card.is-active {
  border-color: var(--accent-mid);
  box-shadow: 0 0 20px var(--active-glow), inset 0 0 0 1px var(--accent-dim);
}
.activity-card.is-paused { border-color: #fbbf2440; box-shadow: 0 0 20px var(--paused-glow); }
.card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
.card-name { font-size: 0.95rem; font-weight: 600; letter-spacing: -0.01em; flex: 1; }
.card-status {
  font-family: var(--font-mono); font-size: 0.68rem; font-weight: 500;
  padding: 3px 8px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.05em;
}
.status-active { background: var(--accent-dim); color: var(--accent); }
.status-paused { background: #fbbf2420; color: var(--warning); }
.status-completed { background: #55557020; color: var(--text-muted); }
.card-meta { display: flex; align-items: center; gap: 12px; font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 10px; }
.card-time { font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-primary); font-weight: 500; }
.card-tags { display: flex; flex-wrap: wrap; gap: 6px; }
.tag-pill { font-size: 0.7rem; font-weight: 500; padding: 3px 10px; border-radius: 20px; letter-spacing: 0.02em; }
.card-actions {
  display: flex; gap: 6px; margin-top: 12px; padding-top: 12px;
  border-top: 1px solid var(--border-subtle); flex-wrap: wrap; align-items: center;
}
.card-children-count { font-size: 0.75rem; color: var(--text-muted); display: flex; align-items: center; gap: 4px; }

/* FAB */
.fab {
  position: fixed; bottom: 24px; right: calc(50% - 220px);
  width: 56px; height: 56px; border-radius: 50%;
  background: var(--accent); color: var(--bg-primary); border: none;
  font-size: 1.8rem; font-weight: 300; cursor: pointer;
  box-shadow: 0 4px 24px var(--active-glow);
  transition: all var(--transition);
  display: flex; align-items: center; justify-content: center; z-index: 200;
}
.fab:hover { transform: scale(1.08); box-shadow: 0 6px 32px #6ee7b750; }
.fab:active { transform: scale(0.95); }
.fab-issue { background: var(--issue-color); box-shadow: 0 4px 24px #f472b630; }
.fab-issue:hover { box-shadow: 0 6px 32px #f472b650; }
@media (max-width: 520px) { .fab { right: 20px; } }

/* Modal */
.modal-overlay {
  position: fixed; inset: 0; background: #00000088; backdrop-filter: blur(8px);
  z-index: 300; display: flex; align-items: flex-end; justify-content: center;
  animation: fade-in 0.2s ease;
}
@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
.modal {
  background: var(--bg-secondary); border: 1px solid var(--border);
  border-radius: var(--radius) var(--radius) 0 0;
  width: 100%; max-width: 480px; max-height: 85vh;
  overflow-y: auto; padding: 24px 20px 32px;
  animation: slide-up 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
@keyframes slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
.modal-title { font-size: 1.1rem; font-weight: 600; margin-bottom: 20px; letter-spacing: -0.02em; }
.modal-center { align-items: center; }
.modal-center .modal {
  border-radius: var(--radius); max-width: 400px;
  animation: scale-in 0.2s ease;
}
@keyframes scale-in { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }

/* Form */
.form-group { margin-bottom: 16px; }
.form-label {
  display: block; font-size: 0.75rem; font-weight: 500;
  color: var(--text-secondary); margin-bottom: 6px;
  text-transform: uppercase; letter-spacing: 0.08em;
}
.form-input {
  width: 100%; padding: 10px 14px; background: var(--bg-tertiary);
  border: 1px solid var(--border); border-radius: var(--radius-sm);
  color: var(--text-primary); font-family: var(--font-display);
  font-size: 0.9rem; transition: border-color var(--transition); outline: none;
}
.form-input:focus { border-color: var(--accent); }
.form-input::placeholder { color: var(--text-muted); }
textarea.form-input { resize: vertical; min-height: 60px; }
select.form-input { cursor: pointer; }

.tag-input-area {
  display: flex; flex-wrap: wrap; gap: 6px; padding: 8px;
  background: var(--bg-tertiary); border: 1px solid var(--border);
  border-radius: var(--radius-sm); min-height: 42px; cursor: text;
}
.tag-input-area:focus-within { border-color: var(--accent); }
.tag-input-area input {
  background: none; border: none; color: var(--text-primary);
  font-family: var(--font-display); font-size: 0.85rem; outline: none;
  flex: 1; min-width: 80px;
}
.tag-input-area input::placeholder { color: var(--text-muted); }
.tag-removable { display: flex; align-items: center; gap: 4px; cursor: pointer; }
.tag-removable .tag-x { font-size: 0.6rem; opacity: 0.6; margin-left: 2px; }
.tag-removable:hover .tag-x { opacity: 1; }
.tag-suggestions { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px; }
.tag-suggestion {
  font-size: 0.7rem; padding: 3px 10px; border-radius: 20px;
  background: var(--bg-hover); color: var(--text-secondary);
  border: 1px dashed var(--border); cursor: pointer; transition: all var(--transition);
}
.tag-suggestion:hover { color: var(--text-primary); border-color: var(--accent); }

/* Templates Grid */
.templates-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 20px; }
.template-btn {
  background: var(--bg-secondary); border: 1px solid var(--border-subtle);
  border-radius: var(--radius); padding: 14px 12px; cursor: pointer;
  transition: all var(--transition); text-align: left;
  font-family: var(--font-display); color: var(--text-primary);
}
.template-btn:hover { border-color: var(--accent-mid); background: var(--bg-tertiary); }
.template-btn:active { transform: scale(0.97); }
.template-name { font-size: 0.85rem; font-weight: 600; margin-bottom: 4px; }
.template-tags { display: flex; flex-wrap: wrap; gap: 4px; }
.template-tag { font-size: 0.6rem; padding: 2px 6px; border-radius: 10px; opacity: 0.8; }

/* Sections */
.section-title {
  font-size: 0.7rem; font-weight: 600; text-transform: uppercase;
  letter-spacing: 0.1em; color: var(--text-muted); margin: 20px 0 12px;
}
.section-title:first-child { margin-top: 0; }

/* Empty State */
.empty-state { text-align: center; padding: 60px 20px; color: var(--text-muted); }
.empty-state .icon { font-size: 2.5rem; margin-bottom: 12px; opacity: 0.4; }
.empty-state p { font-size: 0.9rem; line-height: 1.6; }

/* Detail */
.detail-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
.back-btn {
  background: var(--bg-tertiary); border: none; color: var(--text-secondary);
  width: 36px; height: 36px; border-radius: var(--radius-xs); cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.1rem; transition: all var(--transition);
}
.back-btn:hover { color: var(--text-primary); background: var(--bg-hover); }
.detail-name { font-size: 1.2rem; font-weight: 700; letter-spacing: -0.02em; flex: 1; }
.detail-section {
  background: var(--bg-secondary); border: 1px solid var(--border-subtle);
  border-radius: var(--radius); padding: 16px; margin-bottom: 12px;
}
.detail-label {
  font-size: 0.7rem; font-weight: 500; text-transform: uppercase;
  letter-spacing: 0.08em; color: var(--text-muted); margin-bottom: 6px;
}
.detail-value { font-size: 0.9rem; color: var(--text-primary); line-height: 1.5; }

.time-blocks { display: flex; flex-direction: column; gap: 6px; }
.time-block {
  display: flex; align-items: center; gap: 8px;
  font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-secondary);
}
.time-block-bar { height: 4px; border-radius: 2px; background: var(--accent); flex: 1; max-width: 120px; }

/* Analytics */
.stat-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 20px; }
.stat-card {
  background: var(--bg-secondary); border: 1px solid var(--border-subtle);
  border-radius: var(--radius); padding: 16px;
}
.stat-value {
  font-family: var(--font-mono); font-size: 1.5rem; font-weight: 700;
  color: var(--accent); margin-bottom: 4px;
}
.stat-label { font-size: 0.75rem; color: var(--text-muted); }
.chart-bar-container { margin-bottom: 8px; }
.chart-bar-label { display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 4px; }
.chart-bar-track { height: 8px; background: var(--bg-tertiary); border-radius: 4px; overflow: hidden; }
.chart-bar-fill { height: 100%; border-radius: 4px; transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1); }

/* Issue card */
.issue-card {
  background: var(--bg-secondary); border: 1px solid var(--border-subtle);
  border-radius: var(--radius); padding: 16px; margin-bottom: 10px;
  transition: all var(--transition); cursor: pointer;
}
.issue-card:hover { border-color: var(--border); background: var(--bg-tertiary); }
.issue-card.is-open { border-left: 3px solid var(--issue-color); }
.issue-card.is-exploring { border-left: 3px solid var(--warning); }
.issue-card.is-resolved { border-left: 3px solid var(--accent); opacity: 0.7; }
.issue-status {
  font-family: var(--font-mono); font-size: 0.68rem; font-weight: 500;
  padding: 3px 8px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.05em;
}
.issue-status-open { background: var(--issue-dim); color: var(--issue-color); }
.issue-status-exploring { background: #fbbf2420; color: var(--warning); }
.issue-status-resolved { background: var(--accent-dim); color: var(--accent); }

/* Solution */
.solution-item {
  background: var(--bg-tertiary); border-radius: var(--radius-sm);
  padding: 12px; margin-bottom: 8px;
}
.solution-status {
  font-size: 0.68rem; font-family: var(--font-mono); padding: 2px 6px;
  border-radius: 10px; text-transform: uppercase;
}
.sol-proposed { background: #55557030; color: var(--text-secondary); }
.sol-testing { background: #fbbf2420; color: var(--warning); }
.sol-accepted { background: var(--accent-dim); color: var(--accent); }
.sol-rejected { background: #f8717120; color: var(--danger); }

/* Confirm */
.confirm-text { font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 20px; line-height: 1.5; }
.confirm-actions { display: flex; gap: 10px; justify-content: flex-end; }

/* Scrollbar */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

.live-timer { font-family: var(--font-mono); font-variant-numeric: tabular-nums; }
`;
