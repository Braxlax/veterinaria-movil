Centro Médico Mr. Patitas — App de gestión veterinaria

App móvil (React Native + Expo Router) para gestionar una clínica veterinaria: solicitudes de atención, agenda de citas, fichas de mascotas con carnet de vacunación e historial clínico, y acceso por roles. Evaluación parcial — Desarrollo de Aplicaciones Móviles 1 (IDAT).

Los datos viven en memoria (useReducer + Context). No usa base de datos: al cerrar la app se reinician.

Requisitos
Node.js 20.19.4 o superior (también sirven 22.13+ y 24.3+, requisito de React Native 0.86) y npm
JDK 17 (viene incluido con Android Studio) solo si vas a compilar con npx expo run:android
Android Studio con un emulador (AVD) creado o un celular Android con "Depuración USB" (en iOS: Xcode + simulador, solo macOS)
Variables de entorno ANDROID_HOME y platform-tools en el PATH (para que funcione adb)
Alternativa sin emulador: app Expo Go en el celular (misma red Wi-Fi que la PC), siempre que su versión sea compatible con el SDK 57 de Expo
Instalación
bash
npm install
Ejecución
Abre el emulador desde Android Studio (Device Manager ▶) y espera a que cargue el home de Android.
Verifica que esté en línea: adb devices debe mostrar emulator-5554 device.
Inicia la app:
bash
npx expo start --android # emulador / dispositivo Android
npx expo start --ios # simulador iOS (macOS)

Alternativa: npx expo start y presionar a (Android) o i (iOS), o escanear el QR con Expo Go. Si Metro muestra datos viejos: npx expo start -c.

El proyecto usa Expo y no tiene carpetas android/ ni ios/, por eso no se ejecuta con npx react-native run-android. El equivalente es npx expo start --android. Si necesitas compilar la app nativa: npx expo run:android (o run:ios en macOS).

Cuentas de prueba

El acceso se hace escribiendo usuario y contraseña en el Login (no hay botones de acceso rápido). Hay solo dos roles:

Rol Usuario Contraseña Qué ve / puede hacer
Administrador admin patitas123 Todo: solicitudes, citas, mascotas, vacunas e historial clínico; editar y eliminar
Cliente usuario usuario123 Solo sus mascotas, solicitudes y citas; puede registrar solicitudes, mascotas y citas, y cancelar sus citas; no puede editar estados ni eliminar solicitudes

Desde Crear una cuenta se registran clientes nuevos (rol Cliente). Los permisos están centralizados en src/utils/permisos.ts.

Pantallas
Pantalla Ruta Descripción
Login / Usuario y contraseña con mostrar/ocultar, mensaje de error general y enlace a registro. Muestra un texto con las cuentas de prueba
Registro /registro Validaciones bajo cada campo, contraseña repetida y alta de clientes con perfil guardado
Home / Bienvenida /home Primera pantalla tras iniciar sesión: saludo por rol, servicios de la clínica y accesos a Consultar solicitudes, Registrar nueva solicitud, Ir a mi panel y Cerrar sesión
Inicio (pestaña) /inicio Saludo por rol, solicitudes urgentes, resumen por estado, accesos rápidos, próximas citas, recordatorios de vacunas
Solicitudes (pestaña) /solicitudes Listado con buscador, filtros por estado, pull-to-refresh, tarjetas con chips
Nueva solicitud /crear Formulario validado; puede partir de una mascota registrada
Detalle / Editar solicitud /detalle Administrador: cambia estado, prioridad y descripción, llama o escribe por WhatsApp al cliente y elimina con confirmación. Cliente: solo lectura. Ambos pueden agendar una cita
Agenda (pestaña) /agenda Citas por día, completar / cancelar
Agendar cita /cita-nueva Mascota, servicio, veterinario, día y horario. No permite horarios pasados ni dobles reservas del mismo veterinario
Mascotas (pestaña) /mascotas Listado con búsqueda y estado de vacunación
Registrar / editar mascota /mascota-nueva Misma pantalla para crear y editar
Ficha de mascota /mascota-detalle Datos, carnet de vacunación (vigente / por vencer / vencida), historial clínico, acciones rápidas
Perfil (pestaña) /perfil Datos del usuario, permisos de su rol, cerrar sesión
Servicios y precios /servicios Catálogo con precio y duración; atajo para agendar
Contacto y ubicación /contacto Llamada de emergencia, WhatsApp, mapa, horario
Cómo probar el flujo CRUD
Acción Cómo probarla
Listar Inicia sesión con admin → pestaña Solicitudes (5 de ejemplo).
Buscar / Filtrar Escribe en el buscador (mascota, cliente o teléfono) y usa los chips Todos / Pendiente / En atención / Finalizado.
Crear Botón Nueva solicitud → deja campos vacíos para ver las validaciones bajo cada input → completa y Registrar solicitud. Aparece un toast y la nueva queda en la lista como Pendiente.
Ver detalle Toca cualquier tarjeta.
Actualizar Con admin, en el detalle cambia estado, prioridad o descripción → Guardar cambios.
Eliminar Con admin: botón Eliminar en la tarjeta o en el detalle → confirma en el diálogo.
Roles Cierra sesión (Perfil) y entra con usuario: solo verá lo suyo y no podrá editar estados ni eliminar solicitudes.
Mascotas y citas Pestaña Mascotas → ficha → Agendar cita. Con admin, en la ficha usa + Registrar para vacunas e historial.
Arquitectura
src/
├── app/ Rutas de Expo Router (delgadas: solo enlazan URL → pantalla). home.tsx es la Bienvenida; \_layout protege rutas según la sesión
│ └── (tabs)/ Barra de pestañas: Inicio, Solicitudes, Agenda, Mascotas, Perfil
├── screens/ Pantallas (presentación)
├── components/ Reutilizables: AppIcon, Chip, FormField, OptionSelector, PrimaryButton, SearchBar, FilterChips,
│ SolicitudCard, MascotaCard, CitaCard, Fab, SelectorDia, RegistroClinicoModal, EmptyState, ...
├── store/ Estado global (useReducer + Context): auth, solicitudes, mascotas, citas, toast
├── hooks/ usePermisos, useDatosVisibles (filtra datos según el rol)
├── services/ Capa de datos simulada: solicitud, mascota, cita, auth (+ regla de horarios ocupados)
├── data/ Datos de ejemplo en memoria
├── models/ Tipos: Solicitud, Mascota, Cita, Usuario
└── utils/ theme (diseño), constants, permisos, validators, fechas, format, ordenar, alerts

Flujo de datos: Pantalla → acción del Context → dispatch → reducer → nuevo estado → re-render. Las pantallas no contienen reglas de negocio: validaciones en utils/validators, permisos en utils/permisos, CRUD en los reducers y datos/reglas de agenda en services.

Hooks usados: useState (formularios, filtros), useEffect (carga inicial simulada), useReducer + Context (CRUD en memoria y sesión), useMemo / useCallback (filtros y acciones).

Diseño (UI/UX)
Sistema de diseño único en utils/theme.ts (colores, espaciado, radios, tipografía, sombras).
Iconografía coherente con Material Community Icons (@expo/vector-icons) mediante AppIcon.
Chips de estado/prioridad, tarjetas con barra de prioridad, estados vacíos y de carga, y mensajes de error bajo cada campo.
Feedback en cada acción: toast animado, confirmaciones al eliminar/cancelar y botón con indicador de carga en el registro.
Botones de acción con altura mínima de 52 dp y etiquetas de accesibilidad.
Modelo de datos

Solicitud { id, clienteNombre, telefono, mascotaNombre, tipoServicio, prioridad, descripcion, estado, fechaRegistro, mascotaId?, creadoPor? } — Estados: PENDIENTE, EN_ATENCION, FINALIZADO. Mascota { id, nombre, especie, raza, edadAnios, pesoKg, duenoNombre, duenoTelefono, duenoUsuario?, alergias, vacunas[], historial[] } Cita { id, mascotaId, mascotaNombre, duenoUsuario?, tipoServicio, fechaHora, veterinario, motivo, estado, creadoPor } Cuenta { usuario, contrasena, rol, nombre, apellidos, correo, telefono } — roles: admin, cliente.

Solución de problemas: adb.exe: device offline
bash
adb kill-server
adb start-server
adb devices # debe decir "device", no "offline"

Si sigue offline: en Device Manager → ⋮ → Cold Boot Now (o Wipe Data), cierra otros emuladores y vuelve a ejecutar.
