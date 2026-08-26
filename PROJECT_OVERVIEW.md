# Extreme Beauty Lashes & Brows — Project Overview

## 1. Executive Summary

**Extreme Beauty Lashes & Brows** is a full-stack website for a professional beauty salon based in Nyarutarama, Kigali, Rwanda. The website provides an elegant, modern online presence with an integrated booking system, service showcase, appointment tracking, and client communication tools.

| Field             | Details                                      |
|-------------------|----------------------------------------------|
| **Business**      | Extreme Beauty Lashes & Brows                 |
| **Location**      | 105 KG 9th Ave, Nyarutarama, Kigali          |
| **Phone**         | +250 785 069 349 / +250 787 035 643         |
| **Instagram**     | @extreme_beauty.rw                           |
| **Website**       | Black & white luxury theme, gold accents     |
| **Google Maps**   | [View Location](https://maps.app.goo.gl/JVeG4xNRdoP4Dt4dA) |

---

## 2. Tech Stack

| Layer          | Technology                                                              |
|----------------|-------------------------------------------------------------------------|
| **Frontend**   | React 18, React Router v6, React Icons, React Toastify                 |
| **Backend**    | Node.js, Express 4, Mongoose 8, Multer, Nodemailer, Dotenv            |
| **Database**   | MongoDB Atlas (cloud-hosted NoSQL)                                      |
| **Styling**    | Custom CSS — black & white theme, Playfair Display + Open Sans fonts   |
| **Dev Tools**  | Concurrently, Nodemon, ESLint                                          |

---

## 3. Project Structure

```
Extreme-website/
├── package.json                    # Root scripts (dev, install-all)
├── README.md                       # Getting started guide
├── MEDIA.md                        # Media asset guidelines
├── PROJECT_OVERVIEW.md             # This file
│
├── frontend/                       # React application
│   ├── package.json                # React dependencies
│   ├── public/
│   │   ├── index.html              # HTML shell (Google Fonts)
│   │   ├── images/                 # 26 images (hero backgrounds, service photos)
│   │   ├── videos/                 # 13 MP4 video files
│   │   └── logo/                   # 3 logo variants (white, black, transparent)
│   └── src/
│       ├── App.js                  # Router + ToastContainer setup
│       ├── index.js                # React entry point
│       ├── components/
│       │   ├── Navbar.js           # Fixed top nav, mobile hamburger, logo
│       │   └── Footer.js           # 4-column footer, social links
│       ├── pages/
│       │   ├── Home.js             # Hero slideshow, categories, carousel, featured, videos, CTA
│       │   ├── Services.js         # Full service listing with images & descriptions
│       │   ├── About.js            # Studio info, mission, features grid
│       │   ├── Booking.js          # Booking form → confirmation overview → receipt download
│       │   ├── Contact.js          # Contact form + Google Maps embed
│       │   └── Tracking.js         # Appointment tracking by booking reference
│       └── styles/
│           └── App.css             # All styles (~1600+ lines, custom CSS)
│
├── backend/                        # Express API
│   ├── package.json                # Backend dependencies
│   ├── .env                        # MongoDB connection string, secrets
│   ├── server.js                   # Express app, CORS, routes, static files
│   ├── config/
│   │   └── db.js                   # Mongoose connection (timeout, no-exit on fail)
│   ├── models/
│   │   ├── Booking.js              # Booking schema (12 services, status, bookingRef)
│   │   └── Contact.js              # Contact message schema
│   ├── controllers/
│   │   ├── bookingController.js    # CRUD + track-by-reference
│   │   └── contactController.js    # CRUD for contact messages
│   ├── routes/
│   │   ├── bookings.js             # /api/bookings/*
│   │   └── contacts.js             # /api/contacts/*
│   ├── middleware/                  # Custom middleware (reserved)
│   └── uploads/                    # File upload storage (reserved)
```

---

## 4. Pages & Features

### 4.1 Home Page (`/`)
- **Hero Section**: Full-viewport slideshow with 4 background images, Ken Burns zoom + crossfade transitions, word-by-word title animation, stats (500+ clients, 12+ services, 5-star rating), slide counter, navigation dots
- **Categories**: 4 category cards (Brows, Lash Lift, Eyelash Extensions, Eyebrows Retouch) with hover zoom + overlay animations
- **Image Carousel**: Auto-scrolling horizontal gallery of 13 service images, pause-on-hover, arrow navigation, dot indicators
- **Featured Services**: 6-card grid of most popular treatments with image hover zoom, top border reveal, book-now links
- **Video Section**: 3 video cards with muted autoplay, play controls, hover scale
- **CTA**: Book appointment call-to-action

### 4.2 Services Page (`/services`)
- Full listing of all 12 services organized by category
- Each service shows image, description, and "Book Now" button
- Categories: Brows (4), Lash Lift (1), Eyelash Extensions (6), Retouch (1)

### 4.3 About Page (`/about`)
- Studio story and mission statement
- Image with decorative border animation
- 4-feature grid: Precision Artistry, Premium Products, Expert Technicians, Hygiene First

### 4.4 Booking Page (`/booking`)
- **Form**: First/Last name, email, phone, service dropdown (12 options grouped by category), date picker, time picker (9:00–17:30 in 30-min slots), optional notes
- **Confirmation Screen** (post-submission):
  - Green checkmark animation
  - Unique booking reference code (e.g. `EB-A1B2C3`)
  - Full booking overview grid (client, email, phone, date, time, service, notes)
  - Status badge (pending/confirmed/cancelled/completed)
  - **Download Receipt** button (generates formatted .txt receipt file)
  - **Track Booking** link to tracking page
  - Navigation links (Home, Services, Contact)

### 4.5 Contact Page (`/contact`)
- **Contact Info**: Location, phone numbers, email, working hours (Mon–Sat 9AM–6PM)
- **Contact Form**: Name, email, phone, subject, message
- **Google Maps Embed**: Embedded iframe showing salon location
- **Open in Google Maps** button linking to the provided maps URL

### 4.6 Tracking Page (`/tracking`)
- **Search**: Input field for booking reference code (auto-uppercase)
- **Timeline**: Visual step indicator (Pending → Confirmed → Completed) with current status highlighted
- **Details Grid**: Client name, date, time, service
- **Location**: Salon address + "View on Map" link
- **Actions**: Book New Appointment, Contact Us

---

## 5. API Endpoints

### Bookings

| Method   | Endpoint                  | Description                        |
|----------|---------------------------|------------------------------------|
| `GET`    | `/api/bookings`           | List all bookings (newest first)   |
| `GET`    | `/api/bookings/:id`       | Get booking by MongoDB ID          |
| `GET`    | `/api/bookings/track/:ref`| Track booking by reference code    |
| `POST`   | `/api/bookings`           | Create booking (auto-generates ref)|
| `PUT`    | `/api/bookings/:id`       | Update booking (status, details)   |
| `DELETE` | `/api/bookings/:id`       | Delete booking                     |

### Contacts

| Method   | Endpoint             | Description                    |
|----------|----------------------|--------------------------------|
| `GET`    | `/api/contacts`      | List all contact messages      |
| `POST`   | `/api/contacts`      | Submit a contact message       |
| `DELETE` | `/api/contacts/:id`  | Delete a contact message       |

### Health Check

| Method   | Endpoint        | Description          |
|----------|-----------------|----------------------|
| `GET`    | `/api/health`   | API status check     |

---

## 6. Data Models

### Booking

| Field         | Type     | Details                                         |
|---------------|----------|-------------------------------------------------|
| `bookingRef`  | String   | Auto-generated (e.g. `EB-A1B2C3`), unique       |
| `firstName`   | String   | Required                                         |
| `lastName`    | String   | Required                                         |
| `email`       | String   | Required, validated format                       |
| `phone`       | String   | Required                                         |
| `service`     | String   | Required, enum of 12 services                    |
| `date`        | Date     | Required                                         |
| `time`        | String   | Required                                         |
| `message`     | String   | Optional notes                                   |
| `status`      | String   | `pending` / `confirmed` / `cancelled` / `completed` |
| `createdAt`   | Date     | Auto-generated (timestamps)                      |
| `updatedAt`   | Date     | Auto-generated (timestamps)                      |

### Contact

| Field       | Type   | Details              |
|-------------|--------|----------------------|
| `name`      | String | Required             |
| `email`     | String | Required             |
| `phone`     | String | Optional             |
| `subject`   | String | Required             |
| `message`   | String | Required             |
| `createdAt` | Date   | Auto-generated       |

---

## 7. Services Menu

| Category              | Service                   |
|-----------------------|---------------------------|
| **Brows**             | Microblading Eyebrows     |
|                       | Microshading Eyebrows     |
|                       | Hybrid / Combination Brows|
|                       | Brows Lamination          |
| **Lashes**            | Lash Lift                 |
| **Eyelash Extensions**| Classic Set               |
|                       | Hybrid Set                |
|                       | Volume Set                |
|                       | Mega Volume Set           |
|                       | Wispy Sets                |
|                       | Lash Removal              |
| **Retouch**           | Eyebrows Retouch          |

---

## 8. Design System

### Color Palette

| Token           | Value     | Usage                          |
|-----------------|-----------|--------------------------------|
| `--black`       | `#000000` | Primary, navbar, buttons, text |
| `--white`       | `#ffffff` | Background, hero text, borders |
| `--gold`        | `#b8956a` | Accents, subtitles, highlights |
| `--gold-light`  | `#c9a96e` | Hover states, secondary gold   |
| `--gray-50`     | `#fafafa` | Light section backgrounds      |
| `--gray-100`    | `#f5f5f5` | Card backgrounds               |
| `--gray-200`    | `#e5e5e5` | Borders, dividers              |
| `--gray-400`    | `#a3a3a3` | Secondary text                 |
| `--gray-500`    | `#737373` | Body text                      |
| `--gray-600`    | `#525252` | Nav links                      |
| `--gray-700`    | `#404040` | Dark borders                   |
| `--gray-800`    | `#262626` | Hover states                   |
| `--gray-900`    | `#171717` | Video card backgrounds         |

### Typography

| Element         | Font                  | Weight     | Size         |
|-----------------|-----------------------|------------|--------------|
| Headings        | Playfair Display      | 600–700    | 1.3–4rem     |
| Body            | Open Sans             | 400–600    | 0.75–1.1rem  |
| Buttons         | Open Sans             | 600        | 0.75–0.85rem |
| Subtitles       | Open Sans             | 500        | 0.8rem       |

### Design Tokens

| Token          | Value                                  |
|----------------|----------------------------------------|
| `--transition` | `all 0.3s cubic-bezier(0.16, 1, 0.3, 1)` |
| `--shadow-sm`  | `0 1px 3px rgba(0,0,0,0.06)`          |
| `--shadow-md`  | `0 4px 20px rgba(0,0,0,0.08)`         |
| `--shadow-lg`  | `0 10px 40px rgba(0,0,0,0.12)`        |
| `--shadow-xl`  | `0 20px 60px rgba(0,0,0,0.15)`        |

---

## 9. Animations & Effects

| Effect                  | Location        | Details                                      |
|-------------------------|-----------------|----------------------------------------------|
| Hero crossfade          | Home hero       | Ken Burns zoom + fade between 4 images        |
| Hero word animation     | Home hero       | Each word staggers in with delay              |
| Section reveal          | All pages       | Fade-in-up on scroll                         |
| Card reveal             | Service cards   | Staggered fade-up with delay per card         |
| Category hover          | Category cards  | Image zoom + grayscale removal + overlay lift |
| Button shine            | Buttons         | Left-to-right light sweep on hover            |
| Top border reveal       | Service cards   | Gold gradient line scales from left on hover  |
| Footer transition       | Footer          | Fade-in with gold top border                  |
| Page header shine       | All sub-pages   | Horizontal light sweep animation              |
| Hero slide counter      | Home hero       | 01/04 counter with divider                   |
| Carousel auto-scroll    | Home gallery    | Horizontal translate with pause-on-hover      |
| Timeline steps          | Tracking page   | Active/inactive dots with connecting lines    |
| Confirmation icon       | Booking success | Green checkmark with scale animation          |

---

## 10. Media Assets

### Images (26 files in `frontend/public/images/`)

| File                           | Usage                        |
|--------------------------------|------------------------------|
| `Hero-bg-Image-1.jpg`         | Hero slideshow slide 1       |
| `Hero-bg-Image-2.jpg`         | Hero slideshow slide 2       |
| `Hero-bg-Image-3.jpg`         | Hero slideshow slide 3       |
| `Hero-bg-Image-4.jpg`         | Hero slideshow slide 4       |
| `IMG-20260826-WA0006.jpg`     | Brows category card          |
| `IMG-20260826-WA0007.jpg`     | Lash Lift category card      |
| `IMG-20260826-WA0008.jpg`     | Eyelash Extensions card      |
| `IMG-20260826-WA0009.jpg`     | Eyebrows Retouch card        |
| `IMG-20260826-WA0010.jpg`     | Microblading service card    |
| `IMG-20260826-WA0012.jpg`     | Volume Set service card      |
| `IMG-20260826-WA0013.jpg`     | Wispy Sets service card      |
| `IMG-20260826-WA0015.jpg`     | Brows Lamination card        |
| `IMG-20260826-WA0016.jpg`     | Lash Lift service card       |
| `IMG-20260826-WA0017.jpg`     | Microshading card            |
| `IMG-20260826-WA0018.jpg`     | Video 1 poster               |
| `IMG-20260826-WA0019.jpg`     | Video 2 poster               |
| `IMG-20260826-WA0021.jpg`     | Video 3 poster               |
| `IMG-20260826-WA0022-27,48`  | Carousel gallery images      |
| `IMG-20260826-WA0003,05`     | Services page images         |
| `Lash Lift.jpg`               | Services page detail         |

### Videos (13 files in `frontend/public/videos/`)
All `VID-20260826-WA*.mp4` — used as service demo clips and video showcase section.

### Logos (3 files in `frontend/public/logo/`)

| File                  | Usage                   |
|-----------------------|-------------------------|
| `White-Logo-1.jpg`   | Navbar, Footer          |
| `Black-Logo-1.jpg`   | Alternate/future use    |
| `Logo-White-BG.png`  | Transparent background  |

---

## 11. Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### Installation

```bash
# Clone repository
git clone <repo-url>
cd Extreme-website

# Install all dependencies (root + frontend + backend)
npm run install-all

# Configure environment
# Edit backend/.env with your MongoDB connection string

# Run in development mode
npm run dev
```

This starts:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`

### Environment Variables (`backend/.env`)

```
PORT=5000
MONGODB_URI=mongodb://<host>:<port>/<dbname>?authSource=admin
```

---

## 12. Known Issues & Notes

| Issue                              | Status     | Notes                                              |
|------------------------------------|------------|-----------------------------------------------------|
| MongoDB DNS SRV resolution         | Workaround | Use standard `mongodb://` connection string         |
| Map embed coordinates              | Placeholder | Update with exact coordinates from Google Maps     |
| No authentication system          | Future     | Admin panel for managing bookings                  |
| No email confirmation              | Future     | Nodemailer installed but not yet configured         |
| Mobile responsive                  | Complete    | Hamburger nav, stacked grids, compact forms        |

---

## 13. Future Enhancements

- [ ] Admin dashboard for booking management
- [ ] Email confirmation system (Nodemailer already installed)
- [ ] Payment integration (mobile money / card)
- [ ] Service pricing page
- [ ] Client reviews & testimonials
- [ ] Gallery page with filterable image grid
- [ ] SEO meta tags and Open Graph images
- [ ] PWA (Progressive Web App) support
- [ ] CMS integration for content management
- [ ] Analytics dashboard

---

*Project built for Extreme Beauty Lashes & Brows — Nyarutarama, Kigali, Rwanda*
