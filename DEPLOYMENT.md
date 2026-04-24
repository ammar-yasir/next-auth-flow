# Deployment Guides

This document provides step-by-step deployment instructions for various platforms.

## 🚀 Vercel Deployment (Recommended)

Vercel is the official Next.js deployment platform and is ideal for this application.

### Steps:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Environment Variables**
   - In Vercel dashboard, go to "Settings" → "Environment Variables"
   - Add all variables from `.env.example`:
     - `DATABASE_URL`
     - `NEXTAUTH_SECRET`
     - `NEXTAUTH_URL` (use your Vercel domain)
     - `GOOGLE_CLIENT_ID`
     - `GOOGLE_CLIENT_SECRET`
     - `GITHUB_CLIENT_ID`
     - `GITHUB_CLIENT_SECRET`
     - `LINKEDIN_CLIENT_ID`
     - `LINKEDIN_CLIENT_SECRET`

4. **Update OAuth Redirects**
   - Google: Add `https://yourdomain.vercel.app/api/auth/callback/google`
   - GitHub: Add `https://yourdomain.vercel.app/api/auth/callback/github`
   - LinkedIn: Add `https://yourdomain.vercel.app/api/auth/callback/linkedin`

5. **Set NEXTAUTH_URL**
   - Make sure it's set to your production domain

6. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy

### Notes:
- Use Vercel's PostgreSQL database or connect to external database
- Set environment variables for production in Vercel dashboard
- Deployments happen automatically on git push to main

---

## 🚂 Railway Deployment

Railway provides easy PostgreSQL integration.

### Steps:

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up and connect GitHub

2. **Create New Project**
   - Click "New Project" → "Deploy from GitHub"
   - Select your repository

3. **Add PostgreSQL Database**
   - Click "Add Service" → "Database" → "PostgreSQL"
   - Railway will generate `DATABASE_URL`

4. **Configure Environment Variables**
   - In Railway dashboard, go to your app
   - Click "Variables"
   - Add all environment variables
   - For `DATABASE_URL`, Railway provides it automatically

5. **Update OAuth URLs**
   - Get your Railway domain from deployment
   - Update OAuth callback URLs to `https://yourdomain.railway.app/api/auth/callback/[provider]`

6. **Set NEXTAUTH_URL**
   ```
   NEXTAUTH_URL=https://yourdomain.railway.app
   ```

7. **Deploy**
   - Click "Deploy"
   - Railway handles building and deployment

### Database Migrations:
```bash
# Run migrations after first deployment
railway run npm run db:push
```

---

## 🌐 Netlify Deployment

Netlify works with external databases.

### Steps:

1. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Select your GitHub repository

2. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Production branch: `main`

3. **Set Environment Variables**
   - Go to "Site settings" → "Build & deploy" → "Environment"
   - Add all variables from `.env.example`
   - **Important**: Include `NEXTAUTH_URL=https://yourdomain.netlify.app`

4. **Database Setup**
   - Use external database service:
     - Supabase PostgreSQL
     - Planetscale MySQL
     - Render PostgreSQL
   - Get connection string and use as `DATABASE_URL`

5. **Update OAuth Redirects**
   - Google: `https://yourdomain.netlify.app/api/auth/callback/google`
   - GitHub: `https://yourdomain.netlify.app/api/auth/callback/github`
   - LinkedIn: `https://yourdomain.netlify.app/api/auth/callback/linkedin`

6. **Deploy**
   - Netlify will automatically deploy on push

### Database Migrations:
```bash
# After deployment, run:
npx prisma db push --skip-generate
```

---

## 🔗 Other Cloud Providers

### AWS Amplify

1. Connect GitHub repository
2. Use AWS RDS for PostgreSQL
3. Set environment variables in Amplify console
4. Update OAuth redirect URLs
5. Deploy

### Google Cloud Run

1. Create Dockerfile
2. Push to Google Cloud Registry
3. Deploy to Cloud Run
4. Use Cloud SQL for PostgreSQL
5. Set environment variables
6. Update OAuth URLs

### Azure App Service

1. Create App Service
2. Connect GitHub repository
3. Use Azure Database for PostgreSQL
4. Set environment variables
5. Configure OAuth redirects
6. Deploy

---

## 🗄️ Database Services

### Recommended PostgreSQL Hosting:

**Supabase** (Recommended for beginners)
- Free tier included
- Easy to set up
- Dashboard included
- Connection: `postgresql://...@db.XXX.supabase.co`

**Railway**
- Integrated with Railway platform
- Easy one-click setup
- Included with paid plans

**Render**
- Separate database and app deployment
- Free tier available
- Good performance

**Vercel Postgres**
- Native Vercel integration
- Free tier available
- Easy setup with Vercel

**PlanetScale** (MySQL alternative)
- MySQL-compatible
- Free tier available
- Serverless scaling

---

## 🔐 Production Checklist

Before deploying to production:

- [ ] Set strong `NEXTAUTH_SECRET`
- [ ] Enable HTTPS (all providers require this)
- [ ] Set `NEXTAUTH_URL` to production domain
- [ ] Update all OAuth redirectURL with production domain
- [ ] Test OAuth flows completely
- [ ] Test protected routes
- [ ] Monitor logs for errors
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Configure CORS if needed
- [ ] Set up monitoring and alerts
- [ ] Review security headers
- [ ] Test on actual provider apps
- [ ] Backup database regularly

---

## 📊 Monitoring

### Recommended Tools:

- **Sentry** - Error tracking
- **LogRocket** - Session replay
- **Datadog** - Infrastructure monitoring
- **New Relic** - Performance monitoring

### Setup Example:

```typescript
// lib/sentry.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

---

## 🚨 Troubleshooting Deployment

### OAuth not working after deployment
- Verify redirect URLs are updated in provider dashboards
- Check `NEXTAUTH_URL` is set correctly
- Ensure all environment variables are set
- Clear browser cookies

### Database connection failing
- Verify `DATABASE_URL` is correct
- Check database is accessible from deployment server
- Test connection locally first
- Review database logs

### Session issues
- Clear all browser cookies
- Verify `NEXTAUTH_SECRET` is set
- Check session duration settings
- Verify JWT settings

### 500 errors
- Check application logs
- Verify all environment variables
- Test OAuth credentials
- Check database connections

---

## 📞 Support

For issues:
1. Check application logs
2. Verify environment variables
3. Test OAuth credentials
4. Review provider documentation
5. Check Auth.js documentation
