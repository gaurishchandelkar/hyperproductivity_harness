from fastapi import FastAPI

from backend.api.routes import router


def create_app() -> FastAPI:
    app = FastAPI(title="Hyper Harness")
    app.include_router(router)
    return app


app = create_app()
