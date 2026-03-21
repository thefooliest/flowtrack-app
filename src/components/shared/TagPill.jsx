export default function TagPill({ tag, removable, onRemove }) {
  const style = { background: tag.color + "20", color: tag.color };

  if (removable) {
    return (
      <span className="tag-pill tag-removable" style={style} onClick={onRemove}>
        {tag.name}
        <span className="tag-x">✕</span>
      </span>
    );
  }

  return (
    <span className="tag-pill" style={style}>
      {tag.name}
    </span>
  );
}
