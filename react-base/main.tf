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
