export default function ConfirmModal({ title, message, onConfirm, onCancel, danger }) {
  return (
    <div className="modal-overlay modal-center" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">{title}</div>
        <div className="confirm-text">{message}</div>
        <div className="confirm-actions">
          <button className="btn" onClick={onCancel}>Cancelar</button>
          <button className={`btn ${danger ? "btn-danger" : "btn-accent"}`} onClick={onConfirm}>
            {danger ? "Eliminar" : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
}
