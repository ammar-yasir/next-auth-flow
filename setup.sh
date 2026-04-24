#!/bin/bash

# Quick Start Script for Auth.js SaaS Application
# This script helps set up the development environment

set -e

echo "🚀 Starting Auth.js SaaS Setup..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo "✅ Dependencies installed!"
echo ""

# Check for .env.local
if [ ! -f .env.local ]; then
    echo "📋 Creating .env.local from .env.example..."
    cp .env.example .env.local
    echo "✅ .env.local created!"
    echo ""
    echo "⚠️  IMPORTANT: Edit .env.local and add your OAuth credentials:"
    echo "   - GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET"
    echo "   - GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET"
    echo "   - LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET"
    echo "   - DATABASE_URL"
    echo "   - NEXTAUTH_SECRET (run: openssl rand -base64 32)"
else
    echo "✅ .env.local already exists"
fi

echo ""
echo "📖 Next steps:"
echo "   1. Edit .env.local with your OAuth credentials"
echo "   2. Run 'npm run db:push' to set up the database"
echo "   3. Run 'npm run dev' to start the development server"
echo "   4. Visit http://localhost:3000"
echo ""
echo "📚 For setup instructions, see SETUP.md"
