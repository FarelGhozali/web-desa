# Setup Guide - Village Homestay Website

This guide will walk you through setting up the project from scratch.

## Prerequisites

Before you begin, ensure you have:
- **Node.js 18+** installed ([download here](https://nodejs.org/))
- **PostgreSQL** installed and running ([download here](https://www.postgresql.org/download/))
- A code editor (VS Code recommended)
- Terminal/Command Prompt access

## Step-by-Step Setup

### 1. Database Setup

First, create a PostgreSQL database:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create the database
CREATE DATABASE village_homestay;

# Exit psql
\q
```

### 2. Environment Configuration

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and update with your actual values:
   ```env
   DATABASE_URL="postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/village_homestay?schema=public"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="generate-a-secret-key-here"
   ```

   To generate a secure `NEXTAUTH_SECRET`, run:
   ```bash
   openssl rand -base64 32
   ```

### 3. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js, React, TypeScript
- Prisma (database ORM)
- Tailwind CSS
- NextAuth.js
- And other dependencies

### 4. Set Up Prisma

1. Generate the Prisma Client:
   ```bash
   npm run db:generate
   ```

2. Push the schema to your database:
   ```bash
   npm run db:push
   ```

3. (Optional) Seed the database with sample data:
   ```bash
   npm run db:seed
   ```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the website!

## Project Structure Overview

```
web-desa/
├── src/
│   ├── app/                    # Next.js pages (App Router)
│   │   ├── homestays/          # Homestay pages
│   │   ├── attractions/        # Attraction pages
│   │   ├── culinary/           # Culinary pages
│   │   ├── blog/               # Blog pages
│   │   ├── api/                # API routes
│   │   └── layout.tsx          # Root layout
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   └── layout/             # Header & Footer
│   └── lib/
│       ├── prisma.ts           # Prisma client
│       └── utils.ts            # Utility functions
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.ts                 # Database seeding script
└── public/                     # Static assets
```

## Useful Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:push` | Push schema to database |
| `npm run db:studio` | Open Prisma Studio (database GUI) |
| `npm run db:seed` | Seed database with sample data |

## Database Management with Prisma Studio

Prisma Studio is a visual database browser. To open it:

```bash
npm run db:studio
```

This will open a browser window where you can:
- View all your data
- Add, edit, and delete records
- Test relationships between tables

## Next Steps

Now that your project is set up, here are some recommended next steps:

1. **Explore the Pages**: Visit different pages to see the structure
2. **Check the Database**: Use Prisma Studio to see the seeded data
3. **Review the Code**: Look at the component files in `/src/components/ui`
4. **Customize Content**: Update text, colors, and branding to match your village
5. **Add Real Images**: Replace placeholder images with actual photos
6. **Implement Authentication**: Set up NextAuth.js for user login
7. **Add Booking Logic**: Implement the booking system with validation
8. **Deploy**: Deploy to Vercel or your preferred hosting platform

## Common Issues & Solutions

### Issue: Database connection failed
**Solution**: Check that PostgreSQL is running and your DATABASE_URL is correct in `.env`

### Issue: Prisma Client not found
**Solution**: Run `npm run db:generate`

### Issue: Port 3000 already in use
**Solution**: Either stop the other process or run on a different port:
```bash
npm run dev -- -p 3001
```

### Issue: Type errors in TypeScript
**Solution**: Make sure all dependencies are installed (`npm install`) and restart your editor

## Getting Help

- Check the [Next.js Documentation](https://nextjs.org/docs)
- Review [Prisma Documentation](https://www.prisma.io/docs)
- Look at the [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- Read the project's `README.md` for more information

## Development Tips

1. **Use TypeScript**: Always define types for your data
2. **Follow the conventions**: Check `.github/copilot-instructions.md`
3. **Keep components small**: Break down complex UIs into smaller pieces
4. **Use Tailwind utilities**: Avoid custom CSS when possible
5. **Server Components by default**: Only use 'use client' when needed

Happy coding! 🚀
