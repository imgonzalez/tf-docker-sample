# FastAPI Example: Hello World & Path Params

This directory contains a minimal FastAPI application with several endpoints, containerized and deployed locally using Terraform and Docker.

## Project Structure

```
fast-api-base/
├── Dockerfile
├── main.py
├── main.tf
└── README_FASTAPI.md
```

## Endpoints Implemented

- `GET /` — Returns `{ "Hello": "World" }`
- `GET /items/{item_id}` — Returns item ID and optional query param `q`
- `GET /users/me` — Returns a static user
- `GET /users/{user_id}` — Returns the user_id from the path

## Setup & Deployment Steps

### 1. Prerequisites
- Docker installed and running
- Terraform installed (v1.0.0+)

### 2. Build and Deploy with Terraform

From the `fast-api-base` directory, run:

```bash
terraform init
terraform apply -auto-approve
```

This will:
- Build the Docker image for the FastAPI app
- Create and start a Docker container exposing the app on port 8000 (host)

### 3. Access the API

- Open your browser or use curl/Postman:
    - [http://localhost:8000/docs](http://localhost:8000/docs) — Interactive API docs (Swagger UI)
    - [http://localhost:8000/](http://localhost:8000/) — Hello World
    - [http://localhost:8000/items/42?q=test](http://localhost:8000/items/42?q=test)
    - [http://localhost:8000/users/me](http://localhost:8000/users/me)
    - [http://localhost:8000/users/alice](http://localhost:8000/users/alice)

### 4. Update the Deployment After Code Changes

If you modify `main.py`, redeploy with:

```bash
terraform apply -auto-approve
```

If changes are not detected, force a rebuild:

```bash
terraform taint docker_image.fastapi_app
terraform apply -auto-approve
```

### 5. Stop and Remove the Deployment

```bash
terraform destroy -auto-approve
```

---

**Note:**
- The Dockerfile uses `uvicorn` to serve the FastAPI app.
- The container exposes port 80, mapped to 8000 on the host via Terraform.
- All endpoints are visible in `/docs` after a successful deployment.
