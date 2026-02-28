from fastapi import APIRouter
from fastapi.responses import FileResponse, Response
import os

router = APIRouter()

PAGES_DIR = os.path.join("PAGE_SERVING_ROUTERS", "PAGES")


@router.get("/")
async def home():
    return FileResponse(os.path.join(PAGES_DIR, "index.html"))


@router.get("/about")
async def about():
    return FileResponse(os.path.join(PAGES_DIR, "about.html"))


@router.get("/opportunity")
async def opportunity():
    return FileResponse(os.path.join(PAGES_DIR, "opportunity.html"))


@router.get("/associates")
async def associates():
    return FileResponse(os.path.join(PAGES_DIR, "associates.html"))


@router.get("/founder")
async def founder():
    return FileResponse(os.path.join(PAGES_DIR, "founder.html"))


@router.get("/destinations")
async def destinations():
    return FileResponse(os.path.join(PAGES_DIR, "destinations.html"))


@router.get("/privacy")
async def privacy():
    return FileResponse(os.path.join(PAGES_DIR, "privacy.html"))


@router.get("/terms")
async def terms():
    return FileResponse(os.path.join(PAGES_DIR, "terms.html"))


@router.get("/productions")
async def productions():
    return FileResponse(os.path.join(PAGES_DIR, "productions.html"))


@router.get("/sitemap.xml")
async def sitemap():
    file_path = os.path.join(PAGES_DIR, "sitemap.xml")
    return Response(
        content=open(file_path).read(),
        media_type="application/xml",
    )
