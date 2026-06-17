# EcoTrack AI

## Quick Start
### Frontend
cd apps/web && npm install && npm run dev

### Backend
cd apps/api && pip install -r requirements.txt
uvicorn app.main:app --reload

## Running Tests
### Frontend unit tests
cd apps/web && npm test

### Frontend E2E tests
cd apps/web && npm run test:e2e

### Backend tests
cd apps/api && pytest tests/ -v

## Deployment
- Frontend: Connect apps/web/ to Vercel
- Backend: Connect apps/api/ to Railway
- Set env variables in both dashboards
