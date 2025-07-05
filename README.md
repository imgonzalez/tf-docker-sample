# Despliegue de Contenedor Docker con Terraform

Este proyecto demuestra cómo desplegar un contenedor Docker utilizando Terraform. El ejemplo despliega un servidor web NGINX que expone el puerto 80 del contenedor en el puerto 8080 del host.

## Requisitos Previos

Para ejecutar este proyecto necesitarás:

1. **Terraform** (versión 1.0.0 o superior)
   - [Descargar Terraform](https://www.terraform.io/downloads.html)
   - Verificar la instalación: `terraform version`

2. **Docker**
   - [Instalar Docker](https://docs.docker.com/get-docker/)
   - Verificar la instalación: `docker --version`
   - Asegurarse de que el servicio Docker esté en ejecución: `docker info`
   - El usuario debe tener permisos para acceder al socket de Docker (pertenecer al grupo `docker`)

3. **Proveedor Docker para Terraform**
   - En entornos con problemas de certificados, puede ser necesario descargar manualmente el proveedor

## Estructura del Proyecto

```
tf-docker-test/
├── main.tf                # Configuración principal de Terraform
├── terraform-plugins/     # Directorio para proveedores descargados manualmente (opcional)
├── check_requirements.sh  # Script para verificar requisitos del sistema
└── README.md              # Este archivo
```

## Verificación de Requisitos

El proyecto incluye un script `check_requirements.sh` que verifica automáticamente si tu sistema cumple con todos los requisitos necesarios para ejecutar esta prueba.

### Uso del Script de Verificación

```bash
# Hacer el script ejecutable (si no lo está)
chmod +x check_requirements.sh

# Ejecutar el script
./check_requirements.sh
```

### Características del Script

El script `check_requirements.sh` realiza las siguientes comprobaciones:

- **Terraform**: Verifica la instalación y versión mínima (1.0.0)
- **Docker**: Verifica la instalación y versión mínima (20.10.0)
- **Estado de Docker**: Comprueba si el servicio Docker está en ejecución
- **Permisos de Docker**: Verifica si el usuario tiene acceso al socket de Docker
- **Conectividad a Internet**: Comprueba la conexión a los servidores necesarios
- **Certificados SSL/TLS**: Verifica la configuración de certificados
- **Proveedor Docker para Terraform**: Comprueba si está disponible localmente

Para cada requisito, el script proporciona:
- Indicación visual del estado (✓ para éxito, ✗ para error)
- Mensajes detallados sobre cualquier problema encontrado
- Sugerencias específicas para resolver los problemas detectados

Al final, muestra un resumen con el número de requisitos cumplidos y faltantes.

## Configuración

El archivo `main.tf` contiene la configuración necesaria para:
1. Definir el proveedor Docker
2. Descargar la imagen de NGINX
3. Crear un contenedor que expone el puerto 80 en el puerto 8080 del host

## Pasos para la Ejecución

### 1. Instalación de Terraform (si no está instalado)

```bash
# Descargar Terraform
wget https://releases.hashicorp.com/terraform/1.7.5/terraform_1.7.5_linux_amd64.zip

# Descomprimir
unzip terraform_1.7.5_linux_amd64.zip

# Mover el binario a un directorio en el PATH
sudo mv terraform /usr/local/bin/

# Verificar la instalación
terraform version
```

### 2. Instalación manual del proveedor Docker (si hay problemas de certificados)

```bash
# Crear directorio para el proveedor
mkdir -p ~/.terraform.d/plugins/registry.terraform.io/kreuzwerker/docker/3.0.2/linux_amd64/

# Descargar el proveedor
curl --insecure -L -o terraform-provider-docker.zip https://github.com/kreuzwerker/terraform-provider-docker/releases/download/v3.0.2/terraform-provider-docker_3.0.2_linux_amd64.zip

# Descomprimir
unzip terraform-provider-docker.zip -d docker-provider-temp

# Mover el binario al directorio de plugins
mv docker-provider-temp/terraform-provider-docker_v3.0.2 ~/.terraform.d/plugins/registry.terraform.io/kreuzwerker/docker/3.0.2/linux_amd64/terraform-provider-docker_v3.0.2

# Hacer el binario ejecutable
chmod +x ~/.terraform.d/plugins/registry.terraform.io/kreuzwerker/docker/3.0.2/linux_amd64/terraform-provider-docker_v3.0.2

# Limpiar archivos temporales
rm -rf docker-provider-temp terraform-provider-docker.zip
```

### 3. Inicializar Terraform

```bash
# Inicializar con el proveedor descargado manualmente
terraform init -plugin-dir=~/.terraform.d/plugins

# O simplemente inicializar si no hay problemas de certificados
terraform init
```

### 4. Desplegar la infraestructura

```bash
# Ver el plan de ejecución
terraform plan

# Aplicar la configuración
terraform apply -auto-approve
```

### 5. Verificar el despliegue

```bash
# Verificar que el contenedor esté en ejecución
docker ps

# Probar el acceso al servidor web
curl http://localhost:8080
```

### 6. Limpiar recursos

```bash
# Destruir la infraestructura cuando ya no sea necesaria
terraform destroy -auto-approve
```

## Solución de Problemas

### Problemas de certificados

Si encuentras errores relacionados con certificados al descargar proveedores, puedes:

1. Usar la opción `-plugin-dir` para especificar un directorio local con los proveedores descargados manualmente
2. Configurar la variable de entorno `TF_SKIP_PROVIDER_VERIFY=1`
3. Actualizar los certificados CA del sistema: `sudo apt-get update && sudo apt-get install -y ca-certificates`

### Problemas de conexión con Docker

Si Terraform no puede conectarse al daemon de Docker:

1. Verificar que Docker esté en ejecución: `docker info`
2. Verificar que el usuario tenga permisos para acceder al socket: `ls -la /var/run/docker.sock`
3. Añadir el usuario al grupo docker: `sudo usermod -aG docker $USER` (requiere reiniciar la sesión)
4. Configurar la variable de entorno `DOCKER_HOST` si Docker está escuchando en una dirección no estándar

## Gestión de Finales de Línea en Git

Este proyecto incluye un archivo `.gitattributes` para gestionar correctamente los finales de línea en diferentes sistemas operativos. Esto resuelve el warning común:

```
warning: in the working copy of '.terraform.lock.hcl', LF will be replaced by CRLF the next time Git touches it
```

### Problema

Este warning ocurre cuando:
- Se trabaja en entornos mixtos (Windows/Linux), especialmente en WSL
- Git detecta diferentes tipos de finales de línea (LF vs CRLF)
- La configuración `core.autocrlf` está activada

### Solución implementada

Se ha creado un archivo `.gitattributes` en la raíz del proyecto con la siguiente configuración:

```
* text=auto
*.tf text eol=lf
*.hcl text eol=lf
*.sh text eol=lf
*.md text eol=lf
```

Esta configuración:
- Normaliza automáticamente los finales de línea según el tipo de archivo
- Fuerza el uso de finales de línea estilo Unix (LF) para archivos de Terraform, HCL, scripts y documentación
- Asegura consistencia entre diferentes sistemas operativos y desarrolladores

### Aplicar la normalización

Si ya tienes archivos con finales de línea incorrectos, puedes normalizarlos ejecutando:

```bash
git add --renormalize .
```

## Recursos Adicionales

- [Documentación de Terraform](https://www.terraform.io/docs/index.html)
- [Documentación del proveedor Docker para Terraform](https://registry.terraform.io/providers/kreuzwerker/docker/latest/docs)
- [Documentación de Docker](https://docs.docker.com/)
- [Configuración de finales de línea en Git](https://git-scm.com/book/en/v2/Customizing-Git-Git-Configuration#_core_autocrlf)
