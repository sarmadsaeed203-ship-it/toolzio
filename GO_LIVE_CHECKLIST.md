# Toolzio GO_LIVE_CHECKLIST

Follow this final checklist right before hitting "Deploy" to ensure the public launch is flawless.

## 1. Repository Cleanliness
- [x] Unnecessary files (scratchpads, test payloads) removed.
- [x] Node modules (`node_modules`) properly ignored in `.gitignore`.
- [x] Python virtual environments (`venv`) properly ignored.
- [x] Temporary conversion directories (`backend/uploads`, `backend/outputs`, `backend/temp`) properly ignored.
- [x] Clear `README.md` containing tech stack, setup instructions, and deployment links.

## 2. GitHub Push
- [ ] Initialize git (if not already done) and commit the final "Phase 4 - Production Ready" branch.
- [ ] Push code to GitHub repository (e.g. `yourusername/toolzio`).

## 3. Render Deployment (Backend)
- [ ] Navigate to [Render](https://dashboard.render.com/) and create a new **Web Service**.
- [ ] Connect the GitHub repository.
- [ ] Render configuration matches `backend` folder and `Dockerfile`.
- [ ] Environment variables configured (`BACKEND_CORS_ORIGINS`, `LOG_LEVEL`).
- [ ] Wait for build to complete. 
- [ ] **Verification**: Run `curl https://<your-render-url>/health` and ensure it responds with `{"status":"ok"}`.

## 4. Vercel Deployment (Frontend)
- [ ] Navigate to [Vercel](https://vercel.com/) and create a **New Project**.
- [ ] Connect the GitHub repository.
- [ ] Add the `VITE_API_BASE_URL` variable containing the Render URL obtained in Step 3.
- [ ] Deploy.
- [ ] **Verification**: Open the Vercel link and test a file upload. Ensure conversion succeeds and downloading works.

## 5. Domain Configuration
- [ ] Attach your custom domain in the Vercel project settings (`toolzio.com`).
- [ ] Configure DNS:
  - Add A Record for `@` pointing to Vercel's IP (`76.76.21.21`).
  - Add CNAME for `www` pointing to `cname.vercel-dns.com.`.
- [ ] Verify Vercel issues the SSL Certificate (HTTPS) successfully.
- [ ] Ensure non-www to www redirect (or vice versa) works.

## 6. Search Engines (SEO)
- [ ] Open **Google Search Console** and submit domain via DNS verification.
- [ ] Navigate to **Sitemaps** and submit `https://toolzio.com/sitemap.xml`.
- [ ] Open **Bing Webmaster Tools** and import the Google Search Console property.
- [ ] Test the `robots.txt` file at `https://toolzio.com/robots.txt` to ensure it allows crawling.

## 7. Analytics Activation
- [ ] Register with an analytics provider (GA4, Plausible).
- [ ] Obtain the tracking ID.
- [ ] Add the ID to Vercel Environment Variables (`VITE_GA_ID`).
- [ ] Re-deploy the Vercel project to activate tracking.

## 8. Final QA Check (Post-Launch)
- [ ] Verify Homepage loads perfectly with correct metadata (Title, Description).
- [ ] Tool 1: Test **PDF to Word**.
- [ ] Tool 2: Test **Word to PDF**.
- [ ] Tool 3: Test **Merge PDF**.
- [ ] Tool 4: Test **Split PDF**.
- [ ] Tool 5: Test **Compress PDF**.
- [ ] Check Favicon on multiple browsers (Desktop & Mobile).

---
**Congratulations! Toolzio is now live and ready for production traffic.**
