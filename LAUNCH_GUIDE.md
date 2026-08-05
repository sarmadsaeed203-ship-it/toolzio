# Toolzio Production Launch Guide

Welcome to the production deployment guide for Toolzio. Follow these steps meticulously to deploy your application to Vercel (Frontend) and Render (Backend).

## 1. Deployment Guide

Toolzio utilizes a decoupled architecture:
- **Frontend**: A React SPA built with Vite, deployed on a global CDN edge network via **Vercel**.
- **Backend**: A Python FastAPI server handling file conversions, deployed via Docker on **Render**.

## 2. Environment Variables

Before deploying, ensure you have these values ready.

**Frontend (`.env.production`)**
```env
VITE_API_BASE_URL=https://toolzio-api.onrender.com
# VITE_GA_ID=G-XXXXXXXXXX
# VITE_PLAUSIBLE_DOMAIN=toolzio.com
# VITE_CLARITY_ID=XXXXXXX
```

**Backend (Render Environment Variables)**
```env
BACKEND_CORS_ORIGINS=["https://toolzio.com", "https://www.toolzio.com"]
LOG_LEVEL=INFO
HOST=0.0.0.0
# PORT is automatically injected by Render
```

## 3. Render Setup

1. Push your code to a GitHub repository.
2. Sign in to [Render](https://dashboard.render.com).
3. Click **New** > **Web Service**.
4. Connect your GitHub repository.
5. In the configuration:
   - **Name**: `toolzio-api`
   - **Environment**: `Docker`
   - **Root Directory**: `backend` (or leave blank if using the `render.yaml` blueprint).
6. Under **Advanced**, add the backend environment variables.
7. Click **Create Web Service**. 
   - *Note: The initial build installs LibreOffice and may take a few minutes.*
8. Once deployed, note your new API URL (e.g., `https://toolzio-api.onrender.com`).
9. Verify the deployment: `curl https://toolzio-api.onrender.com/health` should return `{"status":"ok"}`.

## 4. Vercel Setup

1. Sign in to [Vercel](https://vercel.com).
2. Click **Add New** > **Project**.
3. Import the GitHub repository.
4. Vercel automatically detects **Vite**. Confirm the following settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Open **Environment Variables** and add `VITE_API_BASE_URL` with your Render API URL.
6. Click **Deploy**.
7. Vercel will process `vercel.json` automatically, establishing SPA rewrites and security headers.

## 5. Domain Setup

1. In the Vercel dashboard, navigate to your project **Settings** > **Domains**.
2. Add your custom domain (e.g., `toolzio.com`).
3. Add `www.toolzio.com` and configure it to redirect to the non-www version (or vice versa based on your preference).
4. Update your domain registrar's DNS records (A and CNAME records) to point to Vercel.
5. Vercel automatically generates SSL certificates, forcing HTTPS on all connections.

## 6. Search Console Setup

1. Go to [Google Search Console](https://search.google.com/search-console).
2. Add a new property and select **Domain** verification.
3. Add the provided TXT record to your domain registrar's DNS settings.
4. Wait for verification, then navigate to **Sitemaps**.
5. Submit `https://toolzio.com/sitemap.xml`.

## 7. Bing Webmaster Setup

1. Go to [Bing Webmaster Tools](https://www.bing.com/webmasters/).
2. Choose **Import from Google Search Console** for instant verification.
3. Alternatively, add the site manually and verify via DNS.
4. Submit your sitemap: `https://toolzio.com/sitemap.xml`.

## 8. Analytics Setup

Toolzio is equipped with an `AnalyticsProvider` wrapper that dynamically injects scripts based on environment variables.

1. Create an account with Google Analytics, Plausible, or Microsoft Clarity.
2. Obtain your Tracking ID (e.g., `G-XXXXXXXXXX`).
3. Add the corresponding environment variable to Vercel (e.g., `VITE_GA_ID`).
4. Trigger a new deployment on Vercel to bake the variable into the build. The frontend will begin tracking automatically.

## 9. Launch Checklist

- [x] Frontend builds locally without errors.
- [x] Backend starts and serves the `/health` endpoint successfully.
- [x] Environment files (`.env.example`) are generated and documented.
- [x] Dockerfile and `docker-compose.yml` are configured for Linux environments.
- [x] Dynamic `sitemap.xml` generates correctly.
- [x] `robots.txt` is in place.
- [x] Modern SEO (OpenGraph, Twitter Cards, JSON-LD) tags populate correctly.
- [x] Analytics placeholders are prepared.

## 10. Common Errors & Fixes

- **CORS Error on Frontend**: The backend rejected the preflight request. Ensure `BACKEND_CORS_ORIGINS` in Render exactly matches your Vercel frontend domain (`["https://toolzio.com"]`).
- **404 on Page Refresh**: Vercel SPA routing failed. Ensure `vercel.json` exists in the root directory with the rewrite rule pointing to `/index.html`.
- **Conversion Failing in Production**: Ensure LibreOffice installed correctly in the Docker container. Check the Render application logs for `soffice` exit codes.
- **API Requests Timeout**: The backend instance may have spun down (if on Render's Free Tier). Initial requests take ~50s to wake the server up. Upgrade to a paid plan for instant responses.
- **Frontend Hits `/api/tools/...` (404)**: The `VITE_API_BASE_URL` was not set during Vercel's build phase. Add it to Vercel environment variables and redeploy.
