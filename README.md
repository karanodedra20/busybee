# Busybee 🐝

A modern, full-stack task management application built with Nx monorepo architecture.

## 📋 Overview

Busybee is a comprehensive task management system that helps you organize your work with projects, tags, and priorities. Built with cutting-edge technologies for both frontend and backend.

## 🚀 Tech Stack

### Frontend (busybee-fe)

- **Framework**: Angular 20 with Signals & Standalone Components
- **Authentication**: Firebase Authentication (@angular/fire)
- **Styling**: Tailwind CSS & DaisyUI
- **State Management**: Angular Signals
- **API Communication**: Apollo Client (GraphQL)
- **Calendar**: Cally Web Component

### Backend (busybee-be)

- **Framework**: NestJS
- **Authentication**: Firebase Admin SDK
- **API**: GraphQL with Apollo Server v4
- **Database ORM**: Prisma
- **Database**: PostgreSQL (Neon serverless)
- **Runtime**: Node.js

### Development Tools

- **Monorepo**: Nx
- **Language**: TypeScript
- **Testing**: Jest, Vitest & Playwright
- **Linting**: ESLint

## 🌐 Live Deployment

- **Frontend**: https://busybee.fly.dev
- **Backend API**: https://busybee-backend.fly.dev/graphql

The application is deployed using:

- **Frontend**: Fly.io (Docker with nginx)
- **Backend**: Fly.io (Docker with Node.js)
- **Database**: Neon (Serverless PostgreSQL)

## 🏃 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database (or Neon account)

### Installation

```sh
# Install dependencies
npm install

# Set up environment variables
cp apps/busybee-be/.env.example apps/busybee-be/.env
# Configure your DATABASE_URL in .env
```

### Firebase Authentication Setup

#### 1. Frontend Firebase Configuration

Firebase client-side configuration is stored directly in the environment files (`apps/busybee-fe/src/environments/`). This is safe because Firebase client config is not secret - it's exposed in every browser request. Security comes from Firebase Security Rules.

To use your own Firebase project, update the values in:
- `environment.ts` (development)
- `environment.prod.ts` (production)

#### 2. Backend Firebase Service Account

The backend requires a Firebase service account JSON file:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Navigate to Project Settings > Service Accounts
3. Click "Generate New Private Key"
4. Download the JSON file
5. Save it as `apps/busybee-be/firebase-service-account.json`

**Important:** This file is gitignored and should never be committed.

### Database Setup

```sh
# Run Prisma migrations
cd apps/busybee-be
npx prisma migrate dev

# Seed the database (optional)
npx prisma db seed
```

## 🚀 Running the Applications

### Development Mode

Run both frontend and backend concurrently:

```sh
# Start backend (GraphQL API)
npx nx serve busybee-be

# Start frontend (Angular app)
npx nx serve busybee-fe
```

The applications will be available at:

- Frontend: http://localhost:4200
- Backend API: http://localhost:3000/api
- GraphQL Playground: http://localhost:3000/graphql

### Build for Production

```sh
# Build backend
npx nx build busybee-be

# Build frontend
npx nx build busybee-fe
```

## 📁 Project Structure

```
busybee/
├── apps/
│   ├── busybee-fe/          # Angular frontend application
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── components/
│   │   │   │   ├── services/
│   │   │   │   └── models/
│   │   │   └── styles.scss
│   │   └── project.json
│   │
│   ├── busybee-be/          # NestJS backend application
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── tasks/
│   │   │   │   ├── projects/
│   │   │   │   └── prisma/
│   │   │   └── main.ts
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── migrations/
│   │   └── project.json
│   │
│   ├── busybee-fe-e2e/      # Frontend E2E tests
│   └── busybee-be-e2e/      # Backend E2E tests
│
└── packages/                 # Shared libraries (if any)
```

## ✨ Features

- **Firebase Authentication**: Email/Password & Google OAuth sign-in
- **Task Management**: Create, update, delete, and organize tasks
- **Project Organization**: Group tasks into projects with custom colors and icons
- **Tags System**: Flexible tagging for cross-project organization
- **Priority Levels**: High, Medium, Low priority classification
- **Due Dates**: Calendar integration with Cally web component
- **Search**: Find tasks quickly by title
- **Filtering**: Filter tasks by project, tags, priority, and completion status
- **GraphQL API**: Modern, efficient API with type safety
- **Protected Routes**: Auth guards for secure access
- **Responsive Design**: Mobile-friendly interface with DaisyUI components
- **Dark/Light Theme**: Toggle between themes

## 🧪 Testing

```sh
# Run unit tests
npx nx test busybee-fe
npx nx test busybee-be

# Run E2E tests
npx nx e2e busybee-fe-e2e
npx nx e2e busybee-be-e2e

# Run all tests
npx nx run-many --target=test
```

## 📊 Nx Commands

```sh
# View project graph
npx nx graph

# Run tasks for affected projects
npx nx affected --target=build

# Lint all projects
npx nx run-many --target=lint

# Format code
npx nx format:write
```

## 🗄️ Database Management

```sh
# Open Prisma Studio (database GUI)
cd apps/busybee-be
npx prisma studio

# Create new migration
npx prisma migrate dev --name migration_name

# Reset database
npx prisma migrate reset
```

## 🛠️ Development Tools

### Nx Console

Nx Console is an editor extension that enriches your developer experience. It lets you run tasks, generate code, and improves code autocompletion in your IDE.

[Install Nx Console for VS Code &raquo;](https://nx.dev/getting-started/editor-setup)

### Prisma Studio

Visual database editor for managing your data:

```sh
cd apps/busybee-be
npx prisma studio
```

## 📝 Environment Variables

### Backend (`apps/busybee-be/.env`)

```env
DATABASE_URL="postgresql://user:password@host:port/database"
PORT=3000
NODE_ENV=development
```

### Frontend

Firebase configuration is stored directly in the environment files at `apps/busybee-fe/src/environments/`. This is safe because Firebase client config is public by design - security comes from Firebase Security Rules.

- `environment.ts` - Development config (localhost API)
- `environment.prod.ts` - Production config (Fly.io API)

## 🚀 Deployment

This application is deployed to **Fly.io** for both frontend and backend with **no cold starts**.

### Quick Start

```bash
# Install Fly CLI
brew install flyctl

# Login
fly auth login

# Deploy backend
fly deploy --config apps/busybee-be/fly.toml -a busybee-backend

# Deploy frontend
fly deploy --config apps/busybee-fe/fly.toml -a busybee
```

### Detailed Instructions

See [FLY_DEPLOYMENT.md](./FLY_DEPLOYMENT.md) for complete step-by-step deployment guide including:

- Setting up Firebase credentials
- Configuring environment variables
- Managing secrets
- Scaling and monitoring
- Troubleshooting

### Key Benefits of Fly.io

✅ **No cold starts** - Apps stay running 24/7
✅ **Free tier** - 3 VMs with 256MB RAM each
✅ **Fast global edge network**
✅ **Simple deployment** with Docker

## 🎨 Frontend Architecture

- **Standalone Components**: Using Angular's modern standalone component API
- **Signals**: Reactive state management with Angular Signals
- **Apollo Client**: Type-safe GraphQL queries and mutations
- **Reactive Forms**: FormBuilder with validation
- **DaisyUI Themes**: Built-in dark/light mode support

## 🔧 Backend Architecture

- **Modular Structure**: NestJS modules for tasks, projects, and tags
- **GraphQL Schema-First**: Code-first approach with decorators
- **Prisma ORM**: Type-safe database access
- **Dependency Injection**: NestJS DI container
- **Database Migrations**: Version-controlled schema changes

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 📚 Useful Links

### Technologies

- [Angular](https://angular.dev) - Frontend framework
- [NestJS](https://nestjs.com) - Backend framework
- [Prisma](https://www.prisma.io) - Database ORM
- [GraphQL](https://graphql.org) - API query language
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS
- [DaisyUI](https://daisyui.com) - Component library
- [Nx](https://nx.dev) - Monorepo tools

### Nx Resources

- [Nx Documentation](https://nx.dev)
- [Nx Console](https://nx.dev/getting-started/editor-setup)
- [Nx Community Discord](https://go.nx.dev/community)

---

Built with ❤️ using Nx monorepo
