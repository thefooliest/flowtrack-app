import { useState } from "react";
import { now } from "../../utils";
import Icon from "../../icons";
import TagPill from "../shared/TagPill";
import ConfirmModal from "../shared/ConfirmModal";
import NewIdeaModal from "../ideas/NewIdeaModal";

export default function IssueDetail({ issue, db, onBack, onRefresh }) {
  const [showNewIdea, setShowNewIdea] = useState(false);
  const [showLinkIdea, setShowLinkIdea] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const tags = (issue.tags || []).map((tid) => db.getTag(tid)).filter(Boolean);
  const relatedActs = (issue.relatedActivities || []).map((id) => db.getActivity(id)).filter(Boolean);
  const linkedIdeas = (issue.linkedIdeas || []).map((id) => db.getIdea(id)).filter(Boolean);

  // Ideas not yet linked to this issue
  const availableIdeas = db.getIdeas().filter((i) => !(issue.linkedIdeas || []).includes(i.id));

  const updateStatus = (status) => {
    db.updateIssue(issue.id, { status, ...(status === "resolved" ? { resolvedAt: now() } : { resolvedAt: null }) });
    onRefresh();
  };

  const linkIdea = (ideaId) => {
    const current = issue.linkedIdeas || [];
    if (!current.includes(ideaId)) {
      db.updateIssue(issue.id, { linkedIdeas: [...current, ideaId] });
      // Also add issue to idea's relatedIssues
      const idea = db.getIdea(ideaId);
      if (idea) {
        const ideaIssues = idea.relatedIssues || [];
        if (!ideaIssues.includes(issue.id)) {
          db.updateIdea(ideaId, { relatedIssues: [...ideaIssues, issue.id] });
        }
      }
    }
    setShowLinkIdea(false);
    onRefresh();
  };

  const unlinkIdea = (ideaId) => {
    db.updateIssue(issue.id, { linkedIdeas: (issue.linkedIdeas || []).filter((id) => id !== ideaId) });
    const idea = db.getIdea(ideaId);
    if (idea) {
      db.updateIdea(ideaId, { relatedIssues: (idea.relatedIssues || []).filter((id) => id !== issue.id) });
    }
    onRefresh();
  };

  const handleNewIdea = (idea) => {
    db.addIdea(idea);
    // Auto-link the new idea to this issue
    const current = issue.linkedIdeas || [];
    db.updateIssue(issue.id, { linkedIdeas: [...current, idea.id] });
    // Add issue to idea's relatedIssues
    db.updateIdea(idea.id, { relatedIssues: [...(idea.relatedIssues || []), issue.id] });
    setShowNewIdea(false);
    onRefresh();
  };

  const handleDelete = () => {
    db.deleteIssue(issue.id);
    onBack();
  };

  const statusLabel = issue.status === "open" ? "abierto" : issue.status === "exploring" ? "explorando" : "resuelto";

  return (
    <div>
      <div className="detail-header">
        <button className="back-btn" onClick={onBack}><Icon name="back" size={18} /></button>
        <span className="detail-name">{issue.title}</span>
        <span className={`issue-status issue-status-${issue.status}`}>{statusLabel}</span>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {issue.status === "open" && (
          <button className="btn btn-sm" style={{ background: "#fbbf2420", color: "var(--warning)" }} onClick={() => updateStatus("exploring")}>
            Explorar
          </button>
        )}
        {issue.status === "exploring" && (
          <button className="btn btn-sm btn-accent" onClick={() => updateStatus("resolved")}>
            <Icon name="check" size={14} /> Resuelto
          </button>
        )}
        {issue.status === "resolved" && (
          <button className="btn btn-sm" onClick={() => updateStatus("open")}>Reabrir</button>
        )}
        <button className="btn btn-sm btn-idea" onClick={() => setShowNewIdea(true)}>
          <Icon name="bulb" size={14} /> Nueva idea
        </button>
        {availableIdeas.length > 0 && (
          <button className="btn btn-sm" onClick={() => setShowLinkIdea(true)}>
            <Icon name="link" size={14} /> Vincular idea
          </button>
        )}
        <button className="btn btn-sm btn-danger" onClick={() => setShowConfirmDelete(true)}>
          <Icon name="trash" size={14} />
        </button>
      </div>

      {issue.description && (
        <div className="detail-section">
          <div className="detail-label">Descripción</div>
          <div className="detail-value">{issue.description}</div>
        </div>
      )}

      {tags.length > 0 && (
        <div className="detail-section">
          <div className="detail-label">Etiquetas</div>
          <div className="card-tags">{tags.map((t) => <TagPill key={t.id} tag={t} />)}</div>
        </div>
      )}

      {relatedActs.length > 0 && (
        <div className="detail-section">
          <div className="detail-label">Actividades relacionadas</div>
          {relatedActs.map((a) => (
            <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.85rem", marginTop: 6 }}>
              <Icon name="link" size={14} /><span>{a.name}</span>
              <span className={`card-status status-${a.status}`} style={{ fontSize: "0.65rem" }}>
                {a.status === "active" ? "activa" : a.status === "paused" ? "pausada" : "completada"}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Linked Ideas */}
      <div className="section-title">Ideas vinculadas ({linkedIdeas.length})</div>
      {linkedIdeas.length === 0 && (
        <div style={{ textAlign: "center", padding: "24px", color: "var(--text-muted)", fontSize: "0.85rem" }}>
          No hay ideas vinculadas. Crea o vincula una idea como posible solución.
        </div>
      )}
      {linkedIdeas.map((idea) => (
        <div key={idea.id} className="solution-item">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: 4 }}>{idea.title}</div>
              {idea.description && <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>{idea.description}</p>}
            </div>
            <span className={`idea-status idea-status-${idea.status}`} style={{ fontSize: "0.6rem" }}>
              {idea.status === "open" ? "abierta" : idea.status === "exploring" ? "explorando" : "implementada"}
            </span>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button className="btn btn-xs btn-danger" onClick={() => unlinkIdea(idea.id)}>
              Desvincular
            </button>
          </div>
        </div>
      ))}

      {/* Link existing idea modal */}
      {showLinkIdea && (
        <div className="modal-overlay modal-center" onClick={() => setShowLinkIdea(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">Vincular idea existente</div>
            <div className="relation-list" style={{ maxHeight: 300, overflowY: "auto" }}>
              {availableIdeas.map((idea) => (
                <div key={idea.id} className="relation-item" style={{ cursor: "pointer", padding: "10px 0" }} onClick={() => linkIdea(idea.id)}>
                  <Icon name="bulb" size={14} />
                  <span style={{ fontWeight: 500 }}>{idea.title}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
              <button className="btn" onClick={() => setShowLinkIdea(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {showNewIdea && <NewIdeaModal db={db} prelinkedIssueId={issue.id} onClose={() => setShowNewIdea(false)} onSave={handleNewIdea} />}
      {showConfirmDelete && (
        <ConfirmModal title="Eliminar problema" message={`¿Eliminar "${issue.title}"?`}
          onCancel={() => setShowConfirmDelete(false)} onConfirm={handleDelete} danger />
      )}
    </div>
  );
}