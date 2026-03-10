# 🐾 PawStay — Find Trusted Pet Sitters Near You

PawStay is a fully static, front-end web application that connects pet owners with verified local pet sitters and dog walkers. Users can browse sitter profiles, check real-time availability, calculate pricing, and confirm bookings — all without any backend or sign-up required.

---

## 📸 Pages

| Page | Description |
|------|-------------|
| `sitters.html` | Browse and filter verified pet sitter profiles |
| `Availability.html` | View a sitter's calendar, calculate price, and book a session |

---

## ✨ Features

- 🔍 **Browse & Filter Sitters** — Filter by pet type (Dog, Cat, Bird, Rabbit) and experience level (Beginner, Intermediate, Expert)
- 📅 **Interactive Availability Calendar** — Color-coded calendar showing available, limited, and booked dates
- 💰 **Dynamic Price Calculator** — Real-time pricing with holiday surcharges, multi-pet discounts, and bundle deals
- 📬 **Contact Modal** — Send a message directly to a sitter
- ✅ **Booking Confirmation** — Confirm bookings that are saved locally in the browser
- 📋 **My Bookings** — View and cancel your confirmed bookings
- 📱 **Fully Responsive** — Mobile-friendly layout with a hamburger navigation menu
- ♿ **Accessible** — ARIA labels, keyboard navigation, and semantic HTML throughout

---

## 💲 Pricing Logic

| Rule | Detail |
|------|--------|
| Base rate | Per sitter (₹999 – ₹1,849/hr) |
| Holiday surcharge | +25% on Dec 24, 25, 31 & Jan 1 |
| Multi-pet discount | -10% per additional pet |
| Walk + Feed bundle | -15% off total |

**Duration options:** 1 Hour, 2 Hours, Half Day (4 hrs), Full Day (8 hrs)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Markup | HTML5 |
| Styling | CSS3 with Custom Properties (variables) |
| Logic | Vanilla JavaScript (ES6+) |
| Fonts | Google Fonts — Nunito & DM Sans (CDN) |
| Icons | Font Awesome 6.5 (CDN) |
| Storage | Browser `localStorage` for booking persistence |
| Hosting | Any static file server or local browser |

> **No frameworks. No build tools. No dependencies to install.**

---

## 📁 Project Structure

```
pawstay/
├── sitters.html       # Sitter listing & filter page
├── Availability.html  # Calendar, booking & my bookings page
├── styles.css         # Shared stylesheet
└── app.js             # Shared JavaScript (both pages)
```

---

## 🚀 Getting Started

No installation needed. Just open the files in a browser.

**Option 1 — Open directly:**
```
Double-click sitters.html in your file explorer
```

**Option 2 — Serve locally (recommended to avoid CORS issues):**
```bash
# Using Python
python -m http.server 3000

# Using Node.js (npx)
npx serve .
```
Then visit `http://localhost:3000/sitters.html`

---

## 🗂️ Data

All sitter profiles and availability data are hardcoded in `app.js`. There is no backend or API — the app is entirely self-contained.

To add or edit sitters, update the `SITTERS` array in `app.js`:

```js
{
    id: 7,
    name: 'Your Name',
    initials: 'YN',
    color: '#hex',
    rating: 4.5,
    reviews: 10,
    rate: 1299,          // ₹ per hour
    pets: ['Dog', 'Cat'],
    fencedYard: true,
    experience: 'Intermediate',  // 'Beginner' | 'Intermediate' | 'Expert'
    services: ['Walking', 'Sitting', 'Feeding'],
    location: 'Austin, TX',
}
```

---

## 🌐 CDN Dependencies

These are loaded externally — no local installation required:

| Library | Purpose | CDN |
|---------|---------|-----|
| Font Awesome 6.5 | Icons | cdnjs.cloudflare.com |
| Google Fonts | Typography | fonts.googleapis.com |

---

## 🔮 Potential Improvements

- [ ] Backend integration (Node.js / Firebase) for real data persistence
- [ ] User authentication and sitter profiles
- [ ] Search by location with map integration
- [ ] SMS / email booking confirmation
- [ ] Admin dashboard for sitters to manage their calendar
- [ ] PWA support for offline access

---

---
By - Aryan Yadav 

<p align="center">Made with ❤️ for pet lovers 🐕🐈🐦🐇</p>
