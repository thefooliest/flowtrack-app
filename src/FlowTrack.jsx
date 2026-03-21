import { useState, useCallback, useRef } from "react";
import { createDB } from "./db";
import { now } from "./utils";
import { CSS } from "./styles";
import Icon from "./icons";

// Activity components
import ActivityCard from "./components/activities/ActivityCard";
import ActivityDetail from "./components/activities/ActivityDetail";
import NewActivityModal from "./components/activities/NewActivityModal";

// Issue components
import IssueCard from "./components/issues/IssueCard";
import IssueDetail from "./components/issues/IssueDetail";
import NewIssueModal from "./components/issues/NewIssueModal";

// View components
import AnalyticsView from "./components/AnalyticsView";
import TemplatesView from "./components/TemplatesView";
import SettingsView from "./components/SettingsView";

const NAV_ITEMS = [
  { key: "activities", label: "Actividades" },
  { key: "issues", label: "Problemas" },
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
  const [issueFilter, setIssueFilter] = useState("all");
  const [showNewModal, setShowNewModal] = useState(false);
  const [showNewIssue, setShowNewIssue] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedIssueId, setSelectedIssueId] = useState(null);
  const [subParentId, setSubParentId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  // ── Activities data ──
  const activities = db.getActivities().filter((a) => !a.parentId);
  const filtered = filter === "all" ? activities : activities.filter((a) => a.status === filter);
  const sorted = [...filtered].sort((a, b) => {
    const order = { active: 0, paused: 1, completed: 2 };
    if (order[a.status] !== order[b.status]) return order[a.status] - order[b.status];
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
  const selectedActivity = selectedId ? db.getActivity(selectedId) : null;
  const activeCount = activities.filter((a) => a.status === "active").length;
  const pausedCount = activities.filter((a) => a.status === "paused").length;

  // ── Issues data ──
  const issues = db.getIssues();
  const filteredIssues =
    issueFilter === "all" ? issues : issues.filter((i) => i.status === issueFilter);
  const sortedIssues = [...filteredIssues].sort((a, b) => {
    const order = { open: 0, exploring: 1, resolved: 2 };
    if (order[a.status] !== order[b.status]) return order[a.status] - order[b.status];
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
  const selectedIssue = selectedIssueId ? db.getIssue(selectedIssueId) : null;
  const openIssues = issues.filter((i) => i.status !== "resolved").length;

  // ── Handlers ──
  const handleAction = (action, id) => {
    const a = db.getActivity(id);
    const ts = now();
    if (action === "pause")
      db.updateActivity(id, { status: "paused", timeHistory: [...a.timeHistory, ts] });
    else if (action === "resume")
      db.updateActivity(id, { status: "active", timeHistory: [...a.timeHistory, ts] });
    else if (action === "complete")
      db.updateActivity(id, { status: "completed", timeHistory: [...a.timeHistory, ts] });
    refresh();
  };

  const handleNewActivity = (activity) => {
    db.addActivity(activity);
    setShowNewModal(false);
    setSubParentId(null);
    refresh();
  };

  const handleNewIssue = (issue) => {
    db.addIssue(issue);
    setShowNewIssue(false);
    refresh();
  };

  const switchView = (v) => {
    setView(v);
    setSelectedId(null);
    setSelectedIssueId(null);
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        {/* ── Header ── */}
        <div className="header">
          <h1>
            <span className="dot" /> FlowTrack
          </h1>
          <div style={{ display: "flex", gap: 6 }}>
            {activeCount > 0 && (
              <span className="badge" style={{ color: "var(--accent)", background: "var(--accent-dim)" }}>
                {activeCount} activa{activeCount > 1 ? "s" : ""}
              </span>
            )}
            {openIssues > 0 && (
              <span className="badge" style={{ color: "var(--issue-color)", background: "var(--issue-dim)" }}>
                {openIssues} problema{openIssues > 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>

        {/* ── Nav ── */}
        <nav className="nav">
          {NAV_ITEMS.map((n) => (
            <button
              key={n.key}
              className={`nav-item ${view === n.key ? "active" : ""}`}
              onClick={() => switchView(n.key)}
            >
              {n.label}
            </button>
          ))}
        </nav>

        {/* ── Content ── */}
        <div className="content">
          {/* Activities */}
          {view === "activities" && !selectedActivity && (
            <>
              <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
                {[
                  { key: "all", label: `Todas (${activities.length})` },
                  { key: "active", label: `Activas (${activeCount})` },
                  { key: "paused", label: `Pausadas (${pausedCount})` },
                  { key: "completed", label: "Completadas" },
                ].map((f) => (
                  <button
                    key={f.key}
                    className={`btn btn-xs ${filter === f.key ? "btn-accent" : ""}`}
                    onClick={() => setFilter(f.key)}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              {sorted.length === 0 && (
                <div className="empty-state">
                  <div className="icon">⏱</div>
                  <p>
                    {filter === "all"
                      ? "No hay actividades registradas.\nToca + para comenzar."
                      : `No hay actividades ${
                          filter === "active" ? "activas" : filter === "paused" ? "pausadas" : "completadas"
                        }.`}
                  </p>
                </div>
              )}
              {sorted.map((a) => (
                <ActivityCard
                  key={a.id + refreshKey}
                  activity={a}
                  db={db}
                  onClick={() => setSelectedId(a.id)}
                  onAction={handleAction}
                  onNewSub={(parentId) => {
                    setSubParentId(parentId);
                    setShowNewModal(true);
                  }}
                />
              ))}
            </>
          )}
          {view === "activities" && selectedActivity && (
            <ActivityDetail
              key={selectedId + refreshKey}
              activity={selectedActivity}
              db={db}
              onBack={() => setSelectedId(null)}
              onRefresh={refresh}
            />
          )}

          {/* Issues */}
          {view === "issues" && !selectedIssue && (
            <>
              <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
                {[
                  { key: "all", label: `Todos (${issues.length})` },
                  { key: "open", label: "Abiertos" },
                  { key: "exploring", label: "Explorando" },
                  { key: "resolved", label: "Resueltos" },
                ].map((f) => (
                  <button
                    key={f.key}
                    className={`btn btn-xs ${issueFilter === f.key ? "btn-issue" : ""}`}
                    onClick={() => setIssueFilter(f.key)}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              {sortedIssues.length === 0 && (
                <div className="empty-state">
                  <div className="icon">🔍</div>
                  <p>
                    {issueFilter === "all"
                      ? "No hay problemas registrados.\nToca + para registrar uno."
                      : "No hay problemas con este estado."}
                  </p>
                </div>
              )}
              {sortedIssues.map((i) => (
                <IssueCard
                  key={i.id + refreshKey}
                  issue={i}
                  db={db}
                  onClick={() => setSelectedIssueId(i.id)}
                />
              ))}
            </>
          )}
          {view === "issues" && selectedIssue && (
            <IssueDetail
              key={selectedIssueId + refreshKey}
              issue={selectedIssue}
              db={db}
              onBack={() => setSelectedIssueId(null)}
              onRefresh={refresh}
            />
          )}

          {/* Other views */}
          {view === "analytics" && <AnalyticsView key={refreshKey} db={db} />}
          {view === "templates" && <TemplatesView db={db} onRefresh={refresh} />}
          {view === "settings" && <SettingsView db={db} onRefresh={refresh} />}
        </div>

        {/* ── FABs ── */}
        {view === "activities" && !selectedActivity && (
          <button
            className="fab"
            onClick={() => {
              setSubParentId(null);
              setShowNewModal(true);
            }}
          >
            <Icon name="plus" size={24} />
          </button>
        )}
        {view === "issues" && !selectedIssue && (
          <button className="fab fab-issue" onClick={() => setShowNewIssue(true)}>
            <Icon name="plus" size={24} />
          </button>
        )}

        {/* ── Modals ── */}
        {showNewModal && (
          <NewActivityModal
            db={db}
            parentId={subParentId}
            onClose={() => {
              setShowNewModal(false);
              setSubParentId(null);
            }}
            onSave={handleNewActivity}
          />
        )}
        {showNewIssue && (
          <NewIssueModal
            db={db}
            onClose={() => setShowNewIssue(false)}
            onSave={handleNewIssue}
          />
        )}
      </div>
    </>
  );
}
