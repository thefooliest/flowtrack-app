# Guía: Compilar FlowTrack como app nativa Android

## Requisitos previos

1. **Android Studio** instalado ([descargar](https://developer.android.com/studio))
2. **Java JDK 17+** (Android Studio lo incluye)
3. **Node.js 18+** y npm

## Pasos para generar el APK

### 1. Instalar dependencias

```bash
npm install
```

### 2. Hacer build de la web app

```bash
npm run build:android
```

Esto compila la app con `base: /` (en vez del path de GitHub Pages) y sincroniza con Capacitor.

### 3. Inicializar Capacitor Android (solo la primera vez)

```bash
npx cap add android
```

Esto crea la carpeta `android/` con el proyecto de Android Studio.

### 4. Sincronizar cambios web → Android

Cada vez que cambies código web:

```bash
npm run build:android
```

### 5. Abrir en Android Studio

```bash
npx cap open android
```

Esto abre el proyecto en Android Studio. Desde ahí puedes:

- **Correr en emulador**: clic en ▶ Run
- **Correr en dispositivo**: conecta tu celular por USB con depuración USB activada
- **Generar APK**: Build → Build Bundle(s) / APK(s) → Build APK(s)
- **Generar AAB para Play Store**: Build → Generate Signed Bundle / APK

### 6. APK de debug rápido

Si solo quieres un APK para instalar en tu celular sin pasar por Play Store:

```bash
cd android
./gradlew assembleDebug
```

El APK queda en `android/app/build/outputs/apk/debug/app-debug.apk`.
Lo copias a tu celular y lo instalas (necesitas habilitar "instalar desde fuentes desconocidas").

## Personalización del ícono

Reemplaza los archivos en:
```
android/app/src/main/res/mipmap-*/ic_launcher.png
android/app/src/main/res/mipmap-*/ic_launcher_round.png
```

O usa Android Studio: clic derecho en `res` → New → Image Asset.

## Notas

- La app funciona 100% offline — los datos se guardan en localStorage del WebView
- El `server.androidScheme: 'https'` permite que el service worker funcione dentro del WebView
- Para publicar en Play Store necesitas firmar el APK con un keystore (Android Studio te guía en el proceso)
- El `build:android` usa `base: /` porque dentro del WebView nativo la app se sirve desde la raíz, no desde un subdirectorio como en GitHub Pages