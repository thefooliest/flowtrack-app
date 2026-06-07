import { useState, useRef } from "react";
import TagPill from "./TagPill";

export default function TagInput({ db, selectedTags, onChange }) {
  const [input, setInput] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const inputRef = useRef(null);

  // Re-read tags from DB each render to pick up newly created ones
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
    setRefreshKey((k) => k + 1);
  };

  const removeTag = (id) => {
    onChange(selectedTags.filter((t) => t.id !== id));
  };

  const handleKeyDown = (e) => {
    
    if (e.key === "Backspace" && input === "" && selectedTags.length > 0) {
      removeTag(selectedTags[selectedTags.length - 1].id);
    }
  };
  const handleChange = (e) =>{
    if(e.target.value.at(-1)===','){
      const tag = db.findOrCreateTag(input.trim());
      addTag(tag);
    }else{
      setInput(e.target.value);
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
          onChange={(e) => {handleChange(e)}}
          onKeyDown={handleKeyDown}
          placeholder={selectedTags.length ? "" : "Escribe y presiona la tecla coma..."}
        />
      </div>
      {(input.length > 0 || suggestions.length > 0) && suggestions.length > 0 && (
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