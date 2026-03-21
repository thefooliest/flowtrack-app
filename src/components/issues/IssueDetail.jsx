import { useState } from "react";
import { now } from "../../utils";
import Icon from "../../icons";
import TagPill from "../shared/TagPill";
import ConfirmModal from "../shared/ConfirmModal";
import NewSolutionModal from "./NewSolutionModal";

const SOL_STATUS_LABELS = {
  proposed: "propuesta",
  testing: "probando",
  accepted: "aceptada",
  rejected: "rechazada",
};

export default function IssueDetail({ issue, db, onBack, onRefresh }) {
  const [showNewSolution, setShowNewSolution] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const tags = (issue.tags || []).map((tid) => db.getTag(tid)).filter(Boolean);
  const relatedActs = (issue.relatedActivities || [])
    .map((id) => db.getActivity(id))
    .filter(Boolean);
  const solutions = issue.solutions || [];

  const updateStatus = (status) => {
    db.updateIssue(issue.id, {
      status,
      ...(status === "resolved" ? { resolvedAt: now() } : { resolvedAt: null }),
    });
    onRefresh();
  };

  const addSolution = (sol) => {
    db.updateIssue(issue.id, { solutions: [...solutions, sol] });
    setShowNewSolution(false);
    onRefresh();
  };

  const updateSolutionStatus = (solId, status) => {
    const updated = solutions.map((s) => (s.id === solId ? { ...s, status } : s));
    db.updateIssue(issue.id, { solutions: updated });
    onRefresh();
  };

  const deleteSolution = (solId) => {
    db.updateIssue(issue.id, { solutions: solutions.filter((s) => s.id !== solId) });
    onRefresh();
  };

  const handleDelete = () => {
    db.deleteIssue(issue.id);
    onBack();
  };

  const statusLabel =
    issue.status === "open" ? "abierto" : issue.status === "exploring" ? "explorando" : "resuelto";

  return (
    <div>
      {/* Header */}
      <div className="detail-header">
        <button className="back-btn" onClick={onBack}>
          <Icon name="back" size={18} />
        </button>
        <span className="detail-name">{issue.title}</span>
        <span className={`issue-status issue-status-${issue.status}`}>{statusLabel}</span>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {issue.status === "open" && (
          <button
            className="btn btn-sm"
            style={{ background: "#fbbf2420", color: "var(--warning)" }}
            onClick={() => updateStatus("exploring")}
          >
            Explorar soluciones
          </button>
        )}
        {issue.status === "exploring" && (
          <button className="btn btn-sm btn-accent" onClick={() => updateStatus("resolved")}>
            <Icon name="check" size={14} /> Marcar resuelto
          </button>
        )}
        {issue.status === "resolved" && (
          <button className="btn btn-sm" onClick={() => updateStatus("open")}>
            Reabrir
          </button>
        )}
        <button className="btn btn-sm" onClick={() => setShowNewSolution(true)}>
          <Icon name="bulb" size={14} /> Proponer solución
        </button>
        <button className="btn btn-sm btn-danger" onClick={() => setShowConfirmDelete(true)}>
          <Icon name="trash" size={14} />
        </button>
      </div>

      {/* Description */}
      {issue.description && (
        <div className="detail-section">
          <div className="detail-label">Descripción</div>
          <div className="detail-value">{issue.description}</div>
        </div>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="detail-section">
          <div className="detail-label">Etiquetas</div>
          <div className="card-tags">
            {tags.map((t) => <TagPill key={t.id} tag={t} />)}
          </div>
        </div>
      )}

      {/* Related activities */}
      {relatedActs.length > 0 && (
        <div className="detail-section">
          <div className="detail-label">Actividades relacionadas</div>
          {relatedActs.map((a) => (
            <div
              key={a.id}
              style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.85rem", marginTop: 6 }}
            >
              <Icon name="link" size={14} />
              <span>{a.name}</span>
              <span className={`card-status status-${a.status}`} style={{ fontSize: "0.65rem" }}>
                {a.status === "active" ? "activa" : a.status === "paused" ? "pausada" : "completada"}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Solutions */}
      <div className="section-title">Soluciones ({solutions.length})</div>
      {solutions.length === 0 && (
        <div style={{ textAlign: "center", padding: "24px", color: "var(--text-muted)", fontSize: "0.85rem" }}>
          Aún no hay soluciones propuestas.
        </div>
      )}
      {solutions.map((sol) => (
        <div key={sol.id} className="solution-item">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
            <p style={{ fontSize: "0.88rem", lineHeight: 1.5, flex: 1 }}>{sol.description}</p>
            <span className={`solution-status sol-${sol.status}`}>
              {SOL_STATUS_LABELS[sol.status]}
            </span>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {sol.status === "proposed" && (
              <>
                <button
                  className="btn btn-xs"
                  style={{ background: "#fbbf2420", color: "var(--warning)" }}
                  onClick={() => updateSolutionStatus(sol.id, "testing")}
                >
                  Probar
                </button>
                <button className="btn btn-xs btn-danger" onClick={() => updateSolutionStatus(sol.id, "rejected")}>
                  Rechazar
                </button>
              </>
            )}
            {sol.status === "testing" && (
              <>
                <button className="btn btn-xs btn-accent" onClick={() => updateSolutionStatus(sol.id, "accepted")}>
                  <Icon name="check" size={10} /> Aceptar
                </button>
                <button className="btn btn-xs btn-danger" onClick={() => updateSolutionStatus(sol.id, "rejected")}>
                  Rechazar
                </button>
              </>
            )}
            {(sol.status === "accepted" || sol.status === "rejected") && (
              <button className="btn btn-xs" onClick={() => updateSolutionStatus(sol.id, "proposed")}>
                Reabrir
              </button>
            )}
            <button
              className="btn btn-xs btn-danger"
              onClick={() => deleteSolution(sol.id)}
              style={{ marginLeft: "auto" }}
            >
              <Icon name="trash" size={10} />
            </button>
          </div>
        </div>
      ))}

      {/* Modals */}
      {showNewSolution && (
        <NewSolutionModal onClose={() => setShowNewSolution(false)} onSave={addSolution} />
      )}
      {showConfirmDelete && (
        <ConfirmModal
          title="Eliminar problema"
          message={`¿Eliminar "${issue.title}" y todas sus soluciones?`}
          onCancel={() => setShowConfirmDelete(false)}
          onConfirm={handleDelete}
          danger
        />
      )}
    </div>
  );
}
