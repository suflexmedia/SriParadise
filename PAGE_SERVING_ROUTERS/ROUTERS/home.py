from fastapi import APIRouter
from fastapi.responses import FileResponse
import os

router = APIRouter()

@router.get("/")
async def home():
    file_path = os.path.join("PAGE_SERVING_ROUTERS", "PAGES", "index.html")
    return FileResponse(file_path)
