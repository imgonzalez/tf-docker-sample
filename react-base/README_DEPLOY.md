# Despliegue de Cambios en Aplicaciones React con Docker y Terraform

Este documento detalla el proceso para desplegar cambios en archivos JavaScript de una aplicación React utilizando Docker y Terraform. El enfoque permite una integración continua eficiente y un despliegue automatizado de modificaciones en la interfaz de usuario.

## Índice

1. [Flujo de Trabajo General](#flujo-de-trabajo-general)
2. [Identificación de Archivos Modificados](#identificación-de-archivos-modificados)
3. [Proceso de Reconstrucción](#proceso-de-reconstrucción)
4. [Despliegue con Terraform](#despliegue-con-terraform)
5. [Verificación del Despliegue](#verificación-del-despliegue)
6. [Solución de Problemas Comunes](#solución-de-problemas-comunes)
7. [Mejores Prácticas](#mejores-prácticas)

## Flujo de Trabajo General

El proceso de despliegue de cambios en archivos JavaScript sigue este flujo de trabajo:

1. **Desarrollo local** - Modificación de archivos JavaScript en el entorno de desarrollo
2. **Identificación de cambios** - Determinación de qué archivos se han modificado
3. **Reconstrucción** - Reconstrucción de la imagen Docker con los cambios
4. **Despliegue** - Aplicación de la configuración de Terraform para desplegar los cambios
5. **Verificación** - Comprobación de que los cambios se han aplicado correctamente

Este enfoque garantiza que los cambios se desplieguen de manera consistente y reproducible en cualquier entorno.

## Identificación de Archivos Modificados

Para identificar qué archivos JavaScript se han modificado, podemos utilizar el siguiente comando:

```bash
find src -name "*.js" -type f | xargs git diff --name-only
```

Este comando muestra todos los archivos JavaScript en el directorio `src` que han sido modificados desde el último commit.

Alternativamente, para listar todos los archivos JavaScript en el proyecto:

```bash
find src -name "*.js" | sort
```

Esto es útil para tener una visión general de la estructura de archivos JavaScript del proyecto.

## Proceso de Reconstrucción

### 1. Destrucción de Recursos Existentes

Antes de reconstruir la aplicación, es necesario destruir los recursos existentes:

```bash
cd react-base
terraform destroy -auto-approve
```

Este comando elimina:
- El contenedor Docker que ejecuta la aplicación
- La imagen Docker de la aplicación

### 2. Reconstrucción de la Imagen Docker

La reconstrucción de la imagen Docker se realiza automáticamente durante el proceso de aplicación de Terraform:

```bash
terraform apply -auto-approve
```

Durante este proceso:

1. Terraform ejecuta el comando `docker build` utilizando el Dockerfile del proyecto
2. El Dockerfile ejecuta los siguientes pasos:
   - Utiliza Node.js para instalar dependencias (`npm install`)
   - Copia los archivos fuente modificados
   - Compila la aplicación React (`npm run build`)
   - Copia los archivos compilados a una imagen de Nginx

## Despliegue con Terraform

### 1. Configuración de Terraform

El archivo `main.tf` contiene la configuración necesaria para desplegar la aplicación:

```hcl
terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "3.0.2"
    }
  }
}

provider "docker" {}

# Construir la imagen de Docker para la aplicación React
resource "docker_image" "react_app" {
  name = "react-app:latest"
  build {
    context = "."
    dockerfile = "Dockerfile"
  }
}

# Crear el contenedor a partir de la imagen
resource "docker_container" "react_app" {
  name  = "react-app-container"
  image = docker_image.react_app.image_id

  ports {
    internal = 80
    external = 3000
  }
}
```

### 2. Aplicación de la Configuración

Para aplicar la configuración y desplegar los cambios:

```bash
terraform apply -auto-approve
```

Este comando:
1. Construye una nueva imagen Docker con los cambios en los archivos JavaScript
2. Crea un nuevo contenedor a partir de esa imagen
3. Configura el mapeo de puertos (puerto 80 del contenedor al puerto 3000 del host)

## Verificación del Despliegue

### 1. Verificación del Estado del Contenedor

Para verificar que el contenedor está en ejecución:

```bash
docker ps | grep react-app
```

La salida debe mostrar el contenedor `react-app-container` en estado "Up".

### 2. Verificación de la Respuesta de la Aplicación

Para verificar que la aplicación está respondiendo:

```bash
curl -s -I http://localhost:3000
```

La respuesta debe incluir un código de estado HTTP 200 OK.

### 3. Verificación Visual

Accede a la aplicación en un navegador web:
- URL: http://localhost:3000
- Verifica que los cambios en los archivos JavaScript se reflejen en la interfaz de usuario

## Solución de Problemas Comunes

### 1. Errores de Construcción de la Imagen

Si la construcción de la imagen falla:

```bash
# Ver los logs de construcción
docker build -t react-app . --no-cache
```

### 2. Errores en el Contenedor

Si el contenedor no se inicia correctamente:

```bash
# Ver los logs del contenedor
docker logs react-app-container
```

### 3. Problemas de Caché

Si los cambios no se reflejan debido a problemas de caché:

```bash
# Reconstruir sin caché
terraform apply -auto-approve -var="docker_build_args={\"CACHEBUST\":\"$(date +%s)\"}"
```

## Mejores Prácticas

1. **Control de Versiones**:
   - Mantén todos los archivos de configuración en un sistema de control de versiones
   - Etiqueta las versiones estables de la aplicación

2. **Automatización**:
   - Automatiza el proceso de despliegue con scripts o pipelines de CI/CD
   - Implementa pruebas automatizadas antes del despliegue

3. **Monitorización**:
   - Configura monitorización para la aplicación desplegada
   - Implementa alertas para problemas críticos

4. **Seguridad**:
   - Escanea las imágenes Docker en busca de vulnerabilidades
   - Utiliza imágenes base oficiales y mantenlas actualizadas

5. **Documentación**:
   - Documenta los cambios realizados en cada despliegue
   - Mantén un registro de los despliegues realizados

## Conclusión

El despliegue de cambios en archivos JavaScript de una aplicación React utilizando Docker y Terraform proporciona un enfoque robusto y reproducible. Este proceso garantiza que los cambios se apliquen de manera consistente en diferentes entornos y facilita la integración continua y el despliegue continuo (CI/CD).

Al seguir este flujo de trabajo, los desarrolladores pueden centrarse en la implementación de nuevas características y mejoras, mientras que el proceso de despliegue se mantiene eficiente y confiable.
