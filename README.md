# Easy URL Shortener

A full-stack URL shortener web application with analytics.

## Features

- Shorten long URLs
- Redirect using short links
- Copy short URL
- View recent URLs
- URL creation analytics (line chart)
- Click analytics per URL (bar chart)

## Tech Stack

- Backend: FastAPI (Python)
- Frontend: React (TypeScript)
- Charts: Chart.js

## Time taken

- Approximately - 6 to 7 hours

---

#Setup Instructions

#Clone Repository

```bash
git clone <https://github.com/Jazzy71/URL-shortener.git>
cd url-shortener

##backend setup
cd backend
pip install fastapi uvicorn
uvicorn main:app --reload
##backend runs on:
http://127.0.0.1:8000

##frontend setup
cd frontend
npm install
npm start
##frontend runs on:
http://localhost:3000