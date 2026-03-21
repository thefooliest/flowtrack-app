import Icon from "../../icons";
import TagPill from "../shared/TagPill";
import { relativeTime } from "../../utils";

export default function IdeaCard({ idea, db, onClick }) {
  const tags = (idea.tags || []).map((tid) => db.getTag(tid)).filter(Boolean);
  const relCount = (idea.relatedActivities?.length || 0) + (idea.relatedIssues?.length || 0) + (idea.relatedIdeas?.length || 0);

  return (
    <div className={`idea-card is-${idea.status}`} onClick={onClick}>
      <div className="card-top">
        <span className="card-name">{idea.title}</span>
        <span className={`idea-status idea-status-${idea.status}`}>
          {idea.status === "open" ? "abierta" : idea.status === "exploring" ? "explorando" : "implementada"}
        </span>
      </div>
      {idea.description && (
        <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: 8, lineHeight: 1.4 }}>
          {idea.description.length > 120 ? idea.description.slice(0, 120) + "..." : idea.description}
        </p>
      )}
      <div className="card-meta">
        <span>{relativeTime(idea.createdAt)}</span>
        {relCount > 0 && (
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Icon name="link" size={12} /> {relCount} relación{relCount !== 1 ? "es" : ""}
          </span>
        )}
      </div>
      {tags.length > 0 && (
        <div className="card-tags">{tags.map((t) => <TagPill key={t.id} tag={t} />)}</div>
      )}
    </div>
  );
}