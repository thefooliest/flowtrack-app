import Icon from "../../icons";
import TagPill from "../shared/TagPill";
import { relativeTime } from "../../utils";

export default function IssueCard({ issue, db, onClick }) {
  const tags = (issue.tags || []).map((tid) => db.getTag(tid)).filter(Boolean);
  const solutions = issue.solutions || [];
  const solutionCount = solutions.length;
  const accepted = solutions.filter((s) => s.status === "accepted").length;

  const statusLabel =
    issue.status === "open" ? "abierto" : issue.status === "exploring" ? "explorando" : "resuelto";

  return (
    <div className={`issue-card is-${issue.status}`} onClick={onClick}>
      <div className="card-top">
        <span className="card-name">{issue.title}</span>
        <span className={`issue-status issue-status-${issue.status}`}>{statusLabel}</span>
      </div>

      {issue.description && (
        <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: 8, lineHeight: 1.4 }}>
          {issue.description.length > 120
            ? issue.description.slice(0, 120) + "..."
            : issue.description}
        </p>
      )}

      <div className="card-meta">
        <span>{relativeTime(issue.createdAt)}</span>
        {solutionCount > 0 && (
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Icon name="bulb" size={12} /> {solutionCount} solución{solutionCount !== 1 ? "es" : ""}
            {accepted > 0 && (
              <span style={{ color: "var(--accent)" }}>
                ({accepted} aceptada{accepted !== 1 ? "s" : ""})
              </span>
            )}
          </span>
        )}
      </div>

      {tags.length > 0 && (
        <div className="card-tags">
          {tags.map((t) => <TagPill key={t.id} tag={t} />)}
        </div>
      )}
    </div>
  );
}
