# CampusVault (Metro Archive)

A university resource hub for students. Notes, past question papers, and faculty reviews, all in one place.

Web course project, built by a team of three.

## What's in it

- **Auth**: register / login with your university ID (`222-222-222` format), JWT session cookie
- **Faculty**: browse, search, view profiles, upvote (one vote per user)
- **Admin**: add, edit, delete faculty
- **Dashboard**: logged-in area (stats are placeholder data for now)
- **Dark / light mode**
- **Archives** and **Question Bank**: pages exist, content coming soon

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4
- MongoDB + Mongoose
- Zod for validation
- jose (JWT) + bcryptjs (passwords)
- lucide-react icons, next-themes

## Run it

```bash
npm install
npm run dev
```

Create `.env.local`:

```
MONGODB_URI=your_mongodb_connection_string
SESSION_SECRET=at_least_32_random_characters
```

Open http://localhost:3000. To check the DB connection, hit `/api/test-db`.

## Folder map

```
app/
  (public)/       public pages: home, faculty, archives, question bank, auth
  (dashboard)/    logged-in dashboard
  api/            REST routes (auth, faculty, test-db)
  Components/     UI components
actions/          server actions (auth, faculty, dashboard)
lib/              db connection, session helpers, zod schemas
models/           Mongoose models (User, Faculty, FacultyVote, ...)
```

## API

| Route | Method | Access |
|---|---|---|
| `/api/auth/register` | POST | public |
| `/api/auth/login` | POST | public |
| `/api/auth/logout` | POST | public |
| `/api/auth/me` | GET | logged in |
| `/api/faculty` | GET | public |
| `/api/faculty` | POST | admin |
| `/api/faculty/[id]` | GET | public |
| `/api/faculty/[id]` | PATCH, DELETE | admin |

All responses look like `{ success, message, data? }`.

## Branches

- `main`: stable
- `dev`: where the work gets merged
- personal branches: `fahim`, `fahiyan`