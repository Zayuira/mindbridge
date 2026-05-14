# Deployment

This repository has two deployable apps:

- `frontend`: Next.js app for Vercel
- `ai-service`: FastAPI app for Render

## Vercel Frontend

Create a Vercel project from this repository and set:

- Root Directory: `frontend`
- Framework Preset: `Next.js`
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: `.next`

Required environment variables:

- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `JWT_SECRET`
- `AI_SERVICE_URL`
- `RESEND_API_KEY`
- `STRIPE_SECRET_KEY`

Optional environment variables:

- `REDIS_URL`
- `ELASTICSEARCH_URL`
- `ELASTICSEARCH_USERNAME`
- `ELASTICSEARCH_PASSWORD`
- `AWS_REGION`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_S3_BUCKET_NAME`
- `AWS_ENDPOINT`

## Render AI Service

Render can use the root `render.yaml` blueprint, or you can create a Web Service manually:

- Root Directory: `ai-service`
- Runtime: `Python`
- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Health Check Path: `/health`

After Render deploys, copy its service URL into Vercel as:

```text
AI_SERVICE_URL=https://your-render-service.onrender.com
```
