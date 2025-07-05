# RANDOM_COLOR.md

## Random Color Integration: React + FastAPI + Terraform

This document explains how to create a React page that displays a random color using a FastAPI backend, and how to connect both projects when deployed with Terraform.

---

### 1. FastAPI Backend: Random Color Endpoint

In your FastAPI project (`fast-api-base`), add an endpoint to provide a random color:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import random

app = FastAPI()

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/colors")
def get_random_color():
    hex_color = "#" + ''.join([random.choice('0123456789ABCDEF') for _ in range(6)])
    return {"color": hex_color}

@app.get("/colorsrgb")
def get_random_color_rgb():
    r = random.randint(0, 255)
    g = random.randint(0, 255)
    b = random.randint(0, 255)
    rgb_color = f"rgb({r}, {g}, {b})"
    return {"color": rgb_color}
```

- The `/colors` endpoint returns a random HEX color.
- The `/colorsrgb` endpoint returns a random RGB color.
- CORS is enabled for the React frontend.

---

### 2. React Frontend: ColorPage Component

In your React project (`react-base`), create a page to fetch and display the random color:

```javascript
import React, { useEffect, useState } from 'react';

function ColorPage() {
  const [color, setColor] = useState('');

  useEffect(() => {
    fetch('http://localhost:8000/colorsrgb')
      .then((res) => res.json())
      .then((data) => {
        setColor(data.color);
      });
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h1 style={{ color: color ? color : '#000' }}>
        {color ? 'MY RANDOM COLOR' : 'Loading...'}
      </h1>
    </div>
  );
}

export default ColorPage;
```

- The page fetches a random RGB color from the FastAPI backend and displays it as the color of the title.

---

### 3. Terraform: Dockerized Deployment

Both projects are containerized and managed with Terraform. Example resources:

**For FastAPI (`fast-api-base/main.tf`):**
```hcl
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
```

**For React (`react-base/main.tf`):**
```hcl
resource "docker_image" "react_app" {
  name = "react-app:latest"
  build {
    context = "."
    dockerfile = "Dockerfile"
  }
}

resource "docker_container" "react_app" {
  name  = "react-app-container"
  image = docker_image.react_app.image_id

  ports {
    internal = 80
    external = 3000
  }
}
```

---

### 4. CORS: Why It Matters

When the React app (on port 3000) requests data from FastAPI (on port 8000), the browser enforces CORS. The FastAPI backend must allow requests from the React frontend, or the browser will block them. This is solved by enabling CORS in FastAPI as shown above.

---

### 5. Usage

- Start both containers (React and FastAPI) using Terraform.
- Visit `http://localhost:3000/color` in your browser.
- The page will display the title "MY RANDOM COLOR" in a random color fetched from the FastAPI backend.

---

**Summary:**
- FastAPI provides a random color API with CORS enabled.
- React fetches and displays the color.
- Terraform manages both containers for easy deployment.
