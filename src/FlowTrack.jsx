import { useState, useCallback, useRef } from "react";
import { createDB } from "./db";
import { now } from "./utils";
import { CSS } from "./styles";
import Icon from "./icons";

import ActivityCard from "./components/activities/ActivityCard";
import ActivityDetail from "./components/activities/ActivityDetail";
import NewActivityModal from "./components/activities/NewActivityModal";

import IssueCard from "./components/issues/IssueCard";
import IssueDetail from "./components/issues/IssueDetail";
import NewIssueModal from "./components/issues/NewIssueModal";

import IdeaCard from "./components/ideas/IdeaCard";
import IdeaDetail from "./components/ideas/IdeaDetail";
import NewIdeaModal from "./components/ideas/NewIdeaModal";

import AnalyticsView from "./components/AnalyticsView";
import TemplatesView from "./components/TemplatesView";
import SettingsView from "./components/SettingsView";

const NAV_ITEMS = [
  { key: "activities", label: "Actividades" },
  { key: "issues", label: "Problemas" },
  { key: "ideas", label: "Ideas" },
  { key: "analytics", label: "Análisis" },
  { key: "templates", label: "Plantillas" },
  { key: "settings", label: "⚙" },
];

export default function FlowTrack() {
  const dbRef = useRef(null);
  if (!dbRef.current) dbRef.current = createDB();
  const db = dbRef.current;

  const [view, setView] = useState("activities");
  const [filter, setFilter] = useState("all");
  const [showSubtasks, setShowSubtasks] = useState(true);
  const [issueFilter, setIssueFilter] = useState("all");
  const [ideaFilter, setIdeaFilter] = useState("all");
  const [showNewModal, setShowNewModal] = useState(false);
  const [showNewIssue, setShowNewIssue] = useState(false);
  const [showNewIdea, setShowNewIdea] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedIssueId, setSelectedIssueId] = useState(null);
  const [selectedIdeaId, setSelectedIdeaId] = useState(null);
  const [subParentId, setSubParentId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  // ── Activities (including subtasks in same view) ──
  const allActivities = db.getActivities();
  const topLevel = allActivities.filter((a) => !a.parentId);
  const subtasks = allActivities.filter((a) => a.parentId && a.parentType === "activity");
  const displayActivities = showSubtasks ? allActivities : topLevel;
  const filtered = filter === "all" ? displayActivities : displayActivities.filter((a) => a.status === filter);
  const sorted = [...filtered].sort((a, b) => {
    const order = { active: 0, paused: 1, completed: 2 };
    if (order[a.status] !== order[b.status]) return order[a.status] - order[b.status];
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
  const selectedActivity = selectedId ? db.getActivity(selectedId) : null;
  const activeCount = topLevel.filter((a) => a.status === "active").length;
  const pausedCount = topLevel.filter((a) => a.status === "paused").length;

  // ── Issues ──
  const issues = db.getIssues();
  const filteredIssues = issueFilter === "all" ? issues : issues.filter((i) => i.status === issueFilter);
  const sortedIssues = [...filteredIssues].sort((a, b) => {
    const order = { open: 0, exploring: 1, resolved: 2 };
    if (order[a.status] !== order[b.status]) return order[a.status] - order[b.status];
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
  const selectedIssue = selectedIssueId ? db.getIssue(selectedIssueId) : null;
  const openIssues = issues.filter((i) => i.status !== "resolved").length;

  // ── Ideas ──
  const ideas = db.getIdeas();
  const filteredIdeas = ideaFilter === "all" ? ideas : ideas.filter((i) => i.status === ideaFilter);
  const sortedIdeas = [...filteredIdeas].sort((a, b) => {
    const order = { open: 0, exploring: 1, implemented: 2 };
    if (order[a.status] !== order[b.status]) return order[a.status] - order[b.status];
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
  const selectedIdea = selectedIdeaId ? db.getIdea(selectedIdeaId) : null;
  const openIdeas = ideas.filter((i) => i.status === "open").length;

  const handleAction = (action, id) => {
    const a = db.getActivity(id);
    const ts = now();
    if (action === "pause") db.updateActivity(id, { status: "paused", timeHistory: [...a.timeHistory, ts] });
    else if (action === "resume") db.updateActivity(id, { status: "active", timeHistory: [...a.timeHistory, ts] });
    else if (action === "complete") db.updateActivity(id, { status: "completed", timeHistory: [...a.timeHistory, ts] });
    refresh();
  };

  const handleNewActivity = (activity) => { db.addActivity(activity); setShowNewModal(false); setSubParentId(null); refresh(); };
  const handleNewIssue = (issue) => { db.addIssue(issue); setShowNewIssue(false); refresh(); };
  const handleNewIdea = (idea) => { db.addIdea(idea); setShowNewIdea(false); refresh(); };

  const switchView = (v) => {
    setView(v); setSelectedId(null); setSelectedIssueId(null); setSelectedIdeaId(null);
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        <div className="header">
          <h1><span className="dot" /> FlowTrack</h1>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {activeCount > 0 && (
              <span className="badge" style={{ color: "var(--accent)", background: "var(--accent-dim)" }}>
                {activeCount} activa{activeCount > 1 ? "s" : ""}
              </span>
            )}
            {openIssues > 0 && (
              <span className="badge" style={{ color: "var(--issue-color)", background: "var(--issue-dim)" }}>
                {openIssues} prob.
              </span>
            )}
            {openIdeas > 0 && (
              <span className="badge" style={{ color: "var(--idea-color)", background: "var(--idea-dim)" }}>
                {openIdeas} idea{openIdeas > 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>

        <nav className="nav">
          {NAV_ITEMS.map((n) => (
            <button key={n.key} className={`nav-item ${view === n.key ? "active" : ""}`} onClick={() => switchView(n.key)}>
              {n.label}
            </button>
          ))}
        </nav>

        <div className="content">
          {/* ── ACTIVITIES ── */}
          {view === "activities" && !selectedActivity && (
            <>
              <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
                {[
                  { key: "all", label: `Todas (${displayActivities.length})` },
                  { key: "active", label: `Activas` },
                  { key: "paused", label: `Pausadas` },
                  { key: "completed", label: "Completadas" },
                ].map((f) => (
                  <button key={f.key} className={`btn btn-xs ${filter === f.key ? "btn-accent" : ""}`} onClick={() => setFilter(f.key)}>
                    {f.label}
                  </button>
                ))}
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.8rem", color: "var(--text-secondary)", cursor: "pointer" }}>
                  <input type="checkbox" checked={showSubtasks} onChange={(e) => setShowSubtasks(e.target.checked)} style={{ accentColor: "var(--accent)" }} />
                  Mostrar sub-tareas
                </label>
              </div>
              {sorted.length === 0 && (
                <div className="empty-state"><div className="icon">⏱</div>
                  <p>{filter === "all" ? "No hay actividades registradas.\nToca + para comenzar." : "No hay actividades con este estado."}</p>
                </div>
              )}
              {sorted.map((a) => (
                <ActivityCard key={a.id + refreshKey} activity={a} db={db}
                  onClick={() => setSelectedId(a.id)} onAction={handleAction}
                  onNewSub={(parentId) => { setSubParentId(parentId); setShowNewModal(true); }} />
              ))}
            </>
          )}
          {view === "activities" && selectedActivity && (
            <ActivityDetail key={selectedId + refreshKey} activity={selectedActivity} db={db}
              onBack={() => setSelectedId(null)} onRefresh={refresh} />
          )}

          {/* ── ISSUES ── */}
          {view === "issues" && !selectedIssue && (
            <>
              <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
                {[
                  { key: "all", label: `Todos (${issues.length})` },
                  { key: "open", label: "Abiertos" },
                  { key: "exploring", label: "Explorando" },
                  { key: "resolved", label: "Resueltos" },
                ].map((f) => (
                  <button key={f.key} className={`btn btn-xs ${issueFilter === f.key ? "btn-issue" : ""}`} onClick={() => setIssueFilter(f.key)}>
                    {f.label}
                  </button>
                ))}
              </div>
              {sortedIssues.length === 0 && (
                <div className="empty-state"><div className="icon">🔍</div><p>{issueFilter === "all" ? "No hay problemas registrados." : "No hay problemas con este estado."}</p></div>
              )}
              {sortedIssues.map((i) => (
                <IssueCard key={i.id + refreshKey} issue={i} db={db} onClick={() => setSelectedIssueId(i.id)} />
              ))}
            </>
          )}
          {view === "issues" && selectedIssue && (
            <IssueDetail key={selectedIssueId + refreshKey} issue={selectedIssue} db={db}
              onBack={() => setSelectedIssueId(null)} onRefresh={refresh} />
          )}

          {/* ── IDEAS ── */}
          {view === "ideas" && !selectedIdea && (
            <>
              <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
                {[
                  { key: "all", label: `Todas (${ideas.length})` },
                  { key: "open", label: "Abiertas" },
                  { key: "exploring", label: "Explorando" },
                  { key: "implemented", label: "Implementadas" },
                ].map((f) => (
                  <button key={f.key} className={`btn btn-xs ${ideaFilter === f.key ? "btn-idea" : ""}`} onClick={() => setIdeaFilter(f.key)}>
                    {f.label}
                  </button>
                ))}
              </div>
              {sortedIdeas.length === 0 && (
                <div className="empty-state"><div className="icon">💡</div><p>{ideaFilter === "all" ? "No hay ideas registradas." : "No hay ideas con este estado."}</p></div>
              )}
              {sortedIdeas.map((i) => (
                <IdeaCard key={i.id + refreshKey} idea={i} db={db} onClick={() => setSelectedIdeaId(i.id)} />
              ))}
            </>
          )}
          {view === "ideas" && selectedIdea && (
            <IdeaDetail key={selectedIdeaId + refreshKey} idea={selectedIdea} db={db}
              onBack={() => setSelectedIdeaId(null)} onRefresh={refresh} />
          )}

          {view === "analytics" && <AnalyticsView key={refreshKey} db={db} />}
          {view === "templates" && <TemplatesView db={db} onRefresh={refresh} />}
          {view === "settings" && <SettingsView db={db} onRefresh={refresh} />}
        </div>

        {/* FABs */}
        {view === "activities" && !selectedActivity && (
          <button className="fab" onClick={() => { setSubParentId(null); setShowNewModal(true); }}><Icon name="plus" size={24} /></button>
        )}
        {view === "issues" && !selectedIssue && (
          <button className="fab fab-issue" onClick={() => setShowNewIssue(true)}><Icon name="plus" size={24} /></button>
        )}
        {view === "ideas" && !selectedIdea && (
          <button className="fab fab-idea" onClick={() => setShowNewIdea(true)}><Icon name="plus" size={24} /></button>
        )}

        {/* Modals */}
        {showNewModal && (
          <NewActivityModal db={db} parentId={subParentId}
            onClose={() => { setShowNewModal(false); setSubParentId(null); }} onSave={handleNewActivity} />
        )}
        {showNewIssue && <NewIssueModal db={db} onClose={() => setShowNewIssue(false)} onSave={handleNewIssue} />}
        {showNewIdea && <NewIdeaModal db={db} onClose={() => setShowNewIdea(false)} onSave={handleNewIdea} />}
      </div>
    </>
  );
}