# Concealed App Frontend - Documentation

## Overview

A multi-step form application for concealed carry permit pre-qualification. Built with **React 18** and **Vite 5**, it collects user eligibility data, payment information, and upsell/downsell preferences, then submits everything to an external API.

There is **no backend server**. All API communication is handled through a Vite dev server proxy that forwards requests to the external API at `pb.adunbox.com`.

---

## Tech Stack

| Layer       | Technology              |
|-------------|-------------------------|
| Framework   | React 18.2              |
| Build Tool  | Vite 5.0                |
| Styling     | Component-scoped CSS    |
| State       | React Context API       |
| API Proxy   | Vite custom middleware  |
| Mid-pages   | Static HTML (jQuery)    |

---

## Project Structure

```
Concealed_App_FrontEnd/
├── src/
│   ├── main.jsx                    # App entry point
│   ├── App.jsx                     # Root component, step routing
│   ├── api.js                      # API payload mapping & submission
│   ├── context/
│   │   └── FormContext.jsx         # Global form state (React Context)
│   ├── screens/
│   │   ├── Screen1.jsx             # Zip code input
│   │   ├── Screen2.jsx             # Success message
│   │   ├── Screen3.jsx             # Question 1
│   │   ├── Screen4.jsx             # Question 2
│   │   ├── Screen5.jsx             # Question 3
│   │   ├── Screen6.jsx             # Question 4
│   │   ├── Screen7.jsx             # Question 5
│   │   ├── Screen8.jsx             # Final question
│   │   ├── Screen9.jsx             # Eligibility result / discount
│   │   ├── Screen10.jsx            # Payment form & order
│   │   ├── QuestionScreen.jsx      # Reusable True/False question
│   │   ├── ContactPage.jsx         # Contact overlay
│   │   ├── FAQPage.jsx             # FAQ overlay
│   │   ├── StateAcceptancePage.jsx # State acceptance overlay
│   │   ├── TermsPage.jsx           # Terms overlay
│   │   └── PrivacyPage.jsx         # Privacy overlay
│   ├── components/
│   │   ├── Header.jsx              # Header with progress bar
│   │   └── Footer.jsx              # Footer with nav links
│   └── assets/                     # Images (logo, permit card, etc.)
├── Pages/
│   ├── flow.js                     # Upsell/downsell funnel controller
│   ├── scr1/index.html             # Upsell 1 page ($97 offer)
│   ├── scr2/index.html             # Upsell 2 page ($67 offer)
│   ├── scr3/index.html             # Downsell page ($47 offer)
│   └── scr4/index.html             # Thank You page
├── vite.config.js                  # Vite config with API proxy & mid-page server
├── .env                            # Environment variables
├── package.json
└── index.html                      # HTML shell
```

---

## User Flow

The application is a linear funnel split into two phases:

### Phase 1: React SPA (Screens 1-10)

```
Screen 1  ─►  Screen 2  ─►  Screens 3-7  ─►  Screen 8  ─►  Screen 9  ─►  Screen 10
(Zip Code)   (Success)     (Questions 1-5)   (Final Q)    (Discount)    (Payment)
```

| Screen | Purpose | Data Collected |
|--------|---------|----------------|
| 1 | Zip code entry | `zipCode` |
| 2 | Success message | (none) |
| 3-7 | Eligibility questions (True/False) | `question1` through `question5` |
| 8 | Final eligibility question | `finalQuestion` |
| 9 | Success + discount offer | `successContinue`, `successProceedNow` |
| 10 | Payment form + order bumps | `email`, `paymentMethod`, `cardNumber`, `expirationDate`, `securityCode`, `cardholderName`, `country`, `postalCode`, `upsellInstant`, `upsellAdditionalStates`, `termsAccepted` |

When the user clicks **"Order Now"** on Screen 10, the form data is saved to `sessionStorage` (key: `concealedFormData`) and the browser navigates to the upsell funnel.

### Phase 2: Static Mid-Pages (Upsell/Downsell Funnel)

```
scr1 (Upsell 1)
  ├── Yes ($97) ──► scr2 (Upsell 2)
  └── No ──────────► scr3 (Downsell)
                        ├── Yes ($47) ──► scr2
                        └── No ─────────► scr2

scr2 (Upsell 2)
  ├── Yes ($67) ──► scr4 (Thank You)
  └── No ──────────► scr4 (Thank You)
```

| Page | Purpose | Data Stored |
|------|---------|-------------|
| scr1 | Upsell 1 ($97 Concealed Carry Mastery + Bonus) | `upsell1` (true/false) |
| scr3 | Downsell ($47 Concealed Carry Mastery, no bonus) | `downsell1` (true/false) |
| scr2 | Upsell 2 ($67 Firearm First Aid Training) | `upsell2` (true/false) |
| scr4 | Thank You + order summary | Submits all data to API |

Each Yes/No choice is stored in `sessionStorage` (key: `concealedUpsellData`) by `Pages/flow.js`.

### Final Submission

When scr4 (Thank You page) loads, `flow.js` performs the final API submission:

1. Reads the main form data from `sessionStorage` (`concealedFormData`)
2. Reads upsell/downsell choices from `sessionStorage` (`concealedUpsellData`)
3. Maps all camelCase field names to the snake_case API format
4. POSTs the combined payload to `/api/submit`
5. On success, clears both sessionStorage keys

---

## Data Flow Architecture

```
React Form State (FormContext)
        │
        ▼  [Order Now clicked]
sessionStorage: concealedFormData
        │
        ▼  [User navigates through scr1/scr2/scr3]
sessionStorage: concealedUpsellData
        │
        ▼  [scr4 loads]
flow.js merges both ──► POST /api/submit
        │
        ▼  [Vite proxy middleware]
External API: https://pb.adunbox.com/adu-reports/external/concealed-users
```

---

## API Details

### External API

- **Base URL:** `https://pb.adunbox.com/adu-reports/external/concealed-users`
- **Auth Header:** `authentication_code: jhbizzqiej12c120@$1nddh1`

#### Insert Data (POST)

```
POST https://pb.adunbox.com/adu-reports/external/concealed-users
Header: authentication_code: jhbizzqiej12c120@$1nddh1
Header: Content-Type: application/json
```

#### List Data (GET)

```
GET https://pb.adunbox.com/adu-reports/external/concealed-users?page=1&limit=20
Header: authentication_code: jhbizzqiej12c120@$1nddh1
```

### API Proxy (Vite Middleware)

The browser cannot call the external API directly due to CORS restrictions. A custom Vite plugin (`apiProxy` in `vite.config.js`) intercepts `POST /api/submit` requests and forwards them server-side using Node.js `https.request`. The proxy injects the `authentication_code` header automatically, keeping the auth credential out of the browser.

### Field Name Mapping

The frontend uses camelCase internally; the API uses snake_case.

| Frontend (camelCase) | API (snake_case) |
|----------------------|------------------|
| `zipCode` | `zip_code` |
| `question1`-`question6` | `question1`-`question6` |
| `finalQuestion` | `final_question` |
| `successContinue` | `success_continue` |
| `successProceedNow` | `success_proceed_now` |
| `email` | `email` |
| `paymentMethod` | `payment_method` |
| `cardNumber` | `card_number` |
| `expirationDate` | `expiration_date` |
| `securityCode` | `security_code` |
| `cardholderName` | `cardholder_name` |
| `country` | `country` |
| `postalCode` | `postal_code` |
| `upsellInstant` | `order_bump_instant_access` |
| `upsellAdditionalStates` | `order_bump_additional_states` |
| `termsAccepted` | `terms_accepted` |
| (from flow.js) | `upsell1` |
| (from flow.js) | `downsell1` |
| (from flow.js) | `upsell2` |
| (auto-detected) | `user_agent` |
| (empty string) | `ip` |
| (hardcoded: 10) | `current_step` |

---

## Key Files Explained

### `src/context/FormContext.jsx`

Provides global form state via React Context. Exposes:

- **`form`** - Current form values object
- **`update(key, value)`** - Update a single field
- **`getFormJson()`** - Returns a snapshot of all form values
- **`submitForm()`** - Calls the API submission function (available but not used in the current flow since submission happens from scr4)

### `src/api.js`

Contains the `submitForm(formData)` function that maps camelCase form data to the snake_case API payload and POSTs to `/api/submit`. This function is available for direct use but the current flow delegates submission to `flow.js` on the thank-you page.

### `Pages/flow.js`

Controls the upsell/downsell funnel across the static HTML mid-pages:

- Intercepts Yes/No button clicks on scr1, scr2, scr3
- Stores upsell/downsell choices in `sessionStorage`
- Tracks selected products for the order summary
- On scr4 (Thank You): merges form data + upsell data and submits to the API
- Renders order summary with mandatory + selected products and total price

### `vite.config.js`

Two custom Vite plugins:

1. **`apiProxy()`** - Intercepts `POST /api/submit`, forwards to the external API with the auth header injected server-side
2. **`serveMidPages()`** - Serves static files from `Pages/` under the `/midpages/` URL path

---

## sessionStorage Keys

| Key | Set By | Read By | Content |
|-----|--------|---------|---------|
| `concealedFormData` | Screen10.jsx | flow.js (scr4) | JSON of all form fields |
| `concealedUpsellData` | flow.js (scr1/scr2/scr3) | flow.js (scr4) | `{ upsell1, downsell1, upsell2 }` |
| `flowOrderProducts` | flow.js (scr1/scr2/scr3) | flow.js (scr4) | Array of selected product objects for order summary |

---

## Running the Project

### Prerequisites

- Node.js 18+
- npm

### Development

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`. The Vite dev server handles both the React SPA and the API proxy.

### Production Build

```bash
npm run build
```

Output goes to `dist/`. Note: the production build only includes the React SPA. The `Pages/` directory (mid-pages) and the API proxy must be handled separately in production (e.g., via a reverse proxy like Nginx or a serverless function).

### Preview Build

```bash
npm run preview
```

---

## Environment Variables

Defined in `.env` at the project root:

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | External API endpoint URL |
| `VITE_API_AUTH_CODE` | Authentication code for the API |

These are prefixed with `VITE_` so Vite exposes them to the browser. However, in the current architecture the auth code is only used in the server-side proxy (`vite.config.js`) and never sent to the browser.

---

## Production Deployment Notes

The Vite dev server proxy (`/api/submit`) does not exist in the production build. For production, you need one of:

1. **Reverse proxy** (Nginx, Cloudflare Workers, etc.) that forwards `/api/submit` to `pb.adunbox.com` with the auth header
2. **Serverless function** (Vercel API route, AWS Lambda, etc.) that does the same
3. **The external API enables CORS** for your production domain, in which case the frontend can call it directly (but the auth code would be exposed in the browser)

Option 1 or 2 is recommended to keep the auth credentials server-side.
