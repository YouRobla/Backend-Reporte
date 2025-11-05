# 🔄 Guía para Resetear Base de Datos en Render

## ⚠️ **IMPORTANTE: Solo para desarrollo/pruebas**

Si estás en **producción con datos importantes**, NO uses esta opción. Usa la **Opción A** (migración segura).

---

## 🗑️ **Opción B: Resetear Base de Datos Completa**

### **Paso 1: Resetear desde Prisma CLI (Local)**

```bash
# Resetear completamente la base de datos
npx prisma migrate reset
```

Esto:
- ✅ Elimina TODOS los datos
- ✅ Elimina todas las tablas
- ✅ Ejecuta todas las migraciones desde cero
- ✅ Ejecuta los seeders si existen

### **Paso 2: Crear nueva migración limpia**

```bash
# Crear nueva migración con la estructura actualizada
npx prisma migrate dev --name actualizar_estructura_formulario_v2
```

### **Paso 3: Desplegar en Render**

Una vez que la migración esté lista, haz commit y push:

```bash
git add .
git commit -m "fix: actualiza estructura formulario con migración segura"
git push origin main
```

Render aplicará automáticamente la migración con `prisma migrate deploy`.

---

## 🔧 **Opción C: Resetear desde Render Dashboard**

1. Ve a tu **Render Dashboard**
2. Selecciona tu **Base de Datos PostgreSQL**
3. Ve a la pestaña **"Data"** o **"Settings"**
4. Busca la opción **"Reset Database"** o **"Delete Database"**
5. ⚠️ Esto eliminará TODOS los datos permanentemente

Luego crea una nueva base de datos o usa la misma URL.

---

## ✅ **Opción A: Marcar migración como resuelta (Recomendada)**

Si ya tienes datos que quieres conservar, marca la migración fallida como resuelta:

```bash
# Desde tu terminal local (conectado a la BD de Render)
npx prisma migrate resolve --applied 20251105141238_actualizar_estructura_formulario
```

Luego aplica la migración corregida manualmente o crea una nueva.

---

## 📋 **Comandos Útiles**

```bash
# Ver estado de migraciones
npx prisma migrate status

# Ver historial de migraciones
npx prisma migrate list

# Marcar migración como aplicada (sin ejecutarla)
npx prisma migrate resolve --applied <nombre_migracion>

# Marcar migración como no aplicada
npx prisma migrate resolve --rolled-back <nombre_migracion>
```

