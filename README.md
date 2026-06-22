# LinkedIn Agent · Guía de despliegue

## Qué necesitas (todo gratuito)
- Cuenta en **GitHub** → github.com
- Cuenta en **Vercel** → vercel.com (puedes entrar con tu cuenta de GitHub)
- **API key de Anthropic** → console.anthropic.com/settings/keys

---

## Paso 1 — Subir el proyecto a GitHub

1. Ve a **github.com** e inicia sesión
2. Haz clic en el botón verde **"New"** (arriba a la izquierda)
3. Ponle nombre: `linkedin-agent`
4. Deja todo lo demás por defecto y haz clic en **"Create repository"**
5. En la página que aparece, haz clic en **"uploading an existing file"**
6. Arrastra los 4 archivos del proyecto (`index.html`, `style.css`, `app.js`, `vercel.json`)
7. Haz clic en **"Commit changes"**

---

## Paso 2 — Desplegar en Vercel

1. Ve a **vercel.com** e inicia sesión con tu cuenta de GitHub
2. Haz clic en **"Add New Project"**
3. Selecciona el repositorio `linkedin-agent`
4. Haz clic en **"Deploy"** (no cambies nada más)
5. En 1-2 minutos tendrás tu URL propia, algo como: `linkedin-agent-tuusuario.vercel.app`

---

## Paso 3 — Usar la app

1. Abre tu URL
2. Introduce tu API key de Anthropic (empieza por `sk-ant-...`)
3. La key se guarda en tu navegador — no la verá nadie más

---

## Coste estimado

- GitHub: gratuito
- Vercel: gratuito
- Anthropic API: muy bajo. Cada consulta cuesta aprox. 0.01–0.03€. Con uso diario, menos de 2€/mes.

---

## Actualizar la app en el futuro

Si quieres cambiar algo, edita los archivos directamente en GitHub (botón de lápiz) y Vercel redesplegará automáticamente.
