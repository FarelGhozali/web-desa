# GitHub Copilot Guidelines - Village Tourism Website Project

## Project Context & Goal
This project is a homestay reservation website powered by content marketing (blog, attractions, cuisine) to maximize SEO. The goal is to attract visitors through informative content and convert them into homestay bookers.

## Rules & Coding Conventions

### 1. Language & Framework
- Always use **TypeScript**. Enforce type safety everywhere, including component props, state, and API responses.
- Use the **Next.js App Router**. All new pages must be created within the `/app` directory.
- Default to **Server Components**. Only use the `'use client'` directive if a component truly requires client-side interactivity (e.g., uses hooks like `useState` or `useEffect`).

### 2. Styling
- Use **Tailwind CSS** for all styling. Avoid writing custom CSS or inline styles whenever possible.
- Create reusable UI components in `/components/ui`. Examples: `Button.tsx`, `Card.tsx`, `Modal.tsx`.
- The design must be **mobile-first**. Start with styles for small screens, then add breakpoints for larger screens.

### 3. Components
- Break down the UI into small, logical components.
- Component filenames must use **PascalCase** (e.g., `HomestayCard.tsx`).
- Always define component `props` with a TypeScript `interface` or `type`.

### 4. Database Interaction
- Use **Prisma Client** for all database operations (CRUD).
- Do not write raw SQL queries.
- All database interaction logic should be placed in files within the `/lib` directory or directly inside API Route Handlers.

### 5. API & Server-side Logic
- Create API endpoints using **Route Handlers** inside `/app/api`.
- Follow **RESTful conventions** for endpoint naming (e.g., `GET /api/homestays`, `POST /api/bookings`).
- Always validate input data (e.g., using Zod) before processing requests in the API.

### 6. SEO
- Every page must have unique and relevant metadata (`title` and `description`). Use the `metadata` export feature from `page.tsx` in Next.js.
- Use semantic HTML tags (`<article>`, `<section>`, `<nav>`, etc.).
- Ensure URL slugs for homestays, blog posts, and attractions are generated from their titles and are SEO-friendly (lowercase, dash-separated).

### Desired Folder Structure Example:

├── app/
│   ├── api/
│   ├── (main)/
│   │   ├── homestays/
│   │   │   ├── [slug]/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── blog/
│   │   └── page.tsx
│   └── layout.tsx
├── components/
│   ├── ui/ (Button, Card, Input, etc.)
│   └── (feature-specific components)
├── lib/
│   ├── prisma.ts
│   ├── utils.ts
├── prisma/
│   └── schema.prisma
└── ... (other config files)