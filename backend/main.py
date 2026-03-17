from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
import random
import string
from datetime import datetime

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

urls = {}

def generate_code():
    return ''.join(random.choices(string.ascii_letters + string.digits, k=6))


@app.post("/api/urls")
def create_url(original_url: str):

    code = generate_code()
    while code in urls:
        code = generate_code()

    today = datetime.now().strftime("%Y-%m-%d")

    urls[code] = {
        "original_url": original_url,
        "clicks": 0,
        "created_date": today,   # 🔥 important
        "click_history": {}
    }

    return {
        "short_url": f"http://127.0.0.1:8000/{code}"
    }


@app.get("/api/urls")
def get_urls():
    result = []

    for code, data in urls.items():
        result.append({
            "code": code,
            "original_url": data["original_url"],
            "short_url": f"http://127.0.0.1:8000/{code}",
            "clicks": data["clicks"],
            "created_date": data["created_date"],
            "click_history": data["click_history"]
        })

    return result


@app.get("/{code}")
def redirect(code: str):

    if code in urls:

        urls[code]["clicks"] += 1

        today = datetime.now().strftime("%Y-%m-%d")

        if today in urls[code]["click_history"]:
            urls[code]["click_history"][today] += 1
        else:
            urls[code]["click_history"][today] = 1

        return RedirectResponse(urls[code]["original_url"])

    return {"error": "URL not found"}