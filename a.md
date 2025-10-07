# Project Brief: Village Homestay Reservation & Tourism Portal Website

## 1. Project Summary
Create a complete website using Next.js and Tailwind CSS. The primary goal of this website is to serve as a reservation platform for homestays in a specific village. However, to support this main goal and win at SEO, the website must also function as a rich content portal about the village, covering its natural beauty, local cuisine, and blog articles.

## 2. Technology Stack
- **Framework:** Next.js (using App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** NextAuth.js
- **State Management (if needed):** Zustand

## 3. Core Features
Please generate the initial file structure and boilerplate components for the following features:

### a. Homestay Reservation Module:
- **Homestay List Page:** Displays all available homestays in a card-based layout, showing a photo, name, price per night, and a short rating.
- **Homestay Detail Page:** A dynamic `[slug]` page showing a photo gallery, full description, amenities, a map, user reviews, and an availability calendar.
- **Booking System:** A form to select check-in and check-out dates, number of guests, and a "Book Now" button. The booking process must be integrated with user accounts.
- **User Dashboard:** A page where users can view their reservation history (upcoming, completed, canceled).

### b. Content & SEO Module:
- **"Natural Attractions" Page:** A gallery or list of tourist spots in the village. Each item should be clickable, leading to its own detail page.
- **"Local Cuisine" Page:** Similar to the attractions page, but for showcasing local food or restaurants.
- **Blog System:**
    - A main blog page listing the latest articles.
    - A dynamic `[slug]` article page with a clean, readable layout, images, and SEO-friendly URLs.
    - A system for Categories and Tags for the articles.

### c. General Pages:
- **Homepage:** An engaging landing page that highlights featured homestays, the latest blog posts, and snippets of attractions/cuisine. It must have a clear Call to Action (CTA) to browse the homestays.
- **"About the Village" Page:** A brief description of the village's history and unique characteristics.
- **Contact Page:** A simple contact form and contact information.

## 4. Database Structure (Prisma Models)
Please generate an initial Prisma schema (`schema.prisma`) with the following models:

- `User`: (id, name, email, password, image, role - USER/ADMIN)
- `Homestay`: (id, name, slug, description, address, pricePerNight, maxGuests, photos, amenities)
- `Booking`: (id, checkInDate, checkOutDate, totalPrice, status - PENDING/CONFIRMED/CANCELLED, userId, homestayId)
- `Review`: (id, rating, comment, userId, homestayId)
- `Post` (for Blog): (id, title, slug, content, published, authorId, categoryId)
- `Category`: (id, name, slug)
- `Attraction` (for Natural Attractions): (id, name, slug, description, photos, location)
- `Culinary` (for Cuisine): (id, name, slug, description, photos, location)

## 5. Initial Tasks
Based on the brief above, please perform the following:
1.  Create the initial folder and file structure for a Next.js project with the App Router.
2.  Initialize Prisma and create the `schema.prisma` file with the models I described.
3.  Create basic, reusable UI components using Tailwind CSS in a `/components/ui` folder (e.g., `Button.tsx`, `Card.tsx`, `Input.tsx`).
4.  Set up the page structure inside the `/app` directory according to the requested features.