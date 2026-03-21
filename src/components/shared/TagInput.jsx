import { useState, useRef } from "react";
import TagPill from "./TagPill";

export default function TagInput({ db, selectedTags, onChange }) {
  const [input, setInput] = useState("");
  const inputRef = useRef(null);
  const allTags = db.getTags();

  const suggestions = allTags
    .filter(
      (t) =>
        !selectedTags.find((s) => s.id === t.id) &&
        (input === "" || t.name.toLowerCase().includes(input.toLowerCase()))
    )
    .slice(0, 6);

  const addTag = (tag) => {
    onChange([...selectedTags, tag]);
    setInput("");
  };

  const removeTag = (id) => {
    onChange(selectedTags.filter((t) => t.id !== id));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && input.trim()) {
      e.preventDefault();
      addTag(db.findOrCreateTag(input.trim()));
    }
    if (e.key === "Backspace" && input === "" && selectedTags.length > 0) {
      removeTag(selectedTags[selectedTags.length - 1].id);
    }
  };

  return (
    <div>
      <div className="tag-input-area" onClick={() => inputRef.current?.focus()}>
        {selectedTags.map((t) => (
          <TagPill key={t.id} tag={t} removable onRemove={() => removeTag(t.id)} />
        ))}
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={selectedTags.length ? "" : "Escribe y presiona Enter..."}
        />
      </div>
      {suggestions.length > 0 && (
        <div className="tag-suggestions">
          {suggestions.map((t) => (
            <span key={t.id} className="tag-suggestion" onClick={() => addTag(t)}>
              + {t.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
