# Guía de Integración — Supabase + Clínica Bienestar

## Paso 1: Crear el proyecto en Supabase

1. Ve a https://supabase.com y crea una cuenta (es gratis)
2. Clic en **"New project"**
3. Elige un nombre (ej: `clinica-bienestar`) y una contraseña para la BD
4. Espera ~2 minutos a que se cree el proyecto

---

## Paso 2: Crear las tablas en la base de datos

1. En el panel de Supabase, ve a **SQL Editor** (ícono de terminal)
2. Clic en **"New query"**
3. Copia y pega todo el contenido del archivo `sql/schema.sql`
4. Clic en **"Run"** (botón verde)
5. Verás las tablas `pacientes` y `solicitudes_hora` creadas bajo **Table Editor**

---

## Paso 3: Obtener tus credenciales

1. Ve a **Project Settings** → **API**
2. Copia estos dos valores:
   - **Project URL** → algo como `https://abcdefgh.supabase.co`
   - **anon public key** → un JWT largo

---

## Paso 4: Conectar tu proyecto

Abre el archivo `js/supabase.js` y reemplaza las dos líneas marcadas:

```js
// ANTES (líneas 10-11):
const SUPABASE_URL      = 'https://TU_PROJECT_ID.supabase.co';
const SUPABASE_ANON_KEY = 'TU_ANON_KEY';

// DESPUÉS (ejemplo):
const SUPABASE_URL      = 'https://abcdefgh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

---

## Paso 5: Archivos modificados en tu proyecto

Reemplaza estos archivos con los de esta carpeta:

| Archivo nuevo           | Reemplaza                   | Cambio principal                        |
|-------------------------|-----------------------------|-----------------------------------------|
| `js/supabase.js`        | (nuevo archivo)             | Cliente de BD, reemplaza localStorage  |
| `js/main.js`            | `js/main.js`                | Todas las funciones son ahora async    |
| `registro.html`         | `registro.html`             | Agrega `<script>` de Supabase SDK      |
| `pacientes.html`        | `pacientes.html`            | Agrega `<script>` de Supabase SDK      |
| `solicitar-hora.html`   | `solicitar-hora.html`       | Guarda solicitudes en BD               |
| `sql/schema.sql`        | (nuevo archivo)             | SQL para crear las tablas              |

Los archivos `auth.js`, `patient.js`, `ui.js`, `validation.js`,
`geolocalizacion.js`, `style.css`, `index.html` y `login.html`
**no se modificaron**, los mantienes igual.

---

## Paso 6: Probar la aplicación

1. Abre `index.html` en tu navegador (o con Live Server en VS Code)
2. Inicia sesión con `doctor` / `clinic123`
3. Registra un paciente de prueba
4. Ve al panel de Supabase → **Table Editor** → `pacientes`
5. Deberías ver el paciente guardado en la nube ✓

---

## Estructura de archivos resultante

```
proyecto/
├── index.html
├── login.html
├── registro.html          ← modificado
├── pacientes.html         ← modificado
├── solicitar-hora.html    ← modificado
├── sql/
│   └── schema.sql         ← nuevo
├── js/
│   ├── supabase.js        ← nuevo
│   ├── main.js            ← modificado
│   ├── auth.js
│   ├── patient.js
│   ├── ui.js
│   ├── validation.js
│   └── geolocalizacion.js
├── css/
│   └── style.css
└── images/
```

---

## ¿Qué pasa con los datos que ya tenía en localStorage?

Los datos anteriores quedan en el navegador pero la app ya no los leerá.
Si quieres migrarlos, abre la consola del navegador (F12) en cualquier
página y ejecuta:

```js
// Ver qué había en localStorage
console.log(localStorage.getItem('pacientes'));
// Puedes copiar ese JSON y pegarlo manualmente en Supabase
// Table Editor → pacientes → Insert row
```

---

## Próximos pasos (Semana C del TRL)

Una vez que Supabase esté funcionando, los siguientes pasos naturales son:

- **Historial clínico**: ya tienes todos los datos en BD, solo falta una
  vista por RUT del paciente
- **Portal del paciente**: nueva página pública que muestre el estado de
  una solicitud ingresando el RUT
- **Mapa de urgencias**: integrar Leaflet.js con las coordenadas que ya
  tienes en `geolocalizacion.js`
