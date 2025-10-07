# 🚀 Quick Start Guide

Get your Village Homestay website running in 5 minutes!

## Prerequisites
- Node.js 18+ installed
- PostgreSQL installed and running

## Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Database
```bash
# Connect to PostgreSQL
psql -U postgres

# In psql:
CREATE DATABASE village_homestay;
\q
```

### 3. Configure Environment
```bash
# Copy example env file
cp .env.example .env

# Edit .env and set your DATABASE_URL:
# DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/village_homestay"
```

Generate a secret for NextAuth:
```bash
openssl rand -base64 32
```
Copy the output to `NEXTAUTH_SECRET` in your `.env` file.

### 4. Setup Database
```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with sample data (optional)
npm run db:seed
```

### 5. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## That's It!

You now have a fully functional website with:
- ✅ Homepage with featured content
- ✅ Homestay listings and detail pages
- ✅ Attractions and culinary pages
- ✅ Blog system
- ✅ Contact form
- ✅ Sample data in database

## Next Steps

1. **Explore the site** at http://localhost:3000
2. **View database** with `npm run db:studio`
3. **Read documentation** in `SETUP.md` and `README.md`
4. **Check project status** in `PROJECT_SUMMARY.md`

## Useful Commands

```bash
npm run dev          # Start dev server
npm run db:studio    # Open database GUI
npm run lint         # Check code quality
npm run build        # Build for production
```

## Need Help?

- Check `SETUP.md` for detailed instructions
- Review `PROJECT_SUMMARY.md` for what's been built
- Read the code comments for implementation details

Happy coding! 🎨
