import { useState } from "react";
import { now } from "../../utils";
import Icon from "../../icons";
import TagPill from "../shared/TagPill";
import ConfirmModal from "../shared/ConfirmModal";

export default function IdeaDetail({ idea, db, onBack, onRefresh }) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [editingDesc, setEditingDesc] = useState(false);
  const [descValue, setDescValue] = useState(idea.description || "");

  const tags = (idea.tags || []).map((tid) => db.getTag(tid)).filter(Boolean);
  const relatedActs = (idea.relatedActivities || []).map((id) => db.getActivity(id)).filter(Boolean);
  const relatedIssues = (idea.relatedIssues || []).map((id) => db.getIssue(id)).filter(Boolean);
  const relatedIdeas = (idea.relatedIdeas || []).map((id) => db.getIdea(id)).filter(Boolean);

  const updateStatus = (status) => {
    db.updateIdea(idea.id, { status });
    onRefresh();
  };

  const handleSaveDesc = () => {
    db.updateIdea(idea.id, { description: descValue.trim() });
    setEditingDesc(false);
    onRefresh();
  };

  const handleDelete = () => {
    db.deleteIdea(idea.id);
    onBack();
  };

  const statusLabel = idea.status === "open" ? "abierta" : idea.status === "exploring" ? "explorando" : "implementada";

  return (
    <div>
      <div className="detail-header">
        <button className="back-btn" onClick={onBack}><Icon name="back" size={18} /></button>
        <span className="detail-name">{idea.title}</span>
        <span className={`idea-status idea-status-${idea.status}`}>{statusLabel}</span>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {idea.status === "open" && (
          <button className="btn btn-sm" style={{ background: "#fbbf2420", color: "var(--warning)" }} onClick={() => updateStatus("exploring")}>
            Explorar
          </button>
        )}
        {idea.status === "exploring" && (
          <button className="btn btn-sm btn-accent" onClick={() => updateStatus("implemented")}>
            <Icon name="check" size={14} /> Implementada
          </button>
        )}
        {idea.status === "implemented" && (
          <button className="btn btn-sm" onClick={() => updateStatus("open")}>Reabrir</button>
        )}
        <button className="btn btn-sm btn-danger" onClick={() => setShowConfirmDelete(true)}>
          <Icon name="trash" size={14} />
        </button>
      </div>

      {/* Editable description */}
      <div className="detail-section">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="detail-label">Descripción</div>
          {!editingDesc && (
            <button className="btn btn-xs" onClick={() => { setDescValue(idea.description || ""); setEditingDesc(true); }}>
              Editar
            </button>
          )}
        </div>
        {editingDesc ? (
          <div>
            <textarea className="form-input" value={descValue} onChange={(e) => setDescValue(e.target.value)} rows={3} autoFocus />
            <div style={{ display: "flex", gap: 8, marginTop: 8, justifyContent: "flex-end" }}>
              <button className="btn btn-xs" onClick={() => setEditingDesc(false)}>Cancelar</button>
              <button className="btn btn-xs btn-accent" onClick={handleSaveDesc}>Guardar</button>
            </div>
          </div>
        ) : (
          <div className="detail-value" style={{ color: idea.description ? "var(--text-primary)" : "var(--text-muted)" }}>
            {idea.description || "Sin descripción"}
          </div>
        )}
      </div>

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

      {relatedIssues.length > 0 && (
        <div className="detail-section">
          <div className="detail-label">Problemas relacionados</div>
          {relatedIssues.map((i) => (
            <div key={i.id} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.85rem", marginTop: 6 }}>
              <Icon name="alert" size={14} /><span>{i.title}</span>
              <span className={`issue-status issue-status-${i.status}`} style={{ fontSize: "0.6rem" }}>
                {i.status === "open" ? "abierto" : i.status === "exploring" ? "explorando" : "resuelto"}
              </span>
            </div>
          ))}
        </div>
      )}

      {relatedIdeas.length > 0 && (
        <div className="detail-section">
          <div className="detail-label">Ideas relacionadas</div>
          {relatedIdeas.map((i) => (
            <div key={i.id} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.85rem", marginTop: 6 }}>
              <Icon name="bulb" size={14} /><span>{i.title}</span>
            </div>
          ))}
        </div>
      )}

      {showConfirmDelete && (
        <ConfirmModal title="Eliminar idea" message={`¿Eliminar "${idea.title}"?`}
          onCancel={() => setShowConfirmDelete(false)} onConfirm={handleDelete} danger />
      )}
    </div>
  );
}