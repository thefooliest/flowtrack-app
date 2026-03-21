import { useState } from "react";
import { uid, now } from "../utils";
import Icon from "../icons";
import TagPill from "./shared/TagPill";
import TagInput from "./shared/TagInput";

export default function TemplatesView({ db, onRefresh }) {
  const templates = db.getTemplates();
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [newTags, setNewTags] = useState([]);

  const handleSave = () => {
    if (!newName.trim()) return;
    db.addTemplate({
      id: uid(),
      name: newName.trim(),
      defaultTags: newTags.map((t) => t.id),
      isRecurring: true,
      createdAt: now(),
    });
    setNewName("");
    setNewTags([]);
    setShowNew(false);
    onRefresh();
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div className="section-title" style={{ margin: 0 }}>Plantillas</div>
        <button className="btn btn-sm btn-accent" onClick={() => setShowNew(true)}>
          <Icon name="plus" size={14} /> Nueva
        </button>
      </div>

      {templates.length === 0 && !showNew && (
        <div className="empty-state">
          <div className="icon">📋</div>
          <p>No hay plantillas aún.</p>
        </div>
      )}

      {templates.map((t) => {
        const tt = t.defaultTags.map((tid) => db.getTag(tid)).filter(Boolean);
        const usages = db.getActivities().filter((a) => a.templateId === t.id).length;
        return (
          <div key={t.id} className="activity-card" style={{ cursor: "default" }}>
            <div className="card-top">
              <span className="card-name">{t.name}</span>
              <button
                className="btn btn-xs btn-danger"
                onClick={() => { db.deleteTemplate(t.id); onRefresh(); }}
              >
                <Icon name="trash" size={12} />
              </button>
            </div>
            <div className="card-tags" style={{ marginBottom: 4 }}>
              {tt.map((tg) => <TagPill key={tg.id} tag={tg} />)}
            </div>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              Usada {usages} {usages === 1 ? "vez" : "veces"}
            </span>
          </div>
        );
      })}

      {showNew && (
        <div className="modal-overlay" onClick={() => setShowNew(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">Nueva plantilla</div>
            <div className="form-group">
              <label className="form-label">Nombre</label>
              <input
                className="form-input"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Ej: Revisión de facturas"
                autoFocus
              />
            </div>
            <div className="form-group">
              <label className="form-label">Etiquetas por defecto</label>
              <TagInput db={db} selectedTags={newTags} onChange={setNewTags} />
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button className="btn" onClick={() => setShowNew(false)}>Cancelar</button>
              <button className="btn btn-accent" onClick={handleSave} disabled={!newName.trim()}>
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
