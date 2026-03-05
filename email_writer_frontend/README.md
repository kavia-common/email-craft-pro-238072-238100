This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Pages implemented (Step 01.00)

- `/` Home
- `/auth` Login / Signup (client-side auth persistence)
- `/generator` Email Generator (REST call to backend)
- `/editor` Email Editor (copy/export; save requires login)
- `/history` Email History (list/delete; requires login)

## Environment

Create a `.env.local` based on `.env.example`:

- `NEXT_PUBLIC_API_BASE_URL` - Base URL of the FastAPI backend (no trailing slash)

Example:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open http://localhost:3000 with your browser to see the result.
