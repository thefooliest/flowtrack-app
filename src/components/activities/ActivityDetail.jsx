import { useState } from "react";
import { now, formatDuration, calcRealTime } from "../../utils";
import Icon from "../../icons";
import LiveTimer from "../shared/LiveTimer";
import TagPill from "../shared/TagPill";
import ConfirmModal from "../shared/ConfirmModal";
import ActivityCard from "./ActivityCard";
import NewActivityModal from "./NewActivityModal";

export default function ActivityDetail({ activity, db, onBack, onRefresh }) {
  const [showNewSub, setShowNewSub] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const tags = activity.tags.map((tid) => db.getTag(tid)).filter(Boolean);
  const children = db.getChildren(activity.id);

  // Build time blocks from timeHistory pairs
  const timeBlocks = [];
  for (let i = 0; i < activity.timeHistory.length - 1; i += 2) {
    const start = new Date(activity.timeHistory[i]);
    const end = new Date(activity.timeHistory[i + 1]);
    timeBlocks.push({ start, end, duration: end - start });
  }
  if (activity.timeHistory.length % 2 === 1) {
    const start = new Date(activity.timeHistory[activity.timeHistory.length - 1]);
    timeBlocks.push({ start, end: null, duration: Date.now() - start.getTime() });
  }
  const maxDuration = Math.max(...timeBlocks.map((b) => b.duration), 1);

  const handleAction = (action) => {
    const ts = now();
    if (action === "pause" || action === "complete") {
      db.updateActivity(activity.id, {
        status: action === "pause" ? "paused" : "completed",
        timeHistory: [...activity.timeHistory, ts],
      });
    } else if (action === "resume") {
      db.updateActivity(activity.id, {
        status: "active",
        timeHistory: [...activity.timeHistory, ts],
      });
    }
    onRefresh();
  };

  const handleDelete = () => {
    children.forEach((c) => db.deleteActivity(c.id));
    db.deleteActivity(activity.id);
    onBack();
  };

  const handleChildAction = (action, id) => {
    const ts = now();
    const c = db.getActivity(id);
    if (action === "pause" || action === "complete") {
      db.updateActivity(id, {
        status: action === "pause" ? "paused" : "completed",
        timeHistory: [...c.timeHistory, ts],
      });
    } else if (action === "resume") {
      db.updateActivity(id, {
        status: "active",
        timeHistory: [...c.timeHistory, ts],
      });
    }
    onRefresh();
  };

  const fmt = (d) =>
    d.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });

  return (
    <div>
      {/* Header */}
      <div className="detail-header">
        <button className="back-btn" onClick={onBack}>
          <Icon name="back" size={18} />
        </button>
        <span className="detail-name">{activity.name}</span>
        <span className={`card-status status-${activity.status}`}>
          {activity.status === "active"
            ? "activa"
            : activity.status === "paused"
            ? "pausada"
            : "completada"}
        </span>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {activity.status === "active" && (
          <>
            <button className="btn btn-sm" onClick={() => handleAction("pause")}>
              <Icon name="pause" size={14} /> Pausar
            </button>
            <button className="btn btn-sm btn-accent" onClick={() => handleAction("complete")}>
              <Icon name="stop" size={14} /> Completar
            </button>
          </>
        )}
        {activity.status === "paused" && (
          <>
            <button className="btn btn-sm btn-accent" onClick={() => handleAction("resume")}>
              <Icon name="play" size={14} /> Reanudar
            </button>
            <button className="btn btn-sm" onClick={() => handleAction("complete")}>
              <Icon name="stop" size={14} /> Completar
            </button>
          </>
        )}
        <button className="btn btn-sm" onClick={() => setShowNewSub(true)}>
          <Icon name="subtask" size={14} /> Sub-tarea
        </button>
        <button className="btn btn-sm btn-danger" onClick={() => setShowConfirmDelete(true)}>
          <Icon name="trash" size={14} />
        </button>
      </div>

      {/* Time section */}
      <div className="detail-section">
        <div className="detail-label">Tiempo real</div>
        <div
          style={{
            fontSize: "1.4rem",
            fontFamily: "var(--font-mono)",
            fontWeight: 700,
            color: "var(--accent)",
            marginBottom: 12,
          }}
        >
          <LiveTimer timeHistory={activity.timeHistory} />
        </div>
        <div className="detail-label" style={{ marginTop: 8 }}>Sesiones</div>
        <div className="time-blocks">
          {timeBlocks.map((b, i) => (
            <div key={i} className="time-block">
              <span>{fmt(b.start)}</span>
              <span style={{ color: "var(--text-muted)" }}>→</span>
              <span>{b.end ? fmt(b.end) : "ahora"}</span>
              <div
                className="time-block-bar"
                style={{ width: `${(b.duration / maxDuration) * 100}%` }}
              />
              <span>{formatDuration(b.duration)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="detail-section">
          <div className="detail-label">Etiquetas</div>
          <div className="card-tags">
            {tags.map((t) => <TagPill key={t.id} tag={t} />)}
          </div>
        </div>
      )}

      {/* Notes */}
      {activity.notes && (
        <div className="detail-section">
          <div className="detail-label">Notas</div>
          <div className="detail-value">{activity.notes}</div>
        </div>
      )}

      {/* Sub-tasks */}
      {children.length > 0 && (
        <>
          <div className="section-title">Sub-tareas ({children.length})</div>
          {children.map((child) => (
            <ActivityCard
              key={child.id}
              activity={child}
              db={db}
              onClick={() => {}}
              onAction={handleChildAction}
              onNewSub={() => setShowNewSub(true)}
            />
          ))}
        </>
      )}

      {/* Modals */}
      {showNewSub && (
        <NewActivityModal
          db={db}
          parentId={activity.id}
          onClose={() => setShowNewSub(false)}
          onSave={(a) => {
            db.addActivity(a);
            setShowNewSub(false);
            onRefresh();
          }}
        />
      )}

      {showConfirmDelete && (
        <ConfirmModal
          title="Eliminar actividad"
          message={`¿Eliminar "${activity.name}"?${
            children.length > 0
              ? ` Esto también eliminará ${children.length} sub-tarea(s).`
              : ""
          }`}
          onCancel={() => setShowConfirmDelete(false)}
          onConfirm={handleDelete}
          danger
        />
      )}
    </div>
  );
}
