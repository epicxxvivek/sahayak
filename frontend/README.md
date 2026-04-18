# Sahayak Frontend

A premium, responsive frontend for the **Sahayak** local service marketplace platform.

## 📁 Structure

```
frontend/
├── index.html          ← Landing page
├── login.html          ← Login
├── signup.html         ← 3-step signup (role → details → provider extras)
├── search.html         ← Browse & filter providers
├── profile.html        ← Provider public profile
├── dashboard.html      ← Customer/Provider dashboard
├── booking.html        ← Booking detail + chat
├── edit-profile.html   ← Provider profile editor
│
├── css/
│   ├── variables.css   ← Design tokens (colors, fonts, spacing)
│   ├── global.css      ← Reset, typography, buttons, cards, utilities
│   ├── navbar.css      ← Shared sticky navbar
│   ├── home.css        ← Landing page
│   ├── auth.css        ← Login & Signup
│   ├── search.css      ← Search & filters
│   ├── profile.css     ← Provider profile
│   ├── dashboard.css   ← Dashboard
│   └── booking.css     ← Booking + chat
│
└── js/
    ├── api.js          ← Fetch wrapper + JWT auth headers
    ├── auth.js         ← Login/signup logic
    ├── search.js       ← Filter, sort, paginate providers
    ├── profile.js      ← Provider data rendering
    ├── dashboard.js    ← Dashboard data & auth-aware UI
    └── booking.js      ← Booking actions + message polling
```

## 🚀 Running Locally

Open directly in browser (no server needed):

```bash
# Windows
start frontend/index.html

# Mac/Linux
open frontend/index.html
```

Or serve with a simple HTTP server:

```bash
cd frontend
npx serve .
# OR
python -m http.server 3000
```

Then visit: `http://localhost:3000`

## 🔗 Connecting to Backend

All API calls are routed through `js/api.js`. Change the base URL:

```js
// js/api.js — line 6
const API_BASE = 'http://localhost:5000/api'; // ← your backend URL
```

Currently all data is **mocked** — mock data is in `js/search.js` (MOCK_PROVIDERS array) and inline in HTML files. Once the backend API is ready, replace mock calls with `await Api.get(...)`.

## 🎨 Design System

| Token | Value |
|---|---|
| Background | `#080D1A` (deep navy) |
| Accent | `#F59E0B` (amber) |
| Font | Inter + Plus Jakarta Sans |
| Cards | Glassmorphism (`rgba(255,255,255,0.04)` + `backdrop-filter:blur`) |
| Radius | 6px / 12px / 18px / 24px |

## 📦 Pages Summary

| Page | Features |
|---|---|
| `index.html` | Hero + animated card, category grid, how-it-works, featured providers, CTA, footer |
| `login.html` | Split-panel, email/password form, password toggle, Google OAuth stub |
| `signup.html` | 3-step wizard: role picker → details + password strength → provider extras |
| `search.html` | Filter sidebar, keyword+location search, grid/list view toggle, pagination |
| `profile.html` | Cover, skills, rating bars, reviews, pricing + availability sidebar |
| `dashboard.html` | Stats cards, bookings table with status badges, message previews |
| `booking.html` | Timeline, booking parties, chat panel with offer bubbles, star review |
| `edit-profile.html` | 4 tabs: Personal, Services/Skills, Pricing preview, Schedule/availability |
