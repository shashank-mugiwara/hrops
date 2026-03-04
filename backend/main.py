from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.endpoints import candidates, groups, departments, rules, documents, welcome, dashboard, templates_api, settings_api
from .db import init_db

app = FastAPI()

# Initialize Database
init_db()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify actual origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(candidates.router)
app.include_router(groups.router)
app.include_router(departments.router)
app.include_router(rules.router)
app.include_router(documents.router)
app.include_router(welcome.router)
app.include_router(dashboard.router)
app.include_router(templates_api.router)
app.include_router(settings_api.router)

@app.get("/")
def read_root():
    return {"message": "Trust HR Portal Backend API"}
