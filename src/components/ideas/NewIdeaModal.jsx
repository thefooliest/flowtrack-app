import { useState } from "react";
import { uid, now } from "../../utils";
import Icon from "../../icons";
import TagInput from "../shared/TagInput";

export default function NewIdeaModal({ db, onClose, onSave, prelinkedIssueId = null }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [relatedActivities, setRelatedActivities] = useState([]);
  const [relatedIssues, setRelatedIssues] = useState(prelinkedIssueId ? [prelinkedIssueId] : []);
  const [relatedIdeas, setRelatedIdeas] = useState([]);

  const activities = db.getActivities().filter((a) => !a.parentId);
  const issues = db.getIssues();
  const ideas = db.getIdeas();

  const handleSave = () => {
    if (!title.trim()) return;
    const tagIds = tags.map((t) => {
      const existing = db.getTag(t.id);
      if (!existing) return db.findOrCreateTag(t.name).id;
      return t.id;
    });

    const idea = {
      id: uid(),
      title: title.trim(),
      description: description.trim(),
      tags: tagIds,
      status: "open",
      relatedActivities,
      relatedIssues,
      relatedIdeas,
      createdAt: now(),
    };
    onSave(idea);
  };

  const toggleInList = (list, setList, id) => {
    setList(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">Nueva idea</div>

        <div className="form-group">
          <label className="form-label">Título</label>
          <input className="form-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="¿Qué idea tienes?" autoFocus />
        </div>
        <div className="form-group">
          <label className="form-label">Descripción</label>
          <textarea className="form-input" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe la idea..." rows={3} />
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
                  <input type="checkbox" checked={relatedActivities.includes(a.id)} onChange={() => toggleInList(relatedActivities, setRelatedActivities, a.id)} style={{ accentColor: "var(--accent)" }} />
                  <span>{a.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {issues.length > 0 && (
          <div className="form-group">
            <label className="form-label">Problemas relacionados</label>
            <div className="relation-list">
              {issues.map((i) => (
                <label key={i.id} className="relation-item">
                  <input type="checkbox" checked={relatedIssues.includes(i.id)} onChange={() => toggleInList(relatedIssues, setRelatedIssues, i.id)} style={{ accentColor: "var(--issue-color)" }} />
                  <span>{i.title}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {ideas.length > 0 && (
          <div className="form-group">
            <label className="form-label">Ideas relacionadas</label>
            <div className="relation-list">
              {ideas.map((i) => (
                <label key={i.id} className="relation-item">
                  <input type="checkbox" checked={relatedIdeas.includes(i.id)} onChange={() => toggleInList(relatedIdeas, setRelatedIdeas, i.id)} style={{ accentColor: "var(--idea-color)" }} />
                  <span>{i.title}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button className="btn" onClick={onClose}>Cancelar</button>
          <button className="btn btn-idea" onClick={handleSave} disabled={!title.trim()}>
            <Icon name="bulb" size={14} /> Crear
          </button>
        </div>
      </div>
    </div>
  );
}