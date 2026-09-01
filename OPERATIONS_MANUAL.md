# Extreme Beauty Lashes & Brows — Operations Manual

A complete guide to the Extreme Beauty Lashes & Brows booking website. This
manual covers the public (customer-facing) site, the booking flow, appointment
tracking, and the protected admin panel used by the team to manage bookings,
messages, services, content, and staff.

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Public Website (Visitors)](#2-public-website-visitors)
3. [Making a Booking (Customer)](#3-making-a-booking-customer)
4. [Tracking an Appointment (Customer)](#4-tracking-an-appointment-customer)
5. [Contacting the Salon](#5-contacting-the-salon)
6. [Admin Panel Overview](#6-admin-panel-overview)
7. [Logging In (2-Factor Authentication)](#7-logging-in-2-factor-authentication)
8. [Dashboard](#8-dashboard)
9. [Managing Bookings](#9-managing-bookings)
10. [Managing Messages (Contacts)](#10-managing-messages-contacts)
11. [Managing Services & Prices](#11-managing-services-prices)
12. [Editing Site Content](#12-editing-site-content)
13. [Managing the Team (Superadmin only)](#13-managing-the-team-superadmin-only)
14. [Changing Your Password](#14-changing-your-password)
15. [Automatic Emails](#15-automatic-emails)
16. [Appendices](#16-appendices)

---

## 1. System Overview

The website lets customers browse services, book appointments online, and track
their appointment status. The salon team manages everything from a private admin
panel.

| Area | URL | Who uses it |
|------|-----|-------------|
| Public website | `/` (home) | Everyone |
| Services page | `/services` | Everyone |
| Booking page | `/booking` | Customers |
| Tracking page | `/tracking` | Customers |
| Contact page | `/contact` | Everyone |
| Teaching page | `/teaching` | Everyone |
| Admin login | `/admin/login` | Team only |
| Admin panel | `/admin` | Team only |

**Deployed locations**

- Frontend (public site): Vercel
- Backend API: Render (`https://extremebeauty-e-booking-website.onrender.com`)
- Database: MongoDB Atlas (cloud)

---

## 2. Public Website (Visitors)

### 2.1 Home Page (`/`)
The homepage is built from dynamic content that the team manages in the admin
panel (see [Editing Site Content](#12-editing-site-content)). It includes:

- **Hero slideshow** — rotating images/videos with a headline and subtitle.
- **Hero stats** — e.g. happy clients, services, rating.
- **Service categories** — cards for Brows, Lash Lift, Eyelash Extensions, Retouch.
- **Featured treatments** — handpicked popular services with "Book Now".
- **Teaching preview** — "how we create your look" steps.
- **Photo gallery carousel** — scrolling images (pauses on hover).
- **Video reel** — autoplaying service demonstration clips.
- **Call-to-action** — prompt to book an appointment.

### 2.2 Services Page (`/services`)
- Lists all services grouped by category (Brows, Lash Lift, Eyelash Extensions, Retouch).
- **Search box** filters services by name.
- **Category filter** narrows the list.
- Each service shows an image, description, price, and a **Book Now** button.
- Clicking **Book Now** opens the booking page with that service pre-selected.

### 2.3 About Page (`/about`)
Static page: studio story, mission, and feature highlights (expert technicians,
premium products, hygienic studio, personalized care) with a visit CTA.

### 2.4 Teaching Page (`/teaching`)
Presents the "Teaching Service" academy: a 6-step process (Consultation → Design
& Mapping → Preparation → Application → Refinement → Aftercare & Guidance) with a
CTA that books a "Training Session".

### 2.5 Contact Page (`/contact`)
- Contact info cards: location, phone numbers, WhatsApp, email, working hours.
- Embedded Google Map.
- **Contact form** (name, email, phone, subject, message) that sends a message to
  the salon's admin inbox.
- Contact details (address, phones, email, hours, map link) are editable from the
  admin panel under **Site Content → Site Info**.

---

## 3. Making a Booking (Customer)

The booking page is a **3-step wizard** shown on `localhost:3000/booking` in
development or the live site in production.

**Step 1 — Choose Your Service**

- Use the category tabs to filter (All, Brows, Lash Lift, Eyelash Extensions,
  Retouch, Training).
- Click a service card to select it and move to the next step.
- If the customer arrived via a "Book Now" button, the service is pre-selected
  and the wizard starts at Step 2.

**Step 2 — Your Details**

- First name (required), Last name (required)
- Email (required, must be valid)
- Phone (required)
- Preferred date (required; minimum is the next day)
- Preferred time (required; 30-minute slots from 09:00 to 17:30)
- Additional notes (optional)
- A sticky "Booking Summary" shows the chosen service, price, date, and time with
  a link back to "Change service".

**Step 3 — Confirmation**

- On submit, the system creates the booking (status **Approved**), auto-generates
  a unique **booking reference** (e.g. `EB-A1B2C3`), and e-mails a confirmation
  to the customer (if an email was provided) plus a notification to the salon.
- The confirmation screen shows:
  - "Thank You" with the booking reference.
  - A service summary card (image, category, name, price, "Approved" badge).
  - Appointment details (date, time, client, phone, email, notes).
  - **Download Receipt** — generates a printable receipt as **PDF** or **image
    (PNG)** using the salon logo, address, receipt number, service details, fees,
    and the tracking reference.
  - Buttons: **Track Your Booking**, **Home**, **Services**.

---

## 4. Tracking an Appointment (Customer)

Use the tracking page (`/tracking`) to check appointment status. Two methods:

1. **Booking Ref** — enter the reference code (auto-uppercased, e.g.
   `EB-A1B2C3`).
2. **Phone Number** — enter the phone used when booking; all bookings for that
   number are shown.

The card displays:

- Reference + **status badge**: Pending (amber), Approved (green), Confirmed
  (green), Cancelled (red), Completed (indigo).
- A **progress timeline** (Pending → Approved → Completed). "Confirmed" maps to
  the Approved step; "Cancelled" shows as a red terminal node.
- Client name, date, time, and service.
- Actions: **Book New** and **Contact Us**.

If multiple bookings are found for a phone number, all are listed.

---

## 5. Contacting the Salon

Customers can reach the salon through:

- **Contact form** on the contact page (creates a message in the admin inbox).
- **Phone / WhatsApp** numbers shown in the navbar, footer, and contact page.
- **Email**, **Instagram**, and the **Google Maps** link.

---

## 6. Admin Panel Overview

The admin panel is private and requires login. It lives under `/admin`.

| Section | Route | Purpose |
|---------|-------|---------|
| Dashboard | `/admin` | Statistics, recent bookings & messages, quick actions |
| Bookings | `/admin/bookings` | View, search, filter, update status, export, delete bookings |
| Messages | `/admin/contacts` | View, search, reply to, export, delete contact messages |
| Services & Prices | `/admin/services` | Create / edit / delete services, set prices, feature & hide |
| Site Content | `/admin/content` | Edit homepage content, site info, gallery, featured items |
| Team | `/admin/admins` | Manage staff accounts & activity log (**superadmin only**) |

The sidebar always shows Dashboard, Bookings, Messages, Services & Prices, and
Site Content. **Team** is only visible to a superadmin (the owner). A
**notification bell** shows recent new bookings and messages.

---

## 7. Logging In (2-Factor Authentication)

Login is a **two-step process** for security:

1. Go to `/admin/login`.
2. Enter your **email** and **password**, then click **Send Code**.
3. A **6-digit one-time code** is emailed to you (valid for **3 minutes**).
4. Enter the code and click **Verify** to sign in.

If the code expires, click **Resend** to get a new one.

> Keep your email inbox accessible when logging in — you cannot sign in without
> the one-time code.

The link back to the public website is available on the login page. After login
you land on the **Dashboard**.

---

## 8. Dashboard

The dashboard shows at-a-glance stats and recent activity:

- **Stat cards**: Total Bookings, Pending/Approved, Completed, Cancelled,
  Messages, Services.
- **Recent Bookings** (latest 5) — click one to open the booking detail modal
  where you can change its status or delete it.
- **Recent Messages** (latest 5) — click one to view and reply.

---

## 9. Managing Bookings

Open **Bookings** in the sidebar.

### Features

- **Search** — by reference, name, email, phone, or service.
- **Status filter** — All / Pending / Approved / Confirmed / Cancelled /
  Completed, each with a count.
- **Refresh** — reload the list.
- **Export to CSV** — downloads the currently-filtered bookings as
  `bookings-{filter}-{date}.csv`.
- **Change status (inline)** — use the dropdown on each row to move a booking
  between statuses.
- **Detail view** — click a row to open a modal with full client info,
  appointment details, and notes. From here you can:
  - Update the status (Pending, Approved, Confirmed, Cancelled, Completed).
  - Delete the booking (with a confirmation prompt).

### Status meanings

| Status | Meaning |
|--------|---------|
| Approved | Booking accepted (also the default when a booking is created) |
| Pending | Awaiting decision |
| Confirmed | Confirmed with the client |
| Cancelled | Not going ahead |
| Completed | Service delivered |

> When a booking status changes, an **email is sent automatically** to the
> customer (if they provided an email) and to the salon. See
> [Automatic Emails](#15-automatic-emails).

---

## 10. Managing Messages (Contacts)

Open **Messages** in the sidebar.

### Features

- **Search** — by name, email, subject, message, or phone.
- **Refresh** and **Export CSV**.
- **Mark as replied** — messages that have been replied show a gold check.
- **Detail view** — click a row to see the sender's info, subject, message, and
  reply history. From here you can:
  - **Reply** — compose a subject (pre-filled `Re: …`) and message; this
    **e-mails the customer** and records the reply.
  - **Delete** the message (with confirmation).

---

## 11. Managing Services & Prices

Open **Services & Prices** in the sidebar.

### Features

- **Search** by name.
- **Filters**: category (Brows, Lash Lift, Lashes, Retouch, Training), status
  (Active / Hidden / Featured), and **Sort** (order, name, price asc/desc,
  category, featured first). Clear filters to reset.
- **Create / Edit service** — modal with fields:
  - **Name** (required)
  - **Price (RWF)** (required, numeric)
  - **Price display** (optional custom text, e.g. "On Request")
  - **Category** (dropdown)
  - **Order** (number — controls sorting)
  - **Image** — upload a file (JPG/PNG/GIF/WebP/AVIF, max 5 MB) or paste a URL
  - **Description**
  - **Active** check-box (hide/show on public site)
  - **Featured** check-box (flag as featured; shows a star icon)
- **Featured toggle** and **Active/Hidden toggle** directly in the table.
- **Detail view** — click a row to see price, category, status, order, and
  description with edit/delete actions.
- **Image upload** — uploaded images are compressed (max 1600px) and stored
  directly in the database as a data URL. This makes them **persistent** (they
  survive backend redeploys and restarts) and host-independent. The stored
  image can be previewed from the edit form or removed with the **Remove** link.

> Only **Active** services appear in the public services list and booking
> service picker.

---

## 12. Editing Site Content

Open **Site Content** in the sidebar. It has three tabs:

### Live Content

Lets you edit the homepage sections live. Each section has its own **Save**
button and changes take effect immediately on the public homepage.

- **Hero Stats** — value + label pairs (e.g. `2000+` / `Happy Clients`). Add and
  remove pairs.
- **Hero Slides** — slideshow entries: type (image/video), media URL, title,
  subtitle. Add and remove.
- **Service Categories** — image URL, name, category, description.
- **Featured Services** — image URL, title, category (`BROWS` / `LASHES` /
  `OTHER`), description.
- **Featured Videos** — video URL + poster URL.

> Important: these values are stored in the database. Even if values look
> correct in the code, the **database values** are what visitors see. Use the
> admin panel to change homepage content, not the code.

### Site Info

Edit business details shown site-wide: business name, phone 1, WhatsApp/phone 2,
email, Instagram, address, working hours, and the Google Maps URL. Save to
update the navbar, footer, and contact page.

### Gallery / Media

Edit the list of gallery image URLs shown in the homepage carousel. Add, remove,
and reorder entries by index. Save to apply.

---

## 13. Managing the Team (Superadmin only)

Open **Team** in the sidebar (visible only to a superadmin/owner). It has two
tabs:

### Team / Members

- **List** of admin users with name, email, role badge (**Owner** = superadmin,
  **Manager** = admin), and last login.
- **Add Manager** — name, email, temporary password.
- **Edit Manager** — update name, email, or assign a new password.
- **Remove Manager** — with confirmation. The owner/superadmin account is
  **protected** and cannot be removed or edited by a regular manager.

### Activity Log

An audit trail showing what each admin did: created / updated / deleted /
replied, with the entity type and affected name/ref/status. Use this to review
actions taken in the system.

---

## 14. Changing Your Password

Use the **Change Password** option (in the sidebar/layout). It is a two-step
process:

1. Enter your **current password** → the system e-mails a one-time code.
2. Enter the **code** and the **new password** (min 6 characters) → confirm.

Your login will then use the new password on the next 2-factor sign-in.

---

## 15. Automatic Emails

The system sends e-mails automatically through the configured email provider
(Brevo, Resend, Gmail, or a custom SMTP). If no provider is configured, emails
are logged to the server console instead of being sent.

| Email | Triggered when | Recipient |
|-------|----------------|-----------|
| Booking Confirmed | A new booking is created (customer provided email) | Customer |
| Booking status update | An admin changes a booking status (anything except Approved) | Customer + salon |
| New Booking Received | A new booking is created | Salon admin |
| OTP (login) | Admin 2-factor login / password change | Admin's email |
| Reply | An admin replies to a contact message | The person who contacted the salon |

E-mailed booking confirmations include the service, price, date, time, phone,
and a **"Track My Booking"** button linking to the tracking page.

---

## 16. Appendices

### A. Service & Price List (13 services)

| Service | Price (RWF) | Category |
|---------|-------------|----------|
| Microblading Eyebrows | 100,000 | Brows |
| Ombré, microshading | 100,000 | Brows |
| Hybrid / Combination Brows | 100,000 | Brows |
| Brows Lamination | 30,000 | Brows |
| Lash Lift | 30,000 | Lash Lift |
| Classic Set | 45,000 | Lashes |
| Hybrid Set | 50,000 | Lashes |
| Volume Set | 55,000 | Lashes |
| Mega Volume Set | 60,000 | Lashes |
| Wispy Sets | 45,000 – 60,000 | Lashes |
| Lash Removal | 5,000 | Lashes |
| Eyebrows Retouch | 60,000 | Retouch |
| Training Session | On Request | Training |

> Prices shown are the default/seed values for reference. The live prices are
> managed in **Services & Prices** and may differ.

### B. Booking Statuses

`Pending` · `Approved` · `Confirmed` · `Cancelled` · `Completed`

### C. Admin Roles

- **Superadmin (Owner)** — full access including the Team section (manage staff
  and view activity log).
- **Admin (Manager)** — dashboard, bookings, messages, services, and site
  content; cannot manage other staff.

### D. Contact Details

- **Location**: 105 KG 9th Ave, Nyarutarama, Kigali, Rwanda
- **Phone**: +250 785 069 349 / +250 787 035 643
- **Instagram**: @extreme_beauty.rw

### E. Website Domain & SEO (Vercel + Google)

The public site is deployed on **Vercel** and the API on **Render**.

**Domain setup**

- `extremebeautyrw.com` is registered through Vercel and **redirects** to
  `www.extremebeautyrw.com`.
- `www.extremebeautyrw.com` connects directly to the Vercel project and is the
  single canonical host for the site.
- SSL certificates are managed automatically by Vercel (auto-renew).
- DNS / nameservers: managed by Vercel (`ns1.vercel-dns.com`,
  `ns2.vercel-dns.com`).

**SEO assets already in place (code)**

- `google-site-verification` meta tag and TXT record for Google Search Console.
- Open Graph meta tags + JSON-LD `BeautySalon` schema in `index.html`.
- `sitemap.xml` — lists all 7 public pages under
  `https://www.extremebeautyrw.com/`.
- `robots.txt` — points search engines to the sitemap.
- Site URLs (`canonical`, schema, receipt, booking emails, "View Site" link)
  all use `https://www.extremebeautyrw.com`.

**Google Search Console — recommended steps**

1. Verify the site using the **domain method** or the **`www` property**
   (`www.extremebeautyrw.com`), since the bare domain redirects to `www`.
2. Submit the sitemap. Because the bare domain redirects, use the **full URL**
   `https://www.extremebeautyrw.com/sitemap.xml` (entering only `sitemap.xml`
   can return "Invalid sitemap address").
3. Allow a few days for Google to crawl and index the pages.

**Deployment notes**

- Frontend (Vercel): builds automatically on push to `master`. The latest
  domain/SEO changes appear after the build finishes.
- Backend (Render): runs the API only. It will serve the built frontend
  **only if** `frontend/build/index.html` exists; in this split setup it is
  absent, so static serving is skipped (this avoids noisy error logs).

---

*Manual compiled for Extreme Beauty Lashes & Brows — Nyarutarama, Kigali.*
