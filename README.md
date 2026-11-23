# 🐾 Centro Médico Mr. Patitas

Aplicación móvil con React Native, Expo Router y TypeScript para gestionar solicitudes de atención, agenda de citas, mascotas, vacunas e historial clínico.

Este repositorio conserva el contexto veterinario del proyecto del parcial e incorpora persistencia local con SQLite, una integración opcional con Firebase y un ejemplo de consumo REST.

## Requisitos

- Node.js compatible con la versión de Expo declarada en `package.json` y npm.
- Android Studio con un emulador Android o un dispositivo físico con depuración USB para probar las funciones nativas.
- Para Firebase: un proyecto propio en Firebase Console y sus reglas de seguridad publicadas.

## Instalación y ejecución

1. Descomprime el proyecto y abre su carpeta en Visual Studio Code.
2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Ejecuta la aplicación:

   ```bash
   npx expo start
   ```

4. Pulsa `a` para abrir Android o escanea el QR con una versión de Expo Go compatible. Para limpiar la caché: `npx expo start -c`.

## SQLite: persistencia local

La aplicación utiliza `expo-sqlite`. La base `mrpatitas.db` y sus tablas se crean automáticamente en el almacenamiento local de la aplicación. No hay que instalar un servidor SQL ni crear el archivo manualmente.

Código principal:

- `src/infraestructure/database/database.ts`: inicializa SQLite, crea las tablas `mascotas`, `citas`, `solicitudes` y `sync_outbox`, y proporciona operaciones de persistencia.
- `src/infraestructure/services/`: consulta SQLite y guarda los cambios de los Context.
- `src/presentation/store/`: mantiene el estado visible de la interfaz y llama a los repositorios para persistir cambios.

Al primer inicio, se copian los datos de demostración si las tablas están vacías. Los cambios posteriores se guardan localmente y deben seguir disponibles al reiniciar la aplicación. La cola `sync_outbox` registra cambios pendientes de enviar a Firebase.

## Firebase: configuración externa necesaria

Firebase no funcionará hasta configurar un proyecto propio.

1. Entra a https://console.firebase.google.com/ y crea un proyecto.
2. Registra una aplicación web dentro del proyecto Firebase y copia su configuración.
3. Activa **Authentication → Sign-in method → Email/Password**.
4. Crea la base de **Cloud Firestore** y activa **Storage** si se cargarán archivos.
5. Copia `.env.example` como `.env` y completa los valores `EXPO_PUBLIC_FIREBASE_*` con la configuración de tu proyecto.
6. Publica las reglas de `firestore.rules` y `storage.rules` en Firebase Console (los archivos están referenciados en `firebase.json`).
7. Reinicia Expo para que lea las variables:

   ```bash
   npx expo start -c
   ```

Cuando las variables de Firebase no están configuradas, la app mantiene el modo de demostración con las cuentas locales indicadas más abajo. Cuando Firebase sí está configurado, el login utiliza correo electrónico y contraseña de Firebase Authentication. El registro crea cuentas con rol `cliente`. Para probar el rol `admin`, registra primero la cuenta y cambia su campo `rol` a `admin` en el documento correspondiente de la colección `usuarios` desde Firebase Console.

**Importante:** las variables `EXPO_PUBLIC_*` se incorporan al cliente móvil y no deben contener claves privadas de servidor. La seguridad de los datos depende de las reglas de Firestore/Storage, no de ocultar la configuración del cliente.

### Archivos de integración Firebase

- `src/infraestructure/firebase/config.ts`: inicializa Firebase cuando existe configuración.
- `src/infraestructure/firebase/authFirebaseService.ts`: registro, login, cierre y recuperación de sesión.
- `src/infraestructure/firebase/firestoreService.ts`: guarda o elimina documentos remotos.
- `src/infraestructure/firebase/storageService.ts`: carga un archivo y devuelve su URL. Desde Perfil se puede elegir una imagen y subirla a la carpeta privada del usuario en Storage.
- `src/infraestructure/sync/syncService.ts`: procesa la cola local sin duplicar documentos, usando el ID local como ID remoto.
- `src/infraestructure/sync/networkService.ts`: comprueba la conectividad y reintenta cuando vuelve internet.

Las colecciones de Firestore utilizadas para sincronización son `mascotas`, `citas` y `solicitudes`. La sincronización de registros nuevos o modificados requiere una sesión Firebase activa. Si no hay configuración o conexión, las operaciones permanecen en la cola local.

## API REST de demostración

La pantalla **Servicios y precios → Probar consumo de API REST** consulta el endpoint público `https://dummyjson.com/products?limit=30`. Muestra carga, errores y reintento. Es un catálogo genérico de demostración, no un catálogo veterinario real. Se puede reemplazar la URL base con `EXPO_PUBLIC_API_BASE_URL`.

Código principal:

- `src/infraestructure/api/apiClient.ts`: petición HTTP y errores de respuesta.
- `src/infraestructure/services/catalogoService.ts`: obtiene y tipa la lista de productos.
- `src/presentation/screens/CatalogoApiScreen.tsx`: interfaz de carga, error y resultados.

## Cuentas de demostración

Solo se utilizan cuando no se ha configurado Firebase:

| Rol           | Usuario   | Contraseña   |
| ------------- | --------- | ------------ |
| Administrador | `admin`   | `patitas123` |
| Cliente       | `usuario` | `usuario123` |

En modo Firebase, el inicio de sesión utiliza el correo electrónico de la cuenta.

## Estructura principal

```text
src/
├── app/                       # Rutas y navegación Expo Router
├── domain/                    # Entidades, reglas, casos de uso y contratos
├── infraestructure/
│   ├── api/                   # Cliente REST
│   ├── database/              # SQLite y cola local de sincronización
│   ├── firebase/              # Authentication, Firestore y Storage
│   ├── sync/                  # Conectividad y sincronización
│   ├── data/                  # Datos iniciales de demostración
│   ├── repositories/          # Implementaciones de repositorios
│   └── services/              # Servicios de datos y catálogo REST
└── presentation/
    ├── components/            # Componentes reutilizables
    ├── screens/               # Pantallas
    ├── store/                 # Context y reducers
    ├── hooks/                 # Hooks personalizados
    ├── theme/                 # Sistema de diseño
    └── utils/                 # Alertas y formato
```

## Generar una compilación Android

El proyecto incluye `eas.json` con un perfil `preview` para APK de prueba y `production` para AAB. Para compilar, el equipo debe iniciar sesión en Expo y vincular el proyecto a su cuenta:

```bash
npx eas-cli@latest login
npx eas-cli@latest build:configure
npx eas-cli@latest build --platform android --profile preview
```

Para generar el AAB de producción, usa `npx eas-cli@latest build --platform android --profile production`. EAS solicita configurar las credenciales de firma cuando corresponda.

La configuración y compilación final deben probarse en el equipo que tenga acceso al proyecto Expo/Firebase. El archivo instalable generado por EAS se descarga desde el enlace que proporciona el servicio.

## Nota de sincronización y pruebas

- SQLite conserva datos en el dispositivo; borrar los datos de la app o desinstalarla elimina su base local.
- Firebase es opcional hasta completar `.env` y publicar las reglas.
- La cola local evita repetir documentos remotos al reutilizar el mismo ID, pero cualquier conflicto de edición simultánea entre dispositivos debe probarse y definirse según las reglas del negocio.
- Antes de la entrega se debe probar en Android: crear/editar/eliminar, reiniciar para comprobar persistencia, probar modo avión, recuperar conexión y revisar Firebase Console.
