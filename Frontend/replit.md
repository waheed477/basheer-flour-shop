# Basheer Flour Shop

## Overview

A bilingual (English/Urdu) e-commerce web application for a flour and wheat shop in Pakistan. The application showcases products with full RTL support for Urdu, allows customers to submit contact inquiries, and provides an admin dashboard for product and contact management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript, bundled with Vite
- **Routing**: Wouter for client-side navigation
- **State Management**: TanStack React Query for server state caching and mutations
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming (warm earthy palette)
- **Animations**: Framer Motion for page transitions and micro-interactions
- **Internationalization**: Custom language context with localStorage persistence, supporting English (LTR) and Urdu (RTL)

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ESM modules
- **API Design**: RESTful endpoints defined in shared routes file with Zod validation
- **Build System**: esbuild for server bundling, Vite for client bundling

### Data Layer
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM with drizzle-zod for schema validation
- **Schema Location**: `shared/schema.ts` contains all table definitions and Zod schemas
- **Tables**: Products (bilingual fields, category, unit, pricing), Contacts (customer inquiries with status), Users (admin authentication)

### Project Structure
```
├── client/src/          # React frontend
│   ├── components/      # UI components (shadcn/ui + custom)
│   ├── hooks/           # Custom React hooks (auth, products, contacts, language)
│   ├── pages/           # Route components
│   └── lib/             # Utilities and query client
├── server/              # Express backend
│   ├── routes.ts        # API endpoint definitions
│   ├── storage.ts       # Database operations layer
│   └── db.ts            # Drizzle database connection
├── shared/              # Shared code between client/server
│   ├── schema.ts        # Drizzle table definitions and Zod schemas
│   └── routes.ts        # API route contracts with type definitions
└── migrations/          # Database migrations
```

### Key Design Decisions

1. **Shared Types**: Schema and API contracts live in `/shared` to ensure type safety between frontend and backend without duplication.

2. **Bilingual Product Data**: Products have separate fields for English (`name`, `descriptionEn`) and Urdu (`nameUrdu`, `descriptionUrdu`) with proper font rendering.

3. **Unit System**: Wheat products use "Maan" (40 kg traditional unit) while flour uses standard kg/lb, handled via the `unit` enum field.

4. **Storage Pattern**: `DatabaseStorage` class implements `IStorage` interface, allowing potential swap to different backends.

5. **Component Architecture**: Uses composition pattern with shadcn/ui base components extended for domain-specific needs (e.g., `ProductCard`).

## External Dependencies

### Database
- **PostgreSQL**: Primary database, connection via `DATABASE_URL` environment variable
- **connect-pg-simple**: Session storage in PostgreSQL

### Frontend Libraries
- **@tanstack/react-query**: Server state management
- **react-hook-form** + **@hookform/resolvers**: Form handling with Zod validation
- **framer-motion**: Animation library
- **wouter**: Lightweight client-side router
- **react-icons**: Icon library (includes WhatsApp icon for product cards)

### Backend Libraries
- **drizzle-orm** + **drizzle-kit**: Database ORM and migration tooling
- **zod**: Runtime type validation
- **express-session**: Session management

### Build Tools
- **Vite**: Frontend dev server and bundler
- **esbuild**: Server bundling for production
- **tsx**: TypeScript execution for development

### Replit-specific
- **@replit/vite-plugin-runtime-error-modal**: Error overlay in development
- **@replit/vite-plugin-cartographer**: Development tooling