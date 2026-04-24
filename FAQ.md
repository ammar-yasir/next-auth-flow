# Frequently Asked Questions (FAQ)

## General Questions

### Q: Is this production-ready?
**A:** Yes! This is a complete, production-grade authentication solution. It includes:
- Enterprise-level OAuth integration
- Database + ORM setup
- Protected routes with middleware
- TypeScript support
- Error handling
- Security best practices

Before deploying, follow the production checklist in DEPLOYMENT.md.

---

### Q: How long does setup take?
**A:** Typically 15-30 minutes:
1. Install dependencies (2 min)
2. Get OAuth credentials (5-10 min per provider)
3. Configure environment variables (5 min)
4. Push database schema (2 min)
5. Test the app (5 min)

---

### Q: Can I use this with a different database?
**A:** Yes! Prisma supports:
- PostgreSQL (default)
- MySQL/MariaDB
- SQLite
- MongoDB
- SQL Server

Edit `prisma/schema.prisma` datasource and run `npm run db:push`.

---

## Setup & Configuration

### Q: I can't get NEXTAUTH_SECRET. How do I generate it?
**A:** Run this command:

**macOS/Linux:**
```bash
openssl rand -base64 32
```

**Windows (PowerShell):**
```powershell
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

Then paste the output into `.env.local` as `NEXTAUTH_SECRET`.

---

### Q: What if NEXTAUTH_URL is wrong?
**A:** 
- **Development:** `http://localhost:3000`
- **Production:** `https://yourdomain.com` (no trailing slash)

OAuth providers validate this URL against callback URLs. Mismatch = auth fails.

---

### Q: How do I find my OAuth credentials?

**Google:**
1. Go to https://console.cloud.google.com
2. Create a project
3. Enable "Google+ API"
4. Go to Credentials → Create OAuth 2.0 IDs
5. Add authorized redirect: `http://localhost:3000/api/auth/callback/google`

**GitHub:**
1. Go to https://github.com/settings/developers (Settings → Developer settings → OAuth Apps)
2. Register a new OAuth App
3. Set Authorization callback URL: `http://localhost:3000/api/auth/callback/github`

**LinkedIn:**
1. Go to https://www.linkedin.com/developers/apps
2. Create a new app
3. Go to Auth tab → Add redirect URL: `http://localhost:3000/api/auth/callback/linkedin`
4. Copy Client ID and Client Secret from Auth tab

---

## Database Issues

### Q: I get "Database connection failed"
**A:** Check these:
```bash
# Verify DATABASE_URL format
postgresql://user:password@host:port/database

# Test connection
psql postgresql://user:password@host:port/database

# Check Prisma can connect
npx prisma db execute --stdin < /dev/null
```

---

### Q: How do I reset the database?
**A:** 
```bash
# Drop all tables (WARNING: deletes all data)
npx prisma migrate reset

# Or manually reset
npx prisma db execute --stdin <<EOF
DROP TABLE IF EXISTS "Account" CASCADE;
DROP TABLE IF EXISTS "Session" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;
DROP TABLE IF EXISTS "VerificationToken" CASCADE;
EOF

# Then push schema again
npm run db:push
```

---

### Q: How do I see what's in the database?
**A:**
```bash
# Open Prisma Studio (GUI for database)
npm run db:studio

# Or use psql (command line)
psql postgresql://user:password@host:port/database
SELECT * FROM "User";
```

---

## Authentication Issues

### Q: OAuth button click does nothing
**A:** Check:
1. Verify `NEXTAUTH_URL` matches your current URL
2. Check browser console for errors
3. Verify OAuth credentials in `.env.local`
4. Clear browser cookies and try again
5. Check cookies aren't being blocked

---

### Q: "Error: Provider not configured"
**A:** 
- Ensure `GOOGLE_CLIENT_ID` is in `.env.local`
- Check there are no typos in environment variable names
- Restart dev server after changing `.env.local`

```bash
# Restart with:
# 1. Stop server (Ctrl+C)
# 2. npm run dev
```

---

### Q: I'm stuck in a redirect loop
**A:**
1. Clear all browser cookies
2. Clear `.next` cache: `rm -rf .next`
3. Restart dev server
4. Verify `NEXTAUTH_URL` is correct
5. Verify OAuth redirects are correct

---

### Q: Session not persisting after page refresh
**A:**
- Check `NEXTAUTH_SECRET` is set and correct
- Verify session cookie isn't being blocked
- Check browser "Application" → "Cookies" for `next-auth.session-token`
- Clear cookies and try again

---

### Q: Can't sign up - says provider already linked
**A:** This happens with `allowDangerousEmailAccountLinking: true`. It merges accounts with same email.

To disable:
```typescript
// lib/auth.ts
Google({
  // Remove this line:
  // allowDangerousEmailAccountLinking: true,
})
```

---

## Deployment Issues

### Q: OAuth not working after deployment
**A:**
1. Update all OAuth provider redirect URLs to production domain
   - Google: `https://yourdomain.com/api/auth/callback/google`
   - GitHub: `https://yourdomain.com/api/auth/callback/github`
   - LinkedIn: `https://yourdomain.com/api/auth/callback/linkedin`

2. Set environment variables in deployment platform
3. Set `NEXTAUTH_URL=https://yourdomain.com` (production domain)
4. Deploy and test

---

### Q: Database connection failing after deployment
**A:**
- Verify `DATABASE_URL` is set in deployment platform
- Check database is accessible from deployment server
- Test locally first with same database
- Check database logs for connection attempts

---

### Q: Getting 500 errors on production
**A:**
1. Check application logs (Vercel/Railway/Netlify dashboard)
2. Verify all environment variables are set
3. Test database connection
4. Check OAuth credentials are correct
5. Enable debug logging to see detailed errors

---

## Development Questions

### Q: How do I add more OAuth providers?
**A:**
```typescript
// lib/auth.ts
import Provider from "next-auth/providers/[provider]";

providers: [
  // Existing providers...
  Provider({
    clientId: process.env.PROVIDER_CLIENT_ID,
    clientSecret: process.env.PROVIDER_CLIENT_SECRET,
  }),
],
```

Add environment variables to `.env.local`.

---

### Q: How do I protect more routes?
**A:**
```typescript
// middleware.ts
const protectedRoutes = ["/dashboard", "/settings", "/account"];
```

Any route in this array requires authentication.

---

### Q: How do I customize the sign-in page?
**A:** Edit `app/auth/signin/page.tsx`. It's a regular React component.

---

### Q: Can I store additional user data?
**A:**
1. Extend the Prisma schema:
```prisma
// prisma/schema.prisma
model User {
  // ... existing fields
  phoneNumber String?
  companyName String?
  role String? @default("user")
}
```

2. Run migration: `npm run db:migrate`

3. Update callbacks to store data:
```typescript
// lib/auth.ts
callbacks: {
  async jwt({ token, user, profile }) {
    if (profile?.phone) {
      token.phone = profile.phone;
    }
    return token;
  }
}
```

---

### Q: How do I add email verification?
**A:** Email verification requires sending emails. Add:

```bash
npm install resend
```

Then create an email verification flow in your auth handlers.

---

### Q: How do I implement role-based access?
**A:**
```typescript
// lib/auth.ts
callbacks: {
  async session({ session, token }) {
    const user = await prisma.user.findUnique({
      where: { id: token.id },
      select: { role: true }
    });
    session.user.role = user?.role;
    return session;
  }
}

// middleware.ts
if (pathname.startsWith("/admin") && session.user.role !== "admin") {
  return NextResponse.redirect(new URL("/", request.url));
}
```

---

## Security Questions

### Q: Is this secure?
**A:** Yes:
- ✅ OAuth 2.0 standard
- ✅ CSRF protection
- ✅ Secure session tokens
- ✅ HTTP-only cookies
- ✅ Validated redirects
- ✅ Database encryption (recommended)

Always use HTTPS in production.

---

### Q: Where is the session stored?
**A:** 
- **Token + Cookie:** `next-auth.session-token` (HTTP-only)
- **Database:** Sessions are also stored in `Session` table
- **Not localStorage:** Session data stays secure

---

### Q: Can I see my NEXTAUTH_SECRET?
**A:** No. Keep it secret! It's used to:
- Encrypt JWT tokens
- Generate CSRF tokens
- Sign session cookies

Never commit it to version control.

---

## Performance Questions

### Q: How many users can this support?
**A:** Depends on your infrastructure:
- SQLite: ~1,000 concurrent users
- PostgreSQL: 10,000+ concurrent users
- With caching/CDN: 100,000+ users

Scale the database and server as needed.

---

### Q: How do I improve performance?
**A:**
1. Use database indexing (Prisma does this)
2. Enable caching headers
3. Use CDN for static files
4. Monitor database queries
5. Use Prisma query optimization

---

## Testing

### Q: How do I test authentication?
**A:**
```typescript
// Example test
const response = await fetch("/api/user/profile");
expect(response.status).toBe(401); // Not signed in

// Sign in, then:
const response = await fetch("/api/user/profile");
expect(response.status).toBe(200); // Signed in
```

---

## Still Need Help?

1. **Check the docs:**
   - [Auth.js Docs](https://authjs.dev/)
   - [Next.js Docs](https://nextjs.org/docs)
   - [Prisma Docs](https://www.prisma.io/docs/)

2. **Common issues:**
   - Check browser console (F12)
   - Check server logs
   - Check `.env.local` is correct

3. **Debug mode:**
   ```bash
   # Add to .env.local
   DEBUG=next-auth:*
   
   # Restart server and check console logs
   ```

4. **Still stuck?**
   - Verify all steps in SETUP.md
   - Check all environment variables
   - Test OAuth credentials individually
   - Try with different browser
   - Clear all cache/cookies

---

## Reporting Issues

If you find a bug:
1. Reproduce it consistently
2. Note exact error messages
3. Check .next build artifacts
4. Provide `.env.local` example (hide secrets!)
5. Share error logs

---

Last updated: 2024
