import Icon from "../../icons";
import LiveTimer from "../shared/LiveTimer";
import TagPill from "../shared/TagPill";
import { relativeTime, formatDuration, calcRealTime } from "../../utils";

export default function ActivityCard({ activity, db, onClick, onAction, onNewSub }) {
  const tags = activity.tags.map((tid) => db.getTag(tid)).filter(Boolean);
  const children = db.getChildren(activity.id);
  const isActive = activity.status === "active";
  const isPaused = activity.status === "paused";

  // Show parent name if it's a subtask
  const parent =
    activity.parentId && activity.parentType === "activity"
      ? db.getActivity(activity.parentId)
      : null;

  return (
    <div
      className={`activity-card ${isActive ? "is-active" : ""} ${isPaused ? "is-paused" : ""}`}
      onClick={onClick}
    >
      {parent && (
        <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginBottom: 6, display: "flex", alignItems: "center", gap: 4 }}>
          <Icon name="subtask" size={10} /> Sub-tarea de <strong style={{ color: "var(--text-secondary)" }}>{parent.name}</strong>
        </div>
      )}

      <div className="card-top">
        <span className="card-name">{activity.name}</span>
        <span className={`card-status status-${activity.status}`}>
          {isActive ? "activa" : isPaused ? "pausada" : "completada"}
        </span>
      </div>

      <div className="card-meta">
        <LiveTimer timeHistory={activity.timeHistory} />
        <span>{relativeTime(activity.createdAt)}</span>
        {children.length > 0 && (
          <span className="card-children-count">
            <Icon name="subtask" size={12} /> {children.length}
          </span>
        )}
      </div>

      {tags.length > 0 && (
        <div className="card-tags">
          {tags.map((t) => <TagPill key={t.id} tag={t} />)}
        </div>
      )}

      <div className="card-actions" onClick={(e) => e.stopPropagation()}>
        {isActive && (
          <>
            <button className="btn btn-xs" onClick={() => onAction("pause", activity.id)}>
              <Icon name="pause" size={12} /> Pausar
            </button>
            <button className="btn btn-xs btn-accent" onClick={() => onAction("complete", activity.id)}>
              <Icon name="stop" size={12} /> Completar
            </button>
          </>
        )}
        {isPaused && (
          <button className="btn btn-xs btn-accent" onClick={() => onAction("resume", activity.id)}>
            <Icon name="play" size={12} /> Reanudar
          </button>
        )}
        {activity.status === "completed" && (
          <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
            {formatDuration(calcRealTime(activity.timeHistory))} total
          </span>
        )}
        <button
          className="btn btn-xs"
          onClick={() => onNewSub(activity.id)}
          title="Agregar sub-tarea"
          style={{ marginLeft: "auto" }}
        >
          <Icon name="subtask" size={12} /> Sub-tarea
        </button>
      </div>
    </div>
  );
}