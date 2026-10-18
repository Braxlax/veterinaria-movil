<<<<<<< HEAD
# veterinaria-movil
aplicación móvil para el curso de desarrollo de aplicaciones móvil 1
=======
# 🐾 Centro Médico Mr. Patitas — Gestión de solicitudes de atención

App móvil (React Native + Expo) para registrar y gestionar las solicitudes de atención de una clínica veterinaria
(consultas, vacunación, emergencias y grooming). Evaluación parcial — Desarrollo de Aplicaciones Móviles 1 (IDAT).

> Los datos viven **en memoria** (useReducer + Context). No usa base de datos: al cerrar la app se reinician.

## Requisitos

- Node.js 20 o superior y npm
- Android Studio con un emulador (AVD) creado **o** un celular Android con "Depuración USB"
  (en iOS: Xcode + simulador, solo macOS)
- Variables de entorno `ANDROID_HOME` y `platform-tools` en el `PATH` (para que funcione `adb`)

## Instalación

```bash
npm install
```

## Ejecución

1. Abre el emulador desde Android Studio (Device Manager ▶) y espera a que cargue el home de Android.
2. Verifica que esté en línea: `adb devices` debe mostrar `emulator-5554   device`.
3. Inicia la app:

```bash
npx expo start --android     # emulador / dispositivo Android
npx expo start --ios         # simulador iOS (macOS)
```

Alternativa: `npx expo start` y presionar `a` (Android) o `i` (iOS). También puedes escanear el QR con Expo Go.

## Cómo probar el flujo CRUD

| Acción | Cómo probarla |
|---|---|
| **Listar** | Pantalla de bienvenida → **Ingresar**. Verás 4 solicitudes de ejemplo. |
| **Buscar / Filtrar** | Escribe en el buscador (mascota, cliente o teléfono) y usa los chips Todos / Pendiente / En atención / Finalizado. |
| **Crear** | Botón **＋ Nueva solicitud** → deja campos vacíos para ver las validaciones bajo cada input → completa y **Registrar solicitud**. Aparece un toast y la solicitud nueva queda primera en la lista como *Pendiente*. |
| **Ver detalle** | Toca cualquier tarjeta. |
| **Actualizar** | En el detalle cambia **estado**, **prioridad** o **descripción** → **Guardar cambios**. Vuelve a la lista y verás el chip actualizado. |
| **Eliminar** | Botón **Eliminar** en la tarjeta o en el detalle → confirma en el diálogo. |
| **Refrescar** | Desliza la lista hacia abajo (simula recarga). |

## Arquitectura

```
src/
├── app/          Rutas de Expo Router (delgadas: solo enlazan URL → pantalla)
├── screens/      Pantallas (presentación): Bienvenida, Listado, Crear, Detalle/Editar
├── components/   Componentes reutilizables: SolicitudCard, Chip, FormField, OptionSelector,
│                 SearchBar, FilterChips, PrimaryButton, ServicioIcon, EmptyState
├── store/        Estado global: solicitudReducer (lógica del CRUD), SolicitudContext, ToastContext
├── services/     solicitudService: simula la capa de datos/API (carga inicial, refresco, creación)
├── models/       Tipos: Solicitud, EstadoSolicitud, Prioridad, TipoServicio
└── utils/        theme (diseño), constants, validators, format, alerts
```

**Flujo de datos:** Pantalla → acción del Context (`agregarSolicitud`, …) → `dispatch` → `solicitudReducer` → nuevo estado → re-render.
Las pantallas no contienen lógica de negocio: validaciones en `utils/validators`, reglas del CRUD en el reducer, datos en `services`.

**Hooks usados:** `useState` (formularios, filtros), `useEffect` (carga inicial simulada), `useReducer` + `Context` (CRUD en memoria),
`useMemo`/`useCallback` (filtros y acciones).

## Modelo de datos

`Solicitud { id, clienteNombre, telefono, mascotaNombre, tipoServicio, prioridad, descripcion, estado, fechaRegistro }`
— Estados: `PENDIENTE`, `EN_ATENCION`, `FINALIZADO`.

## Solución de problemas: `adb.exe: device offline`

```bash
adb kill-server
adb start-server
adb devices        # debe decir "device", no "offline"
```
Si sigue offline: en Device Manager → ⋮ → **Cold Boot Now** (o **Wipe Data**), cierra otros emuladores y actualiza
*Android Emulator* y *Platform-Tools* en SDK Manager.

## Integrantes

- _Nombre 1_
- _Nombre 2_
- _Nombre 3_
>>>>>>> master
