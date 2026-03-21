# FlowTrack

Tracker de actividades, sub-tareas y problemas/conflictos.

## Inicio rápido

```bash
# 1. Instalar dependencias
npm install

# 2. Correr en modo desarrollo (HTTP, solo local)
npm run dev

# 3. Correr con HTTPS (para acceder desde el celular)
npm run dev:https
```

## Acceso desde el celular

1. Corre `npm run dev:https`
2. Vite te mostrará algo como:
   ```
   ➜  Local:   https://localhost:5173/
   ➜  Network: https://192.168.1.XXX:5173/
   ```
3. Abre la URL de **Network** en el navegador de tu celular
4. El navegador te advertirá del certificado autofirmado → acepta/continúa
5. En Chrome: menú ⋮ → "Añadir a pantalla de inicio"
   En Safari: compartir → "Añadir a pantalla de inicio"

## Estructura

```
flowtrack-app/
├── index.html              # Entry HTML con meta tags PWA
├── vite.config.js          # Vite + React + SSL
├── package.json
├── public/
│   ├── manifest.json       # PWA manifest
│   ├── sw.js               # Service Worker (cache offline)
│   └── icon.svg            # App icon
└── src/
    ├── main.jsx            # React entry
    └── FlowTrack.jsx       # Toda la app
```

## Modelo de datos

- **Activity**: nombre, tags, notas, timeHistory (emparejamientos), status, parentId/parentType
- **ActivityTemplate**: plantillas para tareas recurrentes
- **Tag**: nombre, color, activityList
- **Issue**: problemas/conflictos con soluciones propuestas
- **Process**: (futuro) para conexión con BPMN

## Export/Import

En Configuración → Exportar JSON / Importar JSON.
Los datos se guardan en `localStorage` del navegador.

## Build para producción

```bash
npm run build
# Output en dist/ — deploy a Vercel, Netlify, o cualquier hosting estático
```
# Flowtrack
