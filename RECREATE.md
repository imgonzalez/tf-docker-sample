# Recreación de Contenedor Docker en Entorno WSL

Este documento detalla el proceso de recreación del contenedor Docker cuando se presentan errores de montaje en un entorno WSL (Windows Subsystem for Linux).

## Problema Encontrado

Al intentar reiniciar el contenedor Docker con el comando `docker restart terraform-docker-demo`, se presentó el siguiente error:

```
Error response from daemon: Cannot restart container terraform-docker-demo: error while creating mount source path '/run/desktop/mnt/host/wsl/docker-desktop-bind-mounts/Ubuntu-24.04/d41a18d6759ab91e2ee7b1da99773a67be333488fea0f4b8bb5d1cedf8212466': mkdir /run/desktop/mnt/host/wsl/docker-desktop-bind-mounts/Ubuntu-24.04/d41a18d6759ab91e2ee7b1da99773a67be333488fea0f4b8bb5d1cedf8212466: file exists
```

Este error está relacionado con los puntos de montaje en WSL y es un problema conocido que puede ocurrir en entornos donde Docker Desktop se ejecuta sobre WSL.

## Diagnóstico

Se realizaron los siguientes pasos de diagnóstico:

1. **Verificación del estado del contenedor**:
   ```bash
   docker ps -a | grep terraform-docker-demo
   ```
   Resultado: El contenedor estaba en estado "Exited (137)".

2. **Intento de inicio del contenedor**:
   ```bash
   docker start terraform-docker-demo
   ```
   Resultado: Se presentó el mismo error relacionado con los puntos de montaje.

## Solución Implementada

Para resolver el problema, se siguió una estrategia de eliminación y recreación completa del contenedor:

### 1. Eliminación del Contenedor Existente

```bash
docker rm terraform-docker-demo
```

Este comando elimina el contenedor existente, liberando los recursos y puntos de montaje asociados.

### 2. Reinicialización de Terraform

```bash
cd /mnt/c/Users/igonzalezsa/Documents/GitHub/tf-docker-test && terraform init
```

Este paso fue necesario porque se detectaron problemas con el proveedor local de Terraform. La reinicialización asegura que todos los proveedores necesarios estén correctamente instalados y configurados.

Resultado:
- Se reinstalaron los proveedores necesarios
- Se actualizó el archivo de bloqueo de dependencias (.terraform.lock.hcl)

### 3. Recreación del Contenedor

```bash
cd /mnt/c/Users/igonzalezsa/Documents/GitHub/tf-docker-test && terraform apply -auto-approve
```

Este comando recrea toda la infraestructura definida en los archivos de configuración de Terraform, incluyendo:
- El contenedor Docker
- Los volúmenes montados
- La configuración de puertos

### 4. Verificación del Funcionamiento

```bash
# Verificar que el contenedor está en ejecución
docker ps | grep terraform-docker-demo

# Verificar que el sitio web está respondiendo
curl -s -I http://localhost:8080
```

Resultado: El contenedor se creó correctamente con un nuevo ID (92faf8acbded) y el sitio web está respondiendo en http://localhost:8080.

## Causas Comunes del Problema

Este tipo de error con los puntos de montaje en WSL puede ocurrir por varias razones:

1. **Reinicios del sistema**: Después de reiniciar Windows o la distribución WSL
2. **Actualizaciones de Docker Desktop**: Cambios en la configuración de Docker Desktop
3. **Problemas de permisos**: Conflictos de permisos entre Windows y el sistema de archivos WSL
4. **Puntos de montaje huérfanos**: Puntos de montaje que no se limpiaron correctamente

## Prevención

Para minimizar la ocurrencia de este problema:

1. **Detener contenedores adecuadamente**: Usar `docker stop` antes de reiniciar el sistema
2. **Mantener actualizado Docker Desktop**: Instalar las últimas actualizaciones
3. **Evitar modificaciones manuales**: No modificar manualmente los directorios de montaje
4. **Usar volúmenes Docker**: Considerar el uso de volúmenes Docker en lugar de montajes de directorios

## Alternativas de Solución

Si la recreación completa del contenedor no es deseable, se pueden intentar otras soluciones:

1. **Reiniciar Docker Desktop**: Detener y reiniciar el servicio de Docker Desktop
2. **Reiniciar WSL**: Ejecutar `wsl --shutdown` desde PowerShell y luego reiniciar la distribución
3. **Limpiar puntos de montaje**: Usar comandos específicos para limpiar puntos de montaje huérfanos

## Conclusión

La recreación del contenedor mediante Terraform es una solución efectiva para problemas de montaje en entornos WSL. Aunque puede parecer drástica, garantiza un estado limpio y consistente del entorno, eliminando cualquier configuración problemática anterior.

Este enfoque es especialmente útil en entornos de desarrollo donde la infraestructura está definida como código, permitiendo una recreación rápida y confiable de los recursos.
