import Icon from "../../icons";
import TagPill from "../shared/TagPill";
import { relativeTime } from "../../utils";

export default function IssueCard({ issue, db, onClick }) {
  const tags = (issue.tags || []).map((tid) => db.getTag(tid)).filter(Boolean);
  const linkedIdeas = (issue.linkedIdeas || []).map((id) => db.getIdea(id)).filter(Boolean);

  return (
    <div className={`issue-card is-${issue.status}`} onClick={onClick}>
      <div className="card-top">
        <span className="card-name">{issue.title}</span>
        <span className={`issue-status issue-status-${issue.status}`}>
          {issue.status === "open" ? "abierto" : issue.status === "exploring" ? "explorando" : "resuelto"}
        </span>
      </div>
      {issue.description && (
        <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: 8, lineHeight: 1.4 }}>
          {issue.description.length > 120 ? issue.description.slice(0, 120) + "..." : issue.description}
        </p>
      )}
      <div className="card-meta">
        <span>{relativeTime(issue.createdAt)}</span>
        {linkedIdeas.length > 0 && (
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Icon name="bulb" size={12} /> {linkedIdeas.length} idea{linkedIdeas.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>
      {tags.length > 0 && <div className="card-tags">{tags.map((t) => <TagPill key={t.id} tag={t} />)}</div>}
    </div>
  );
}