# Instrucciones para configurar el dominio personalizado en Vercel

Para conectar tu dominio TROOPPERS.com alojado en GoDaddy con tu aplicación desplegada en Vercel, sigue estos pasos:

## 1. Configuración en Vercel

Una vez que la aplicación esté desplegada en Vercel, deberás:

1. Iniciar sesión en tu cuenta de Vercel
2. Seleccionar el proyecto "trooppers-reforma-presupuestos"
3. Ir a la pestaña "Settings" > "Domains"
4. Añadir tu dominio: trooppers.com
5. Vercel te proporcionará los registros DNS que necesitas configurar en GoDaddy

## 2. Configuración en GoDaddy

Inicia sesión en tu cuenta de GoDaddy y:

1. Ve a "Mis productos" > "Dominios" > "trooppers.com" > "Administrar DNS"
2. Añade los siguientes registros DNS (los valores exactos los proporcionará Vercel):

   - Registro A: Apunta @ a la IP proporcionada por Vercel
   - Registro CNAME: Apunta www a cname.vercel-dns.com

## 3. Verificación

1. Una vez configurados los registros DNS, vuelve a Vercel
2. Vercel verificará automáticamente la configuración
3. La propagación DNS puede tardar hasta 48 horas, pero generalmente es mucho más rápida

## 4. Certificado SSL

Vercel configurará automáticamente un certificado SSL para tu dominio, permitiendo conexiones seguras a través de HTTPS.

## Nota importante

Si encuentras algún problema durante la configuración, puedes contactar con el soporte de Vercel o GoDaddy para obtener asistencia adicional.
