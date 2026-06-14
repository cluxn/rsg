# RSG Profile Manufacturing — Website & Admin Panel

## Local Dev

```bash
cp .env.example .env        # fill in DB credentials
npm install                 # installs concurrently at root
cd frontend && npm install
cd backend && npm install
cd admin && npm install
npm run dev                 # starts all three: :3000, :4000, :5173
```

## Ports

- **Frontend** (Next.js): http://localhost:3000
- **Backend** (Express): http://localhost:4000
- **Admin** (Vite): http://localhost:5173

## Stack

- **Frontend**: Next.js 16, React 19, Tailwind v4
- **Backend**: Express 5, TypeScript, MySQL 2
- **Admin**: React 19, Vite, Tailwind v4

## DB Setup

```bash
cd backend
cp .env.example .env        # fill in DB credentials
npm run migrate             # creates all 9 tables
npm run seed                # seeds admin user + products + settings
```
