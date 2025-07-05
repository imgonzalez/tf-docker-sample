from fastapi import FastAPI
# Path parameters example
from typing import Union
import random
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # or ["*"] to allow all origins (not recommended for production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Hello": "World"}



@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}



@app.get("/users/me")
async def read_user_me():
    return {"user_id": "the current user"}


@app.get("/users/{user_id}")
async def read_user(user_id: str):
    return {"user_id": user_id}


# New endpoint to get a random color in HEX format
@app.get("/colors")
def get_random_color():
    hex_color = "#" + ''.join([random.choice('0123456789ABCDEF') for _ in range(6)])
    return {"color": hex_color}


# New endpoint to get a random color in RGB format
@app.get("/colorsrgb")
def get_random_color_rgb():
    r = random.randint(0, 255)
    g = random.randint(0, 255)
    b = random.randint(0, 255)
    rgb_color = f"rgb({r}, {g}, {b})"
    return {"color": rgb_color}