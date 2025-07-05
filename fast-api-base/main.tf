terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "3.0.2"
    }
  }
}

provider "docker" {}

resource "docker_image" "fastapi_app" {
  name = "fastapi-app:latest"
  build {
    context    = "."
    dockerfile = "Dockerfile"
  }
}

resource "docker_container" "fastapi_app" {
  name  = "fastapi-app-container"
  image = docker_image.fastapi_app.image_id

  ports {
    internal = 80
    external = 8000
  }
}
