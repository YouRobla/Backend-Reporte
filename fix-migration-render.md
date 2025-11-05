# 🔧 Solución para el Error de Migración en Render

## 📋 **Pasos para Resolver el Error P3018**

### **Opción 1: Marcar migración como resuelta y aplicar corrección (Recomendada)**

#### **Paso 1: Conectarte a la base de datos de Render**

En Render Dashboard, ve a tu base de datos PostgreSQL y copia la **Internal Database URL** o **External Connection String**.

#### **Paso 2: Marcar la migración como resuelta**

Desde tu terminal local (conectado a la BD de Render):

```bash
# Conectar usando la URL de Render
$env:DATABASE_URL="postgresql://usuario:password@host:5432/database?sslmode=require"

# Marcar la migración fallida como resuelta
npx prisma migrate resolve --applied 20251105141238_actualizar_estructura_formulario
```

#### **Paso 3: Aplicar la migración corregida manualmente**

La migración corregida ya está en el código. Ahora necesitas aplicarla manualmente en Render:

1. **Opción A: Desde Render Dashboard (SQL Editor)**
   - Ve a tu base de datos en Render
   - Abre el SQL Editor
   - Ejecuta el SQL de la migración corregida manualmente

2. **Opción B: Desde tu terminal local**
   ```bash
   # Aplicar la migración manualmente
   npx prisma migrate deploy
   ```

#### **Paso 4: Hacer commit y push**

```bash
git add .
git commit -m "fix: corrige migración para manejar datos existentes"
git push origin main
```

---

## 🗑️ **Opción 2: Resetear Base de Datos (Solo si es necesario)**

### **Si estás en pruebas y no importa perder datos:**

#### **Desde Render Dashboard:**

1. Ve a tu **Render Dashboard**
2. Selecciona tu servicio de **PostgreSQL**
3. Ve a **"Settings"** → **"Danger Zone"**
4. Busca **"Delete Database"** o **"Reset Database"**
5. ⚠️ Esto eliminará TODOS los datos

#### **Desde Prisma CLI (conectado a Render):**

```bash
# Resetear completamente
npx prisma migrate reset --force
```

Esto:
- ✅ Elimina TODOS los datos
- ✅ Elimina todas las tablas
- ✅ Ejecuta todas las migraciones desde cero

---

## 📝 **Resumen de la Migración Corregida**

La migración ahora:

1. ✅ Agrega `sede` como opcional primero
2. ✅ Rellena valores existentes con `'SIN_SEDE'`
3. ✅ Elimina columnas antiguas
4. ✅ Hace `sede` requerida al final

**Esto asegura que no se pierdan datos y la migración funcione correctamente.**

