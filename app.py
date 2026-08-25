from flask import Flask, render_template, jsonify, send_from_directory, Response, request as flask_request, abort, stream_with_context, url_for
from urllib.request import urlopen as url_open
from urllib.parse import quote as url_quote

import os
import re

app = Flask(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))


def build_manifest():
    """Manifest with icon URLs generated via url_for (request context)."""
    icon = lambda f: url_for("static", filename=f"icons/{f}")
    return {
        "name": "القرآن المجيد - تلاوة وتدبر",
        "short_name": "القرآن المجيد",
        "description": "تطبيق القرآن الكريم: تلاوات بصوت نخبة القراء مع التفسير والترجمة",
        "id": "/",
        "start_url": "/",
        "scope": "/",
        "display": "standalone",
        "orientation": "portrait",
        "dir": "rtl",
        "lang": "ar",
        "background_color": "#0a0f1a",
        "theme_color": "#0a0f1a",
        "icons": [
            {"src": icon("icon-192.png"), "sizes": "192x192", "type": "image/png", "purpose": "any"},
            {"src": icon("icon-512.png"), "sizes": "512x512", "type": "image/png", "purpose": "any"},
            {"src": icon("maskable-512.png"), "sizes": "512x512", "type": "image/png", "purpose": "maskable"},
        ],
        "shortcuts": [
            {"name": "السور", "url": "/#/", "icons": [{"src": icon("icon-192.png"), "sizes": "192x192"}]},
            {"name": "المفضلة", "url": "/#/favorites", "icons": [{"src": icon("icon-192.png"), "sizes": "192x192"}]},
        ],
    }


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/manifest.json")
def manifest():
    resp = jsonify(build_manifest())
    resp.headers["Cache-Control"] = "public, max-age=3600"
    return resp


@app.route("/sw.js")
def service_worker():
    resp = send_from_directory(os.path.join(BASE_DIR, "static"), "sw.js")
    resp.headers["Content-Type"] = "application/javascript; charset=utf-8"
    resp.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    resp.headers["Service-Worker-Allowed"] = "/"
    return resp


@app.route("/api/download/<int:n>")
def download_surah(n):
    """Proxy-stream a full-surah MP3 from the CDN and force a browser download.

    The CDN sends neither Content-Disposition nor CORS headers, so a direct
    link just opens an audio tab in the browser. Streaming through this
    same-origin route fixes that and works on mobile browsers too.
    """
    if not (1 <= n <= 114):
        abort(400)

    reciter = flask_request.args.get("reciter", "ar.alafasy")
    if not re.fullmatch(r"[a-z0-9.\-]{2,40}", reciter):
        abort(400)

    url = f"https://cdn.islamic.network/quran/audio-surah/128/{reciter}/{n}.mp3"
    try:
        upstream = url_open(url, timeout=30)
    except Exception:
        abort(502)

    raw_name = flask_request.args.get("name", "").strip()
    safe_name = re.sub(r'[\\/:*?"<>|]', "", raw_name).strip()
    if len(safe_name) > 120:
        safe_name = safe_name[:120]
    if not safe_name:
        safe_name = f"surah-{n}"
    ascii_name = f"quran-{n:03d}.mp3"
    utf8_name = url_quote(f"{safe_name}.mp3")

    headers = {
        "Content-Disposition": f"attachment; filename=\"{ascii_name}\"; filename*=UTF-8''{utf8_name}",
        "Cache-Control": "no-store",
    }
    content_length = upstream.headers.get("Content-Length")
    if content_length and flask_request.method != "HEAD":
        headers["Content-Length"] = content_length

    def generate():
        try:
            while True:
                chunk = upstream.read(64 * 1024)
                if not chunk:
                    break
                yield chunk
        finally:
            upstream.close()

    return Response(
        stream_with_context(generate()),
        content_type="audio/mpeg",
        headers=headers,
    )


if __name__ == "__main__":
    # Production-ready defaults: Render/Heroku inject PORT; bind to all interfaces.
    # Enable local debug mode with:  FLASK_DEBUG=1 python app.py
    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("FLASK_DEBUG", "0") == "1"
    app.run(host="0.0.0.0", port=port, debug=debug)
