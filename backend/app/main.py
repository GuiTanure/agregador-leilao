from fastapi import FastAPI
from app.routes import properties

app = FastAPI()

app.include_router(properties.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)