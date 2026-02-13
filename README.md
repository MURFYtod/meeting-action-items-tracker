# Meeting Action Items Tracker

A simple web app to extract and manage action items from meeting transcripts.

## Features
- Paste meeting transcript
- Extract action items (task + owner)
- Add action item manually
- Edit action item
- Delete action item
- Mark action item as done
- View last 5 processed transcripts
- Status page to verify backend, database, and extraction service

## Tech Stack
Frontend:
- React (Vite)
- Axios

Backend:
- Node.js
- Express
- SQLite (better-sqlite3)

Hosting:
- Backend: Render
- Frontend: Vercel

---

## How to run locally
## Frontend
cd frontend
npm install
npm run dev


### Backend
```bash
cd backend
npm install
node server.js
