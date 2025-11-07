# Comandos para configurar el nuevo repositorio

## Pasos para inicializar y subir el proyecto al nuevo repositorio

**Nota:** Reemplaza `<URL_DEL_NUEVO_REPOSITORIO>` con la URL de tu nuevo repositorio de GitHub.

### 1. Inicializar Git
```bash
git init
```

### 2. Agregar todos los archivos del proyecto
```bash
git add .
```

### 3. Realizar el commit inicial
```bash
git commit -m "Levantamiento de XpressUTC"
```

### 4. Establecer la rama principal como 'master' (o 'main' si prefieres)
```bash
git branch -M master
```

### 5. Agregar el nuevo repositorio remoto
```bash
git remote add origin <URL_DEL_NUEVO_REPOSITORIO>
```

### 6. Subir los archivos al nuevo repositorio
```bash
git push -u origin master
```

---

## Comandos completos en una sola línea (para copiar y pegar)

Una vez que tengas la URL del nuevo repositorio, ejecuta:

```bash
git init && git add . && git commit -m "Levantamiento de XpressUTC" && git branch -M master && git remote add origin <URL_DEL_NUEVO_REPOSITORIO> && git push -u origin master
```

**Recuerda:** Reemplaza `<URL_DEL_NUEVO_REPOSITORIO>` con la URL real de tu nuevo repositorio.

---

## Nota importante

- El archivo `PLAN_BACKEND.md` está en el `.gitignore` y no se subirá
- Los archivos `.env` tampoco se subirán (están en `.gitignore`)
- Todos los demás archivos del proyecto (`api/`, `api-client/`, etc.) se incluirán en el commit

