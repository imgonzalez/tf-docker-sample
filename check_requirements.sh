#!/bin/bash

# Script para verificar los requisitos necesarios para desplegar un contenedor Docker con Terraform
# Autor: Amazon Q
# Fecha: 2025-07-04

# Colores para la salida
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Contador de requisitos
REQUIREMENTS_MET=0
REQUIREMENTS_MISSING=0

echo -e "${BOLD}Verificando requisitos para desplegar un contenedor Docker con Terraform...${NC}\n"

# Función para verificar si un comando está disponible
check_command() {
    local cmd=$1
    local name=$2
    local min_version=$3
    local version_cmd=$4
    local version_regex=$5

    echo -e "Verificando $name..."
    
    if command -v $cmd &> /dev/null; then
        if [ -n "$min_version" ]; then
            # Obtener la versión
            local version=$($version_cmd)
            local current_version=$(echo $version | grep -oE "$version_regex")
            
            echo -e "  - Versión instalada: $current_version"
            echo -e "  - Versión mínima requerida: $min_version"
            
            # Comparar versiones (simplificado, asume formato x.y.z)
            if [[ "$current_version" < "$min_version" ]]; then
                echo -e "  - ${RED}✗ La versión de $name es menor que la requerida${NC}"
                echo -e "  - ${YELLOW}Sugerencia: Actualiza $name a la versión $min_version o superior${NC}"
                ((REQUIREMENTS_MISSING++))
                return 1
            fi
        fi
        
        echo -e "  - ${GREEN}✓ $name está instalado correctamente${NC}"
        ((REQUIREMENTS_MET++))
        return 0
    else
        echo -e "  - ${RED}✗ $name no está instalado${NC}"
        echo -e "  - ${YELLOW}Sugerencia: Instala $name siguiendo las instrucciones en el README.md${NC}"
        ((REQUIREMENTS_MISSING++))
        return 1
    fi
}

# Función para verificar permisos de Docker
check_docker_permissions() {
    echo -e "Verificando permisos de Docker..."
    
    if [ -S /var/run/docker.sock ]; then
        if [ -r /var/run/docker.sock ] && [ -w /var/run/docker.sock ]; then
            echo -e "  - ${GREEN}✓ El usuario tiene permisos para acceder al socket de Docker${NC}"
            ((REQUIREMENTS_MET++))
            return 0
        else
            echo -e "  - ${RED}✗ El usuario no tiene permisos para acceder al socket de Docker${NC}"
            echo -e "  - ${YELLOW}Sugerencia: Añade tu usuario al grupo 'docker' con: sudo usermod -aG docker \$USER${NC}"
            echo -e "  - ${YELLOW}Luego cierra la sesión y vuelve a iniciarla, o ejecuta: newgrp docker${NC}"
            ((REQUIREMENTS_MISSING++))
            return 1
        fi
    else
        echo -e "  - ${RED}✗ El socket de Docker no existe en /var/run/docker.sock${NC}"
        echo -e "  - ${YELLOW}Sugerencia: Asegúrate de que Docker esté instalado y en ejecución${NC}"
        ((REQUIREMENTS_MISSING++))
        return 1
    fi
}

# Función para verificar si Docker está en ejecución
check_docker_running() {
    echo -e "Verificando si Docker está en ejecución..."
    
    if docker info &> /dev/null; then
        echo -e "  - ${GREEN}✓ Docker está en ejecución${NC}"
        ((REQUIREMENTS_MET++))
        return 0
    else
        echo -e "  - ${RED}✗ Docker no está en ejecución${NC}"
        echo -e "  - ${YELLOW}Sugerencia: Inicia el servicio Docker con: sudo systemctl start docker${NC}"
        ((REQUIREMENTS_MISSING++))
        return 1
    fi
}

# Función para verificar el proveedor de Docker para Terraform
check_terraform_docker_provider() {
    echo -e "Verificando proveedor Docker para Terraform..."
    
    local provider_path="$HOME/.terraform.d/plugins/registry.terraform.io/kreuzwerker/docker/3.0.2/linux_amd64/terraform-provider-docker_v3.0.2"
    local project_provider_path="./terraform-plugins/registry.terraform.io/kreuzwerker/docker/3.0.2/linux_amd64/terraform-provider-docker_v3.0.2"
    
    if [ -f "$provider_path" ] && [ -x "$provider_path" ]; then
        echo -e "  - ${GREEN}✓ Proveedor Docker para Terraform encontrado en $provider_path${NC}"
        ((REQUIREMENTS_MET++))
        return 0
    elif [ -f "$project_provider_path" ] && [ -x "$project_provider_path" ]; then
        echo -e "  - ${GREEN}✓ Proveedor Docker para Terraform encontrado en $project_provider_path${NC}"
        ((REQUIREMENTS_MET++))
        return 0
    else
        echo -e "  - ${YELLOW}⚠ Proveedor Docker para Terraform no encontrado localmente${NC}"
        echo -e "  - ${YELLOW}Sugerencia: Si tienes problemas de certificados, descarga manualmente el proveedor siguiendo las instrucciones en el README.md${NC}"
        echo -e "  - ${YELLOW}Si no hay problemas de certificados, Terraform lo descargará automáticamente durante la inicialización${NC}"
        # No incrementamos REQUIREMENTS_MISSING porque no es un requisito estricto tenerlo descargado manualmente
        return 0
    fi
}

# Función para verificar la conectividad a Internet
check_internet_connectivity() {
    echo -e "Verificando conectividad a Internet..."
    
    if ping -c 1 registry.terraform.io &> /dev/null || ping -c 1 github.com &> /dev/null; then
        echo -e "  - ${GREEN}✓ Hay conectividad a Internet${NC}"
        ((REQUIREMENTS_MET++))
        return 0
    else
        echo -e "  - ${YELLOW}⚠ No se pudo verificar la conectividad a Internet${NC}"
        echo -e "  - ${YELLOW}Sugerencia: Verifica tu conexión a Internet o configuración de proxy${NC}"
        echo -e "  - ${YELLOW}Si estás detrás de un proxy corporativo, configura las variables de entorno HTTP_PROXY y HTTPS_PROXY${NC}"
        ((REQUIREMENTS_MISSING++))
        return 1
    fi
}

# Función para verificar la configuración de certificados
check_certificates() {
    echo -e "Verificando configuración de certificados..."
    
    if curl -s https://registry.terraform.io > /dev/null; then
        echo -e "  - ${GREEN}✓ Los certificados SSL/TLS están configurados correctamente${NC}"
        ((REQUIREMENTS_MET++))
        return 0
    else
        echo -e "  - ${YELLOW}⚠ Posibles problemas con los certificados SSL/TLS${NC}"
        echo -e "  - ${YELLOW}Sugerencia: Actualiza los certificados CA con: sudo apt-get update && sudo apt-get install -y ca-certificates${NC}"
        echo -e "  - ${YELLOW}O usa la variable de entorno TF_SKIP_PROVIDER_VERIFY=1 para omitir la verificación de certificados${NC}"
        ((REQUIREMENTS_MISSING++))
        return 1
    fi
}

# Verificar Terraform
check_command "terraform" "Terraform" "1.0.0" "terraform version" "([0-9]+\.[0-9]+\.[0-9]+)"

# Verificar Docker
check_command "docker" "Docker" "20.10.0" "docker --version" "([0-9]+\.[0-9]+\.[0-9]+)"

# Verificar si Docker está en ejecución
if command -v docker &> /dev/null; then
    check_docker_running
fi

# Verificar permisos de Docker
if command -v docker &> /dev/null; then
    check_docker_permissions
fi

# Verificar conectividad a Internet
check_internet_connectivity

# Verificar certificados
check_certificates

# Verificar proveedor Docker para Terraform
if command -v terraform &> /dev/null; then
    check_terraform_docker_provider
fi

# Resumen
echo -e "\n${BOLD}Resumen de la verificación:${NC}"
echo -e "${GREEN}✓ $REQUIREMENTS_MET requisitos cumplidos${NC}"
echo -e "${RED}✗ $REQUIREMENTS_MISSING requisitos faltantes${NC}"

if [ $REQUIREMENTS_MISSING -eq 0 ]; then
    echo -e "\n${GREEN}${BOLD}¡Todos los requisitos están cumplidos! Puedes proceder con la prueba.${NC}"
    exit 0
else
    echo -e "\n${YELLOW}${BOLD}Hay requisitos faltantes. Por favor, resuelve los problemas indicados antes de proceder.${NC}"
    exit 1
fi
