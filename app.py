import os
import time
from fastapi import FastAPI, Request, Response
from fastapi.responses import PlainTextResponse
from fastapi.staticfiles import StaticFiles
from starlette.middleware.base import BaseHTTPMiddleware
from config import config
from PAGE_SERVING_ROUTERS.ROUTERS.home import router as home_router

app = FastAPI(title=config.APP_NAME, debug=config.DEBUG)

# Dev live-reload: timestamp changes every time uvicorn restarts the server
_server_start_time = str(time.time())

_LIVE_RELOAD_SCRIPT = """
<script>
(function(){
  let lastToken = null;
  setInterval(async () => {
    try {
      const res = await fetch('/__dev__/reload-check');
      const token = await res.text();
      if (lastToken && token !== lastToken) location.reload();
      lastToken = token;
    } catch(e) {}
  }, 800);
})();
</script>
"""

if config.DEBUG:
    @app.get("/__dev__/reload-check", response_class=PlainTextResponse)
    async def reload_check():
        return _server_start_time

    class LiveReloadMiddleware(BaseHTTPMiddleware):
        async def dispatch(self, request: Request, call_next):
            response = await call_next(request)
            content_type = response.headers.get("content-type", "")
            if "text/html" in content_type:
                body = b""
                async for chunk in response.body_iterator:
                    body += chunk if isinstance(chunk, bytes) else chunk.encode()
                body_str = body.decode()
                body_str = body_str.replace("</body>", _LIVE_RELOAD_SCRIPT + "</body>")
                headers = {k: v for k, v in response.headers.items() if k.lower() != "content-length"}
                return Response(
                    content=body_str,
                    status_code=response.status_code,
                    headers=headers,
                    media_type="text/html",
                )
            return response

    app.add_middleware(LiveReloadMiddleware)

# Mount static asset folders from PAGE_SERVING_ROUTERS
app.mount("/css", StaticFiles(directory="PAGE_SERVING_ROUTERS/CSS"), name="css")
# app.mount("/fonts", StaticFiles(directory="PAGE_SERVING_ROUTERS/FONTS"), name="fonts")
# app.mount("/icons", StaticFiles(directory="PAGE_SERVING_ROUTERS/ICONS"), name="icons")
# app.mount("/images", StaticFiles(directory="PAGE_SERVING_ROUTERS/IMAGES"), name="images")
app.mount("/js", StaticFiles(directory="PAGE_SERVING_ROUTERS/JS"), name="js")

# Include Page Serving Routers
app.include_router(home_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app:app",
        host=config.HOST,
        port=config.PORT,
        reload=config.DEBUG,
        reload_dirs=[".", "PAGE_SERVING_ROUTERS"],
        reload_includes=["*.py", "*.html", "*.css", "*.js"],
    )
