# Busybee 🐝

A modern, full-stack task management application built with Nx monorepo architecture.

## 📋 Overview

Busybee is a comprehensive task management system that helps you organize your work with projects, tags, and priorities. Built with cutting-edge technologies for both frontend and backend.

## 🚀 Tech Stack

### Frontend (busybee-fe)

- **Framework**: Angular 20 with Signals & Standalone Components
- **Styling**: Tailwind CSS & DaisyUI
- **State Management**: Angular Signals
- **API Communication**: Apollo Client (GraphQL)
- **Calendar**: Cally Web Component

### Backend (busybee-be)

- **Framework**: NestJS
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

- **Frontend**: [Netlify](https://busybee-tasks.netlify.app)
- **Backend API**: https://busybee-g318.onrender.com/graphql

The application is deployed using:

- **Frontend**: Netlify (static build)
- **Backend**: Render (Web Service)
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

- **Task Management**: Create, update, delete, and organize tasks
- **Project Organization**: Group tasks into projects with custom colors and icons
- **Tags System**: Flexible tagging for cross-project organization
- **Priority Levels**: High, Medium, Low priority classification
- **Due Dates**: Calendar integration with Cally web component
- **Search**: Find tasks quickly by title
- **Filtering**: Filter tasks by project, tags, priority, and completion status
- **GraphQL API**: Modern, efficient API with type safety
- **Responsive Design**: Mobile-friendly interface with DaisyUI components

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

### Backend (.env)

```env
DATABASE_URL="postgresql://user:password@host:port/database"
PORT=3000
NODE_ENV=development
```

### Frontend (environment files)

**Development** (`apps/busybee-fe/src/environments/environment.ts`):

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/graphql',
};
```

**Production** (`apps/busybee-fe/src/environments/environment.prod.ts`):

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://busybee-g318.onrender.com/graphql',
};
```

## 🚀 Deployment

### Backend (Render)

1. Create a new Web Service on [Render](https://render.com)
2. Connect your GitHub repository
3. Configure the service:
   - **Build Command**: `npm install && npx nx build busybee-be`
   - **Start Command**: `node apps/busybee-be/dist/main.js`
   - **Environment**: Node
4. Add environment variable: `DATABASE_URL` (your Neon PostgreSQL connection string)
5. Deploy!

### Frontend (Netlify)

1. Create a new site on [Netlify](https://netlify.com)
2. Connect your GitHub repository
3. Configure build settings:
   - **Build Command**: `nx build busybee-fe --configuration=production`
   - **Publish Directory**: `dist/apps/busybee-fe/browser`
4. Deploy!

The frontend automatically uses the production API URL when built with the production configuration.

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
