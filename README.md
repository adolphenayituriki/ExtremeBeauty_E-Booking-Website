# Extreme Beauty Lashes & Brows

Modern website for Extreme Beauty Lashes & Brows — professional beauty services in Nyarutarama, Kigali.

## Tech Stack

- **Frontend**: React 18, React Router v6, React Icons, React Toastify
- **Backend**: Node.js, Express 4, Mongoose 8
- **Database**: MongoDB Atlas
- **Styling**: Custom CSS (Black & White theme with gold accents)
- **Fonts**: Playfair Display (headings), Open Sans (body)

## Setup

### 1. Install Dependencies

```bash
npm run install-all
```

### 2. Configure Environment

Edit `backend/.env` with your MongoDB connection string:

```
PORT=5000
MONGODB_URI=mongodb://<host>:<port>/<dbname>?authSource=admin
```

### 3. Run Development

```bash
npm run dev
```

This starts both:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

### 4. Production Build

```bash
cd frontend && npm run build
```

## Project Structure

```
Extreme-website/
├── frontend/                # React frontend
│   ├── public/
│   │   ├── images/          # 26 images (hero, services, categories)
│   │   ├── videos/          # 13 MP4 videos
│   │   └── logo/            # Logo variants (white, black, transparent)
│   └── src/
│       ├── components/      # Navbar, Footer
│       ├── pages/           # Home, Services, About, Booking, Contact, Tracking
│       └── styles/          # App.css
├── backend/                 # Express API
│   ├── config/              # MongoDB connection
│   ├── controllers/         # Route handlers
│   ├── models/              # Mongoose schemas (Booking, Contact)
│   ├── routes/              # API routes
│   └── uploads/             # File uploads
├── MEDIA.md                 # Media asset guidelines
├── PROJECT_OVERVIEW.md      # Full project documentation
└── README.md
```

## Pages

| Page        | Route        | Features                                              |
|-------------|-------------|-------------------------------------------------------|
| Home        | `/`          | Hero slideshow, categories, carousel, featured, videos |
| Services    | `/services`  | Full service listing with images & descriptions        |
| About       | `/about`     | Studio story, mission, feature grid                    |
| Booking     | `/booking`   | Booking form, confirmation overview, receipt download  |
| Contact     | `/contact`   | Contact form, info, Google Maps embed                  |
| Tracking    | `/tracking`  | Track appointment status by booking reference          |

## Admin Panel

A protected admin dashboard is available at `/admin` for managing bookings, messages, services, and site content.

### First-time setup (create an admin account)

The admin registration endpoint is only accessible to create the first admin. Start the backend, then create an account:

```bash
curl -X POST http://localhost:5000/api/admin/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Your Name","email":"admin@extremebeauty.rw","password":"yourpassword"}'
```

> **Important**: For security, delete or restrict the `.env` `JWT_SECRET` and change the default admin password after setup. The registration endpoint currently has no gate, so keep it protected in production.

Then visit `http://localhost:3000/admin/login` to sign in.

### Admin routes

| Route                | Description                            |
|----------------------|----------------------------------------|
| `/admin/login`       | Admin sign-in screen                   |
| `/admin`             | Dashboard with stats & recent activity |
| `/admin/bookings`    | View, update status, delete bookings   |
| `/admin/contacts`    | Messages inbox                         |
| `/admin/services`    | Add/edit/delete services & prices      |
| `/admin/content`     | Edit site info, homepage, gallery      |

### Admin API endpoints

| Method   | Endpoint            | Description                        |
|----------|---------------------|------------------------------------|
| `POST`   | `/api/admin/register`| Create an admin account           |
| `POST`   | `/api/admin/login`   | Sign in, returns JWT token        |
| `GET`    | `/api/admin/me`      | Get current admin (auth)          |
| `PUT`    | `/api/admin/me`      | Update admin profile/password     |
| `GET`    | `/api/stats`         | Dashboard statistics (auth)       |
| `GET/POST/PUT/DELETE` | `/api/services` | Service CRUD (write requires auth) |
| `GET/PUT/DELETE` | `/api/content`   | Dynamic site content (write auth) |

## API Endpoints

### Bookings
- `GET    /api/bookings`          — List all bookings
- `GET    /api/bookings/track/:ref` — Track by reference code
- `GET    /api/bookings/:id`      — Get single booking
- `POST   /api/bookings`          — Create booking (auto-generates ref)
- `PUT    /api/bookings/:id`      — Update booking
- `DELETE /api/bookings/:id`      — Delete booking

### Contacts
- `GET    /api/contacts`          — List all messages
- `POST   /api/contacts`          — Send message
- `DELETE /api/contacts/:id`      — Delete message

## Services

1. **Brows**: Microblading, Microshading, Hybrid/Combination, Lamination
2. **Lash Lift**
3. **Eyelash Extensions**: Classic, Hybrid, Volume, Mega Volume, Wispy, Removal
4. **Eyebrows Retouch**

## Business Info

- **Location**: 105 KG 9th Ave, Nyarutarama, Kigali
- **Phone**: +250 785 069 349 / +250 787 035 643
- **Instagram**: @extreme_beauty.rw
- **Map**: [Google Maps](https://maps.app.goo.gl/JVeG4xNRdoP4Dt4dA)
