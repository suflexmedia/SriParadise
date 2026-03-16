from fastapi import APIRouter, Form
from fastapi.responses import FileResponse, Response, JSONResponse
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

router = APIRouter()

PAGES_DIR = os.path.join("PAGE_SERVING_ROUTERS", "PAGES")

CONTACT_EMAIL = "arjun@sriiparadiise.com"
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASS = os.getenv("SMTP_PASS", "")


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


@router.get("/leadership-hospitality")
async def leadership_hospitality():
    return FileResponse(os.path.join(PAGES_DIR, "leadership-hospitality.html"))


@router.get("/productions")
async def productions():
    return FileResponse(os.path.join(PAGES_DIR, "productions.html"))


@router.get("/restaurants")
async def restaurants():
    return FileResponse(os.path.join(PAGES_DIR, "restaurants.html"))


@router.get("/sitemap.xml")
async def sitemap():
    file_path = os.path.join(PAGES_DIR, "sitemap.xml")
    return Response(
        content=open(file_path).read(),
        media_type="application/xml",
    )


@router.post("/contact")
async def contact(
    full_name: str = Form(""),
    company_name: str = Form(""),
    corporate_address: str = Form(""),
    email: str = Form(""),
    phone: str = Form(""),
    whatsapp: str = Form(""),
    website: str = Form(""),
    vision: str = Form(""),
):
    body_lines = [
        f"Full Name: {full_name}",
        f"Company Name: {company_name}",
        f"Corporate Address: {corporate_address}",
        f"Email ID: {email}",
        f"Phone No.: {phone}",
        f"WhatsApp No.: {whatsapp}",
        f"Website URL: {website}",
        "",
        "Vision / Thought Process / Collaboration Proposal:",
        vision,
    ]
    body = "\n".join(body_lines)

    if SMTP_USER and SMTP_PASS:
        try:
            msg = MIMEMultipart()
            msg["From"] = SMTP_USER
            msg["To"] = CONTACT_EMAIL
            msg["Subject"] = f"New Inquiry from {full_name} — Srii Paradiise"
            msg.attach(MIMEText(body, "plain"))
            with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
                server.starttls()
                server.login(SMTP_USER, SMTP_PASS)
                server.sendmail(SMTP_USER, CONTACT_EMAIL, msg.as_string())
        except Exception:
            pass

    return JSONResponse({"status": "ok"})
