# BusyBee Backend

Task manager application backend built with NestJS and Prisma.

## Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL (Neon hosted)
- **ORM**: Prisma
- **Runtime**: Node.js

## Database Schema

### Models

**Project**
- Organize tasks into projects (Personal, Work, Shopping, etc.)
- Custom colors and icons for each project

**Task**
- Title, description, priority (LOW/MEDIUM/HIGH)
- Due dates and tags
- Completion tracking
- Linked to a project

## Setup

### Prerequisites

- Node.js installed
- Neon PostgreSQL database (or any PostgreSQL instance)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
   - `.env` file already configured with Neon PostgreSQL connection
   - Update `DATABASE_URL` if needed

3. Run database migrations:
```bash
npx prisma migrate dev
```

4. Seed the database with sample data:
```bash
npx prisma db seed
```

## Development

### Run the application

```bash
nx serve busybee-be
```

### Build the application

```bash
nx build busybee-be
```

### Database Commands

**Generate Prisma Client:**
```bash
npx prisma generate
```

**Create a new migration:**
```bash
npx prisma migrate dev --name migration_name
```

**Reset database (⚠️ deletes all data):**
```bash
npx prisma migrate reset
```

**Seed database:**
```bash
npx prisma db seed
```

**Open Prisma Studio (database GUI):**
```bash
npx prisma studio
```

## Project Structure

```
apps/busybee-be/
├── prisma/
│   ├── schema.prisma       # Database schema
│   ├── seed.ts            # Seed data
│   └── migrations/        # Database migrations
├── src/
│   └── generated/prisma/  # Generated Prisma Client
├── .env                   # Environment variables
└── prisma.config.ts       # Prisma configuration
```

## Seed Data

The seed file creates:
- 3 projects (Personal, Work, Shopping)
- 12 sample tasks with varying priorities, due dates, and tags
- Mix of completed and pending tasks

Perfect for testing and development!
