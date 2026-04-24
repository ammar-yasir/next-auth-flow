# Production-Ready Auth.js SaaS Implementation

A complete, enterprise-grade authentication solution for Next.js SaaS applications with Google, GitHub, and LinkedIn OAuth integration.

## 📋 Features

✅ **OAuth Authentication** - Google, GitHub, and LinkedIn
✅ **Protected Routes** - Middleware-based route protection
✅ **User Management** - Prisma ORM with PostgreSQL
✅ **Session Management** - JWT-based sessions
✅ **Dashboard** - Protected user dashboard
✅ **Responsive Design** - Mobile-friendly UI with Tailwind CSS
✅ **TypeScript** - Full type safety
✅ **Production-Ready** - Ready for real SaaS applications

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Create a PostgreSQL Database

```bash
# Using PostgreSQL locally or a service like Railway, Supabase, or PlanetScale
# Get your DATABASE_URL
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in your values:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/auth_saas_db"

# NextAuth Configuration
NEXTAUTH_SECRET="generate-with: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth - Get from https://console.cloud.google.com
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# GitHub OAuth - Get from https://github.com/settings/applications/new
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# LinkedIn OAuth - Get from https://www.linkedin.com/developers/apps
LINKEDIN_CLIENT_ID="your-linkedin-client-id"
LINKEDIN_CLIENT_SECRET="your-linkedin-client-secret"

NODE_ENV="development"
```

### 4. Generate NEXTAUTH_SECRET

```bash
# macOS/Linux
openssl rand -base64 32

# Windows (PowerShell)
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

### 5. Push Database Schema

```bash
npm run db:push
```

### 6. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

## 🔐 OAuth Provider Setup

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Choose "Web application"
6. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
7. Copy `Client ID` and `Client Secret`

### GitHub OAuth Setup

1. Go to [GitHub Settings → Developer settings → OAuth Apps](https://github.com/settings/applications/new)
2. Create a new OAuth App
3. Set Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copy `Client ID` and generate/copy `Client Secret`

### LinkedIn OAuth Setup

1. Go to [LinkedIn Developer Console](https://www.linkedin.com/developers/apps)
2. Create a new app
3. On the app settings, find "Authorized redirect URLs for your app"
4. Add: `http://localhost:3000/api/auth/callback/linkedin`
5. Copy `Client ID` and `Client Secret` from Auth tab

## 📁 Project Structure

```
auth-flow/
├── app/
│   ├── api/auth/[...nextauth]/route.ts    # Auth API route
│   ├── auth/
│   │   ├── signin/page.tsx                 # Sign in page
│   │   ├── signup/page.tsx                 # Sign up page
│   │   └── layout.tsx
│   ├── dashboard/page.tsx                  # Protected dashboard
│   ├── globals.css                         # Global styles
│   ├── layout.tsx                          # Root layout
│   └── page.tsx                            # Home page
├── lib/
│   ├── auth.ts                             # Auth.js configuration
│   └── helpers.ts                          # Helper functions
├── prisma/
│   ├── schema.prisma                       # Database schema
│   └── .env                                # Prisma env
├── types/
│   └── next-auth.d.ts                      # TypeScript definitions
├── middleware.ts                           # Route protection middleware
├── .env.example                            # Environment template
├── .env.local                              # Local environment (git ignored)
├── tsconfig.json                           # TypeScript config
├── next.config.ts                          # Next.js config
├── package.json
└── README.md
```

## 🗄️ Database Schema

The application uses Prisma ORM with the following models:

### User
- `id` - Unique identifier
- `name` - User's name
- `email` - User's email (unique)
- `emailVerified` - Email verification timestamp
- `image` - Profile image URL
- `createdAt` - Account creation date
- `updatedAt` - Last update date

### Account
- Stores OAuth provider information
- Links users to their OAuth accounts
- Stores access/refresh tokens

### Session
- Manages user sessions
- JWT-based session tokens

### VerificationToken
- Handles email verification tokens

## 🔄 Authentication Flow

1. **Sign In** - User clicks provider button (Google/GitHub/LinkedIn)
2. **Provider Authorization** - User authorizes at provider
3. **Callback** - Provider redirects to `/api/auth/callback/[provider]`
4. **Session Creation** - User session is created
5. **Redirect** - User is redirected to dashboard
6. **Protected Route** - Middleware checks session for protected routes

## 🛣️ Routes

### Public Routes
- `/` - Home page
- `/auth/signin` - Sign in page
- `/auth/signup` - Sign up page

### Protected Routes
- `/dashboard` - User dashboard (requires authentication)

## 🔒 Middleware Protection

The middleware in `middleware.ts` protects routes:

```typescript
const protectedRoutes = ["/dashboard"];
```

Add more routes by adding them to this array.

## 📦 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:push      # Push database schema
npm run db:migrate   # Create migration
npm run db:studio    # Open Prisma Studio
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Update OAuth callback URLs to your production URL
5. Deploy!

### Other Platforms

For Railway, Netlify, or other platforms:

1. Update `NEXTAUTH_URL` to your production URL
2. Update OAuth callback URLs in each provider's dashboard
3. Set up PostgreSQL database on the platform
4. Add all environment variables
5. Deploy!

## 🧪 Testing

Test the authentication flow:

1. Visit `http://localhost:3000`
2. Click "Sign In"
3. Choose a provider (Google, GitHub, or LinkedIn)
4. Authorize the application
5. You should be redirected to `/dashboard`
6. Click "Sign Out" to log out

## 🔧 Customization

### Add More Providers

Edit `lib/auth.ts`:

```typescript
import Provider from "next-auth/providers/provider";

providers: [
  // ... existing providers
  Provider({
    clientId: process.env.PROVIDER_CLIENT_ID,
    clientSecret: process.env.PROVIDER_CLIENT_SECRET,
  }),
],
```

### Modify User Data

Update the `callbacks.jwt` and `callbacks.session` in `lib/auth.ts` to store/retrieve additional user data.

### Change Database

To use MySQL, MongoDB, or other databases:

1. Update `prisma/schema.prisma` datasource
2. Adjust the schema if needed
3. Run `npm run db:push`

## 🐛 Troubleshooting

### "Provider not configured"
- Check environment variables are set correctly
- Ensure `NEXTAUTH_URL` matches your current URL
- Verify OAuth credentials are correct

### "Session not working"
- Clear browser cookies
- Check `NEXTAUTH_SECRET` is set
- Verify database connection

### "Redirect loop"
- Check middleware configuration
- Ensure session is properly created
- Verify redirect URLs in providers

### "Database connection failed"
- Check `DATABASE_URL` format
- Ensure database is running
- Verify credentials are correct

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Auth.js Documentation](https://authjs.dev/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## 📄 License

This project is open source and available for commercial use.

## ✨ Notes for Production

Before deploying to production:

1. ✅ Set strong `NEXTAUTH_SECRET`
2. ✅ Use managed database service (Railway, Supabase, etc.)
3. ✅ Enable HTTPS
4. ✅ Set proper CORS and security headers
5. ✅ Monitor and log authentication events
6. ✅ Implement rate limiting
7. ✅ Add email verification if needed
8. ✅ Implement refresh token rotation
9. ✅ Add audit logging for security events
10. ✅ Use environment-specific configurations

---

Built with Next.js 16, React 19, Auth.js, Prisma, and Tailwind CSS.
