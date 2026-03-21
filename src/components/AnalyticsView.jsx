import { formatDuration, calcRealTime } from "../utils";

export default function AnalyticsView({ db }) {
  const activities = db.getActivities();
  const issues = db.getIssues();
  const ideas = db.getIdeas();
  const completed = activities.filter((a) => a.status === "completed" && !a.parentId);
  const active = activities.filter((a) => a.status === "active" && !a.parentId);
  const totalTime = activities.reduce((acc, a) => acc + calcRealTime(a.timeHistory), 0);

  const tagTimes = {};
  activities.forEach((a) => {
    const time = calcRealTime(a.timeHistory);
    a.tags.forEach((tid) => {
      const tag = db.getTag(tid);
      if (tag) {
        tagTimes[tid] = tagTimes[tid] || { tag, time: 0, count: 0 };
        tagTimes[tid].time += time;
        tagTimes[tid].count += 1;
      }
    });
  });
  const tagTimeList = Object.values(tagTimes).sort((a, b) => b.time - a.time);
  const maxTagTime = tagTimeList[0]?.time || 1;

  const templates = db.getTemplates();
  const templateStats = templates
    .map((t) => {
      const acts = activities.filter((a) => a.templateId === t.id);
      const times = acts.map((a) => calcRealTime(a.timeHistory));
      const avg = times.length ? times.reduce((a, b) => a + b, 0) / times.length : 0;
      return { template: t, count: acts.length, avgTime: avg };
    })
    .filter((t) => t.count > 0)
    .sort((a, b) => b.count - a.count);

  if (activities.length === 0 && issues.length === 0 && ideas.length === 0) {
    return <div className="empty-state"><div className="icon">📊</div><p>Aún no hay datos para analizar.</p></div>;
  }

  return (
    <div>
      <div className="section-title">Resumen</div>
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-value">{activities.filter((a) => !a.parentId).length}</div>
          <div className="stat-label">Actividades totales</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{active.length}</div>
          <div className="stat-label">Activas ahora</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{formatDuration(totalTime)}</div>
          <div className="stat-label">Tiempo total</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{completed.length ? formatDuration(totalTime / completed.length) : "—"}</div>
          <div className="stat-label">Promedio/actividad</div>
        </div>
      </div>

      {(issues.length > 0 || ideas.length > 0) && (
        <>
          <div className="section-title">Problemas e Ideas</div>
          <div className="stat-grid">
            {issues.length > 0 && (
              <>
                <div className="stat-card">
                  <div className="stat-value" style={{ color: "var(--issue-color)" }}>{issues.filter((i) => i.status !== "resolved").length}</div>
                  <div className="stat-label">Problemas abiertos</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{issues.filter((i) => i.status === "resolved").length}</div>
                  <div className="stat-label">Problemas resueltos</div>
                </div>
              </>
            )}
            {ideas.length > 0 && (
              <>
                <div className="stat-card">
                  <div className="stat-value" style={{ color: "var(--idea-color)" }}>{ideas.filter((i) => i.status === "open").length}</div>
                  <div className="stat-label">Ideas abiertas</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{ideas.filter((i) => i.status === "implemented").length}</div>
                  <div className="stat-label">Ideas implementadas</div>
                </div>
              </>
            )}
          </div>
        </>
      )}

      {tagTimeList.length > 0 && (
        <>
          <div className="section-title">Tiempo por etiqueta</div>
          <div className="detail-section">
            {tagTimeList.map(({ tag, time, count }) => (
              <div key={tag.id} className="chart-bar-container">
                <div className="chart-bar-label">
                  <span style={{ color: tag.color }}>{tag.name} <span style={{ color: "var(--text-muted)" }}>({count})</span></span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}>{formatDuration(time)}</span>
                </div>
                <div className="chart-bar-track">
                  <div className="chart-bar-fill" style={{ width: `${(time / maxTagTime) * 100}%`, background: tag.color }} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {templateStats.length > 0 && (
        <>
          <div className="section-title">Tareas recurrentes</div>
          <div className="detail-section">
            {templateStats.map(({ template, count, avgTime }) => (
              <div key={template.id} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{template.name}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--text-secondary)" }}>{count}x</span>
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: 2 }}>Promedio: {formatDuration(avgTime)}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}