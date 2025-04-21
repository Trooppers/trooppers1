# Configuración de Vercel para despliegue

Este archivo contiene la configuración necesaria para desplegar la aplicación en Vercel y conectarla con el dominio personalizado TROOPPERS.com.

## Requisitos previos

1. Cuenta en Vercel
2. Dominio TROOPPERS.com registrado en GoDaddy
3. Acceso a la configuración DNS de GoDaddy

## Pasos para el despliegue

1. Instalar Vercel CLI (ya realizado)
2. Inicializar el proyecto en Vercel
3. Configurar las variables de entorno
4. Desplegar la aplicación
5. Configurar el dominio personalizado

## Variables de entorno

```
NEXT_PUBLIC_SITE_URL=https://trooppers.com
```

## Comandos para el despliegue

```bash
# Iniciar sesión en Vercel
vercel login

# Desplegar la aplicación
vercel --prod

# Añadir dominio personalizado
vercel domains add trooppers.com
```

## Configuración de base de datos

Para el despliegue completo con base de datos funcional, se utilizará la base de datos D1 de Cloudflare que viene integrada con Next.js en Vercel. La migración inicial se encuentra en el directorio `migrations/`.

## Notas adicionales

- La aplicación está configurada para utilizar el dominio TROOPPERS.com como URL principal
- Se ha añadido soporte para proveedores y contratación de obras como solicitado
- La aplicación es completamente responsive y funciona en dispositivos móviles y de escritorio
