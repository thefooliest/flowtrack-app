import { useState } from "react";
import { uid, now } from "../../utils";
import Icon from "../../icons";
import TagInput from "../shared/TagInput";

export default function NewActivityModal({ db, onClose, onSave, parentId = null }) {
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [tags, setTags] = useState([]);
  const [templateId, setTemplateId] = useState(null);
  const [saveAsTemplate, setSaveAsTemplate] = useState(false);
  const templates = db.getTemplates();

  const handleTemplate = (tmpl) => {
    setName(tmpl.name);
    setTags(tmpl.defaultTags.map((tid) => db.getTag(tid)).filter(Boolean));
    setTemplateId(tmpl.id);
  };

  const handleSave = () => {
    if (!name.trim()) return;
    const tagIds = tags.map((t) => t.id);
    const activity = {
      id: uid(),
      name: name.trim(),
      tags: tagIds,
      notes: notes.trim(),
      status: "active",
      timeHistory: [now()],
      parentId: parentId || null,
      parentType: parentId ? "activity" : null,
      templateId: templateId || null,
      createdAt: now(),
    };

    tagIds.forEach((tid) => {
      const tag = db.getTag(tid);
      if (tag && !tag.activityList.includes(activity.id)) {
        db.updateTag(tid, { activityList: [...tag.activityList, activity.id] });
      }
    });

    if (saveAsTemplate && !templateId) {
      db.addTemplate({
        id: uid(),
        name: name.trim(),
        defaultTags: tagIds,
        isRecurring: true,
        createdAt: now(),
      });
    }

    onSave(activity);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">
          {parentId ? "Nueva sub-tarea" : "Nueva actividad"}
        </div>

        {!parentId && templates.length > 0 && (
          <>
            <div className="section-title">Inicio rápido</div>
            <div className="templates-grid">
              {templates.map((t) => {
                const tt = t.defaultTags.map((tid) => db.getTag(tid)).filter(Boolean);
                return (
                  <button key={t.id} className="template-btn" onClick={() => handleTemplate(t)}>
                    <div className="template-name">{t.name}</div>
                    <div className="template-tags">
                      {tt.map((tg) => (
                        <span
                          key={tg.id}
                          className="template-tag"
                          style={{ background: tg.color + "20", color: tg.color }}
                        >
                          {tg.name}
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}

        <div className="form-group">
          <label className="form-label">Nombre</label>
          <input
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="¿Qué vas a hacer?"
            autoFocus
          />
        </div>

        <div className="form-group">
          <label className="form-label">Etiquetas</label>
          <TagInput db={db} selectedTags={tags} onChange={setTags} />
        </div>

        <div className="form-group">
          <label className="form-label">Notas (opcional)</label>
          <textarea
            className="form-input"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Contexto, objetivo, detalles..."
            rows={2}
          />
        </div>

        {!templateId && !parentId && (
          <label
            style={{
              display: "flex", alignItems: "center", gap: 8,
              fontSize: "0.85rem", color: "var(--text-secondary)",
              cursor: "pointer", marginBottom: 16,
            }}
          >
            <input
              type="checkbox"
              checked={saveAsTemplate}
              onChange={(e) => setSaveAsTemplate(e.target.checked)}
              style={{ accentColor: "var(--accent)" }}
            />
            Guardar como plantilla
          </label>
        )}

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button className="btn" onClick={onClose}>Cancelar</button>
          <button className="btn btn-accent" onClick={handleSave} disabled={!name.trim()}>
            <Icon name="play" size={14} /> Iniciar
          </button>
        </div>
      </div>
    </div>
  );
}
