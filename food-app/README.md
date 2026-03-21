# FoodDash — Food Ordering App

A full-stack food ordering/delivery app with a **Next.js web app** and **Expo mobile app** sharing a common backend and TypeScript types.

## Prerequisites

Install these before starting:

1. **Node.js** (v18 or later) — https://nodejs.org
2. **Expo CLI** (for mobile) — installed automatically via npm

---

## Getting Started

### 1. Install dependencies

Open a terminal in the `food-app/` folder:

```bash
npm install
```

This installs dependencies for all workspaces (root, web, mobile, shared).

### 2. Run the Web App

```bash
npm run dev:web
```

Visit **http://localhost:3000**

**Demo login:**
- Email: `demo@example.com`
- Password: `password123`

### 3. Run the Mobile App

In a second terminal:

```bash
npm run dev:mobile
```

Scan the QR code with **Expo Go** (download from App Store / Google Play).

> **Important for mobile:** The mobile app needs to reach the Next.js backend over the network.
> Find your computer's local IP (run `ipconfig` on Windows) and set:
>
> ```bash
> # apps/mobile/.env.local
> EXPO_PUBLIC_API_URL=http://192.168.x.x:3000
> ```

---

## Project Structure

```
food-app/
├── apps/
│   ├── web/          # Next.js 14 web app (also serves the backend API)
│   └── mobile/       # Expo React Native app
└── packages/
    └── shared/       # Shared TypeScript types and API client
```

---

## Features

- 🏠 **Browse restaurants** — search by name, filter by cuisine
- 🍕 **View menus** — category tabs, item descriptions, prices
- 🛒 **Shopping cart** — add/remove items, quantity controls
- 🔐 **Authentication** — sign up / log in with email
- 📦 **Order placement** — checkout with mock delivery address
- 📡 **Live order tracking** — real-time status updates (placed → preparing → out for delivery → delivered)

---

## Architecture

- **Backend**: Next.js API routes at `/api/*` — all data is in-memory (mock)
- **Auth**: JWT tokens (7-day expiry), stored in `localStorage` (web) or `AsyncStorage` (mobile)
- **State**: React Context + useReducer — no external state library
- **Styling**: Tailwind CSS (web) · NativeWind (mobile)
- **Order tracking**: Time-based simulation — status auto-advances every ~30s after ordering

---

## Development Notes

### Environment variables

**`apps/web/.env.local`** (already created):
```
JWT_SECRET=food-app-dev-secret-change-in-production
```

**`apps/mobile/.env.local`** (create if needed):
```
EXPO_PUBLIC_API_URL=http://192.168.x.x:3000
```

### Adding real persistence

The mock data lives in `apps/web/src/data/`. To add a real database:
1. Replace the in-memory arrays with database calls
2. Use Prisma + PostgreSQL or SQLite for easy integration with Next.js
