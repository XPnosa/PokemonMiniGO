# Pokémon Mini Go

Un mini-juego al estilo Pokémon GO construido como app Cordova. Es una aplicación cliente pura en HTML/CSS/JS (sin backend, sin bundler, sin framework) empaquetada con Cordova para generar un APK de Android. Todo el estado de la partida vive en el `localStorage` del navegador.

## Características

- **Pokédex Nacional completa (n.º 001-1025)**, de Kanto a Paldea (Gen 1-9), con filtro por región.
- **Ruta**: paseo con encuentros salvajes, captura con Poké Ball / Súper Ball / Ultra Ball, XP y subida de nivel.
- **Selección de inicial**: los 27 iniciales oficiales (Gen 1-9).
- **Galería de formas alternativas**: Mega-evoluciones, Gigamax y formas regionales, accesibles desde la ficha de cada Pokémon mediante Poké Balls especiales.
- **Caja, Bolsa, Tienda, Evolución y Caramelos**, con progreso persistente en `localStorage`.

## Requisitos para compilar

- [Node.js](https://nodejs.org/) y Cordova CLI (`npm install -g cordova`)
- Para el APK de Android: JDK, Android SDK y Gradle instalados y accesibles en el `PATH`/variables de entorno correspondientes (`ANDROID_HOME`, `JAVA_HOME`)

## Comandos

Compilar el APK de Android:

```bash
cordova build android
```

El APK resultante queda en `platforms/android/app/build/outputs/apk/debug/app-debug.apk` (firmado en modo debug, válido para instalación manual).

Probar en el navegador de escritorio:

```bash
cordova platform add browser@latest   # solo si platforms/browser falta o está desactualizado
cordova run browser --no-open
```

Sirve la app en `http://localhost:8000/index.html` (o el siguiente puerto libre).

`www/` es la única fuente de verdad: no edites nada dentro de `platforms/`, se sobrescribe en cada `cordova prepare`/`build`.

## Autor

Juan Antonio Espinosa Prieto ([@XPnosa](https://github.com/XPnosa))
