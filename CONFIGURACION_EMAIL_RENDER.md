# 📧 Configuración de Email en Render

## 🚀 Pasos para activar emails en Render

### 1. **Configurar Variables de Entorno en Render**

Ve a tu dashboard de Render → Tu servicio → Environment → Add Environment Variable

Agrega estas variables:

```bash
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu-email@gmail.com
EMAIL_PASS=tu-contraseña-de-aplicación
```

### 2. **Configurar Gmail para Aplicaciones**

#### Opción A: Contraseña de Aplicación (Recomendado)
1. Ve a tu cuenta de Google → Seguridad
2. Activa "Verificación en 2 pasos"
3. Ve a "Contraseñas de aplicaciones"
4. Genera una nueva contraseña para "Mail"
5. Usa esa contraseña en `EMAIL_PASS`

#### Opción B: OAuth2 (Avanzado)
Si prefieres OAuth2, necesitarás configurar:
- `EMAIL_CLIENT_ID`
- `EMAIL_CLIENT_SECRET`
- `EMAIL_REFRESH_TOKEN`

### 3. **Probar la Configuración**

Una vez desplegado, puedes probar con estos endpoints:

#### Verificar estado del email:
```bash
GET https://backend-reporte.onrender.com/api/email/email-status
```

#### Enviar email de prueba:
```bash
POST https://backend-reporte.onrender.com/api/email/test-email
Content-Type: application/json

{
  "to": "destino@ejemplo.com",
  "subject": "Prueba de Email",
  "text": "Este es un email de prueba desde Render"
}
```

### 4. **Configuraciones Alternativas**

Si Gmail no funciona, puedes usar otros proveedores:

#### SendGrid:
```bash
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=tu-api-key-de-sendgrid
```

#### Mailgun:
```bash
EMAIL_HOST=smtp.mailgun.org
EMAIL_PORT=587
EMAIL_USER=tu-usuario-mailgun
EMAIL_PASS=tu-contraseña-mailgun
```

#### Outlook/Hotmail:
```bash
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=tu-email@outlook.com
EMAIL_PASS=tu-contraseña
```

### 5. **Diagnóstico de Problemas**

#### Verificar logs en Render:
1. Ve a tu servicio en Render
2. Click en "Logs"
3. Busca mensajes como:
   - `✅ Email configurado correctamente con: Gmail STARTTLS (587)`
   - `❌ Falló configuración Gmail STARTTLS (587): Connection timeout`

#### Problemas comunes:

**Connection timeout:**
- Render puede tener restricciones de red
- Gmail puede estar bloqueando conexiones desde Render
- Solución: Usar SendGrid o Mailgun

**Authentication failed:**
- Verificar que la contraseña de aplicación sea correcta
- Asegurarse de que 2FA esté activado en Gmail

**Port blocked:**
- Algunos proveedores bloquean puertos SMTP
- Probar puerto 465 (SSL) en lugar de 587 (STARTTLS)

### 6. **Configuración Avanzada**

Para mejor rendimiento, puedes agregar:

```bash
EMAIL_POOL=true
EMAIL_MAX_CONNECTIONS=5
EMAIL_RATE_LIMIT=10
```

### 7. **Monitoreo**

El sistema ahora incluye:
- ✅ Verificación automática de múltiples configuraciones
- ✅ Reintentos automáticos
- ✅ Logging detallado
- ✅ Fallback a configuraciones alternativas
- ✅ Endpoints de diagnóstico

### 8. **Testing Local**

Para probar localmente:

```bash
# En tu .env local
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu-email@gmail.com
EMAIL_PASS=tu-contraseña-de-aplicación

# Probar
npm start
curl -X GET http://localhost:3000/api/email/email-status
```

## 🎯 Resultado Esperado

Una vez configurado correctamente, deberías ver en los logs:

```
🔄 Probando configuración: Gmail STARTTLS (587)
✅ Email configurado correctamente con: Gmail STARTTLS (587)
📧 Correos enviados: 3/3
```

¡El sistema funcionará automáticamente sin intervención manual! 🚀
