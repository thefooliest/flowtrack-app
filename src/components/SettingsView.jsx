import { useState } from "react";
import Icon from "../icons";

export default function SettingsView({ db, onRefresh }) {
  const [showPWA, setShowPWA] = useState(false);
  const data = db.getData();

  const handleExport = () => {
    const blob = new Blob([db.exportJSON()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url;
    a.download = `flowtrack_${new Date().toISOString().slice(0, 10)}.json`;
    a.click(); URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement("input"); input.type = "file"; input.accept = ".json";
    input.onchange = (e) => {
      const file = e.target.files[0]; if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => { if (db.importJSON(ev.target.result)) onRefresh(); };
      reader.readAsText(file);
    };
    input.click();
  };

  const stats = [
    ["Actividades", data.activities.length],
    ["Etiquetas", data.tags.length],
    ["Plantillas", data.templates.length],
    ["Problemas", data.issues?.length || 0],
    ["Ideas", data.ideas?.length || 0],
    ["TagLists", data.tagLists?.length || 0],
  ];

  return (
    <div>
      <div className="section-title">Datos</div>
      <div className="detail-section">
        {stats.map(([label, count]) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: 6 }}>
            <span style={{ color: "var(--text-secondary)" }}>{label}</span><span>{count}</span>
          </div>
        ))}
      </div>
      <div className="section-title">Exportar / Importar</div>
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <button className="btn" onClick={handleExport} style={{ flex: 1 }}><Icon name="download" size={16} /> Exportar JSON</button>
        <button className="btn" onClick={handleImport} style={{ flex: 1 }}>📂 Importar JSON</button>
      </div>
      <div className="section-title">Instalación PWA</div>
      <div className="detail-section">
        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: 12 }}>
          Desplegado en GitHub Pages. Abre la URL en tu celular y agrega a pantalla de inicio.
        </p>
        <button className="btn btn-sm" onClick={() => setShowPWA(!showPWA)}>{showPWA ? "Ocultar" : "Ver pasos"}</button>
        {showPWA && (
          <ol style={{ marginTop: 12, fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.8, paddingLeft: 20 }}>
            <li>Abre la URL de GitHub Pages en tu celular</li>
            <li>Chrome: menú ⋮ → "Añadir a pantalla de inicio"</li>
            <li>Safari: compartir → "Añadir a pantalla de inicio"</li>
          </ol>
        )}
      </div>
    </div>
  );
}