# TAPAR.AZ

Modern AI-powered Azerbaijani marketplace — React + TypeScript + Vite + Tailwind + Ant Design,
backed entirely by the **Firebase Client SDK** (Auth, Firestore, Storage, Realtime Database).
No Admin SDK, no Cloud Functions, no custom Node backend.

## Stack

- **Frontend:** React 18 + TypeScript, Vite, Tailwind CSS, Ant Design
- **Backend:** Firebase Client SDK only — Auth, Firestore, Storage, Realtime Database
- **Routing:** React Router DOM
- **State:** React hooks + Context only (no Redux/Zustand/MobX/Jotai/Recoil/Valtio)
- **AI:** Gemini 3.6 (called directly from the browser for this MVP — see security note below)

## 1. Install

```bash
npm install
```

## 2. Configure environment

Copy `.env.example` to `.env` and fill in your Firebase project's web config
(Project Settings → General → Your apps → SDK setup) plus a Gemini API key:

```bash
cp .env.example .env
```

You need a Firebase project with **Authentication** (Email/Password + Google),
**Firestore**, **Storage**, and **Realtime Database** all enabled.

## 3. Deploy security rules

```bash
npm install -g firebase-tools
firebase login
firebase use --add   # select your project
firebase deploy --only firestore:rules,storage:rules,database:rules,firestore:indexes
```

Rules live in `firebase-rules/` and are wired up via `firebase.json`:
- `firestore.rules` — listing/rating/favorite/profile ownership
- `storage.rules` — media upload ownership, type, and size validation
- `database.rules.json` — presence tracking (no user identity ever written)

## 4. Run locally

```bash
npm run dev
```

## 5. Build for production

```bash
npm run build
npm run preview
```

## Project structure

```
src/
  components/     Reusable UI (DynamicForm, ListingCard, MediaUploader, ...)
  config/         categories.ts — the config-driven category/field schemas
  context/        AuthContext, ThemeContext
  firebase/       Client SDK initialization only
  hooks/          useListings, useFavorites, useRating, usePresence,
                  useAIListing, useStorageUpload
  pages/          Route-level pages (Home, Listings, ListingDetail,
                  CreateListing, AIListing, Profile, auth/*, ...)
  types/          Shared TypeScript types
  utils/          conditionalFields.ts (form engine), gemini.ts (AI provider), format.ts
```

## Dynamic category form engine

Adding a new category or field requires **no new components** — only an entry
in `src/config/categories.ts`. Each field is a `FieldSchema` with a `type`,
optional `options`, and an optional `showIf` condition for conditional
visibility (e.g. "show battery capacity only if fuel === electric"). The
`<DynamicForm/>` component and `visibleFields()` engine in
`utils/conditionalFields.ts` handle rendering and pruning stale hidden values
automatically.

## AI listing assistant (Gemini 3.6) — production security note

`src/utils/gemini.ts` is the **only** file that talks to the AI provider. For
this MVP it calls the Gemini API directly from the browser using
`VITE_GEMINI_API_KEY`, which is acceptable for local development but **not**
recommended for production, since any public build exposes that key. Before
shipping:

1. Restrict the key in Google Cloud Console to your domain, **or**
2. Proxy the request through a small endpoint you control (Cloud Run, Vercel
   function, etc.), gated by Firebase App Check, and point `GEMINI_ENDPOINT`
   in `gemini.ts` at that proxy instead.

The AI never writes to Firestore directly and never auto-publishes — it only
returns a draft that the user reviews and edits in `CreateListing.tsx` before
publishing.

## Firestore data model

All listings live in a single `listings` collection with universal fields
(`title`, `price`, `city`, `address`, `description`, `media`, ...) plus a
flexible `attributes` map holding category-specific data keyed by field name
from `categories.ts`. This means adding a category never requires a schema
migration.

## What's implemented vs. what to extend

Fully implemented: auth (email/password + Google), theming, the dynamic form
engine with 6 categories (vacancies as a first-class fully-specified category
per the PRD, plus cars, real estate, services, electronics, home & garden),
Firestore-backed listings/favorites/ratings, Realtime Database presence with
heartbeat + stale-session handling, Storage media upload with progress/type/size
validation, the Gemini-powered AI assistant flow, and all routes from the PRD's
routing table.

Left as straightforward extension points (kept out of this MVP to stay
maintainable): in-app messaging between buyer/seller (contact buttons are
wired up as UI stubs), phone number reveal backed by real data, and category
field sets for electronics/home & garden are intentionally smaller than
cars/real estate/vacancies — extend `categories.ts` the same way to add more
fields, they render automatically.
## Admin təsdiqi və email

Yeni elanlar əvvəlcə `pending` statusu ilə yaradılır və `/admin/elanlar` səhifəsində görünür. Admin hesabının Firebase Authentication custom claim-i belə olmalıdır:

```json
{ "admin": true }
```

Admin girişində Firebase custom claim istifadə olunmur. Hesabın admin olub-olmaması həmişə `tapar_admins` kolleksiyasındakı aktiv sənədlə yoxlanılır. Demo hesab: `demo.admin@tapar.az` / `TaparDemo123!`. Email yalnız server-side Brevo SMTP function ilə göndərilir; SMTP parolu frontend-ə ötürülmür.

Email API lokalda `http://localhost:3000/api/email-smtp/email-send` endpoint-i ilə test edilir. Production-da frontend build zamanı `VITE_EMAIL_API_URL` dəyərini real email API endpoint-inə dəyişin.

### Brevo SMTP

Email serverinin Brevo SMTP ilə işləməsi üçün SMTP məlumatlarını həmin API serverinin environment variables hissəsində saxlayın. Frontend yalnız JSON email body-si göndərir; SMTP password frontend `.env`-də istifadə olunmur.
