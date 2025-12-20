# BookMyEvent Frontend

A modern, performant single-page application for event service booking and management. Built with React 19, TypeScript, and Vite for a seamless user experience across desktop and mobile devices.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Architecture](#architecture)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Overview

BookMyEvent is a comprehensive event services marketplace that connects users with service providers. The platform enables users to browse, explore, and book various event-related services while providing administrators with tools to manage services and bookings.

## Features

### User Features

- Browse and explore available event services
- Advanced filtering by category, city, price range, and date
- Service detail views with booking functionality
- User dashboard for managing bookings
- Profile management

### Admin Features

- Admin dashboard for service management
- View and manage bookings per service
- Service creation and editing capabilities

### Technical Features

- Route-based code splitting for optimized loading
- Responsive design for all device sizes
- Protected routes for authenticated users and administrators
- Real-time form validation with Zod
- Persistent state management with Redux

## Technology Stack

| Category             | Technology                       |
| -------------------- | -------------------------------- |
| **Core Framework**   | React 19.2                       |
| **Language**         | TypeScript 5.9                   |
| **Build Tool**       | Vite 7.2                         |
| **Styling**          | Tailwind CSS 3.4, CSS Variables  |
| **State Management** | Redux Toolkit, Redux Persist     |
| **Data Fetching**    | TanStack Query (React Query) 5.x |
| **Routing**          | React Router DOM 7.x             |
| **Forms**            | React Hook Form, Zod             |
| **UI Components**    | Radix UI Primitives              |
| **Animations**       | Framer Motion                    |
| **Icons**            | Lucide React                     |

## Project Structure

```
src/
├── api/                    # API-related utilities
├── components/             # Shared components
│   ├── shared/             # Reusable shared components
│   └── ui/                 # UI primitives (buttons, inputs, etc.)
├── const/                  # Application constants
├── features/               # Feature-based modules
│   ├── admin/              # Admin dashboard features
│   ├── auth/               # Authentication (login, signup)
│   ├── bookings/           # Booking management
│   ├── dashboard/          # User dashboard
│   ├── explore/            # Service exploration
│   ├── landing/            # Landing page
│   ├── layouts/            # Layout components
│   └── profile/            # User profile management
├── hooks/                  # Custom React hooks
├── lib/                    # Utility libraries (HTTP client, etc.)
├── store/                  # Redux store configuration
├── styles/                 # Global styles
├── types/                  # TypeScript type definitions
├── utils/                  # Utility functions
├── main.tsx                # Application entry point
└── router.tsx              # Route configuration
```

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher (or yarn/pnpm)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/bookmyevent-frontend.git
cd bookmyevent-frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### Environment Variables

Create a `.env.local` file in the project root with the following variables:

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:9000/api/v1
```

| Variable            | Description          | Default                        |
| ------------------- | -------------------- | ------------------------------ |
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:9000/api/v1` |

## Available Scripts

| Script            | Description                                          |
| ----------------- | ---------------------------------------------------- |
| `npm run dev`     | Start development server with hot module replacement |
| `npm run build`   | Type-check and build production bundle               |
| `npm run lint`    | Run ESLint for code quality checks                   |
| `npm run preview` | Preview production build locally                     |

## Architecture

### State Management

The application uses a hybrid approach to state management:

- **Redux Toolkit**: Global application state (authentication, user data)
- **Redux Persist**: Persisting critical state across browser sessions
- **TanStack Query**: Server state management with caching and synchronization

### Routing

React Router DOM v7 handles client-side routing with:

- Lazy-loaded route components for code splitting
- Protected routes for authenticated users (`UserProtectedRoute`)
- Admin-only routes (`AdminProtectedRoute`)
- Public-only routes for unauthenticated users (`PublicOnlyRoute`)

### Styling

The design system is built on:

- Tailwind CSS with a custom configuration
- CSS custom properties for theming
- Radix UI primitives for accessible components
- Framer Motion for animations

### API Integration

A custom HTTP client (`src/lib/http.ts`) provides:

- Centralized API request handling
- Automatic JSON serialization
- Credential management
- Error handling with typed responses

## Deployment

### Vercel (Recommended)

The project includes a `vercel.json` configuration for seamless deployment:

1. Connect your repository to Vercel
2. Configure environment variables in the Vercel dashboard
3. Deploy

### Manual Build

```bash
# Build for production
npm run build

# Output will be in the dist/ directory
```

The `dist/` folder contains static assets ready for deployment to any static hosting service (Netlify, AWS S3, Cloudflare Pages, etc.).

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

### Code Style

- Follow the existing ESLint configuration
- Use TypeScript strict mode
- Write meaningful commit messages
- Ensure all tests pass before submitting PR

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

For backend API documentation, please refer to the [BookMyEvent Backend](https://github.com/your-username/bookmyevent-backend) repository.
