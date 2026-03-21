import { useState } from "react";
import { uid, now } from "../../utils";
import Icon from "../../icons";

export default function NewSolutionModal({ onClose, onSave }) {
  const [description, setDescription] = useState("");

  const handleSave = () => {
    if (!description.trim()) return;
    onSave({
      id: uid(),
      description: description.trim(),
      status: "proposed",
      createdAt: now(),
    });
  };

  return (
    <div className="modal-overlay modal-center" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">Proponer solución</div>

        <div className="form-group">
          <label className="form-label">Descripción de la solución</label>
          <textarea
            className="form-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="¿Qué solución propones?"
            rows={3}
            autoFocus
          />
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button className="btn" onClick={onClose}>Cancelar</button>
          <button className="btn btn-accent" onClick={handleSave} disabled={!description.trim()}>
            <Icon name="bulb" size={14} /> Proponer
          </button>
        </div>
      </div>
    </div>
  );
}
