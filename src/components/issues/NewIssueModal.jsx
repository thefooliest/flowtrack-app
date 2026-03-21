import { useState } from "react";
import { uid, now } from "../../utils";
import Icon from "../../icons";
import TagInput from "../shared/TagInput";

export default function NewIssueModal({ db, onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [relatedActivities, setRelatedActivities] = useState([]);
  const activities = db.getActivities().filter((a) => !a.parentId);

  const toggleActivity = (id) => {
    setRelatedActivities((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    if (!title.trim()) return;
    const tagIds = tags.map((t) => {
      const existing = db.getTag(t.id);
      if (!existing) return db.findOrCreateTag(t.name).id;
      return t.id;
    });

    const issue = {
      id: uid(),
      title: title.trim(),
      description: description.trim(),
      tags: tagIds,
      status: "open",
      relatedActivities,
      linkedIdeas: [],
      createdAt: now(),
      resolvedAt: null,
    };
    onSave(issue);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">Nuevo problema</div>
        <div className="form-group">
          <label className="form-label">Título</label>
          <input className="form-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="¿Qué problema o conflicto surgió?" autoFocus />
        </div>
        <div className="form-group">
          <label className="form-label">Descripción</label>
          <textarea className="form-input" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Contexto, impacto, qué lo causa..." rows={3} />
        </div>
        <div className="form-group">
          <label className="form-label">Etiquetas</label>
          <TagInput db={db} selectedTags={tags} onChange={setTags} />
        </div>

        {activities.length > 0 && (
          <div className="form-group">
            <label className="form-label">Actividades relacionadas</label>
            <div className="relation-list">
              {activities.map((a) => (
                <label key={a.id} className="relation-item">
                  <input type="checkbox" checked={relatedActivities.includes(a.id)} onChange={() => toggleActivity(a.id)} style={{ accentColor: "var(--accent)" }} />
                  <span>{a.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button className="btn" onClick={onClose}>Cancelar</button>
          <button className="btn btn-issue" onClick={handleSave} disabled={!title.trim()}>
            <Icon name="alert" size={14} /> Registrar
          </button>
        </div>
      </div>
    </div>
  );
}