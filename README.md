# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Prerequisites

### GitHub Packages Authentication

This project uses private packages from `@artco-group`. You need to configure a GitHub Personal Access Token (PAT) to install dependencies.

1. Get the `NPM_TOKEN` or create your own at [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens) with `read:packages` scope
2. Add it to your shell profile (`~/.zshrc` or `~/.bashrc`):
   ```bash
   echo 'export NPM_TOKEN=<your-token>' >> ~/.zshrc
   source ~/.zshrc
   ```
3. Verify it's set:
   ```bash
   echo $NPM_TOKEN
   ```
4. Run `yarn install`

## Environment Variables

This project uses environment variables for configuration. Create a `.env` file in the root directory based on `.env.example`.

### Available Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:3001/api` | No |
| `VITE_APP_NAME` | Application display name | `Artco Ticketing` | No |

### Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Update the values in `.env` according to your environment.

3. Restart the development server for changes to take effect.

**Note:** All environment variables must be prefixed with `VITE_` to be accessible in the application. Vite automatically exposes these variables through `import.meta.env`.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# SSH Test


## Pull Requests
 
### Creating a PR
1. Ensure your branch follows the naming convention: `type/ARTCOCRM-XXX/description`
2. Fill out the PR template completely.
3. Link the related JIRA ticket.
4. Request reviewers.
 
### PR Title Format
 
type(scope): ARTCOCRM-XXX description
 
**Examples:**
- `feat(auth): ARTCOCRM-123 add login functionality`
- `fix(api): ARTCOCRM-45 resolve null pointer exception`
 
### Review Process
- Minimum 1 approval required before merging.
- All CI checks must pass.
- Resolve all review comments before merging.
 

## Git Hooks (Husky)

This project uses Husky to enforce code quality standards.

### Setup
Hooks are automatically installed when you run `npm install`.

### Branch Naming Convention
Branches must include the JIRA ticket ID and follow this pattern:
type/ARTCOCRM-XXX/description

**Allowed types:** `feature`, `bugfix`, `hotfix`, `release`, `chore`

**Examples:**
- ✅ `feature/ARTCOCRM-123/add-login-page`
- ✅ `bugfix/ARTCOCRM-45/fix-null-pointer`
- ❌ `feature/add-login` (missing ticket ID)

**Excluded branches:** `main`, `master`, `develop`

### Commit Message Format
We use [Conventional Commits](https://www.conventionalcommits.org/) with required ticket ID:
type(scope): ARTCOCRM-XXX description

**Allowed types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `build`, `ci`

**Examples:**
- ✅ `feat(auth): ARTCOCRM-123 add login functionality`
- ✅ `fix(api): ARTCOCRM-45 resolve null pointer exception`
- ✅ `docs: ARTCOCRM-67 update README`
- ❌ `feat: add login` (missing ticket ID)

### Pre-commit Checks
Before each commit, the following checks run automatically:
1. **Linting** — ESLint/Prettier on staged files
2. **Build verification** — ensures code compiles

### Troubleshooting

**Hooks not running?**
```bash
npx husky install

**Permission denied?**
chmod +x .husky/*

**Bypass hooks (emergency only):**
git commit --no-verify -m "message"

## CI/CD

![CI](https://github.com/Artco-Group/artco-ticketing-fe/actions/workflows/ci.yml/badge.svg)

### Automated Checks

Every Pull Request automatically runs:

| Check | Description |
|-------|-------------|
| 🔍 Validate Branch Name | Ensures branch follows `type/ARTCOCRM-XXX/description` format |
| 📝 Validate Commits | Ensures commits follow conventional commit format with ticket ID |
| 🧹 Lint | Runs ESLint/Prettier |
| 🔨 Build | Ensures project builds successfully |
| 🧪 Test | Runs test suite |

### Merge Requirements

- All CI checks must pass
- At least one approval required
- Branch must be up to date with the target branch

## Project Architecture

This project follows a **feature-based architecture** where code is organized by features rather than by technical layers. Each feature is self-contained with its own components, pages, API hooks, and routes.

### Directory Structure

```
src/
├── app/                    # Application-level configuration
│   ├── config/            # App configuration files
│   └── routes/            # Central route aggregation
├── features/              # Feature modules (self-contained)
│   ├── auth/             # Authentication feature
│   │   ├── api/          # Auth API hooks (React Query)
│   │   ├── components/   # Auth-specific components
│   │   ├── context/      # Auth context & provider
│   │   ├── pages/        # Auth pages
│   │   └── routes.tsx    # Auth route definitions
│   ├── dashboard/        # Dashboard feature
│   ├── tickets/          # Tickets feature
│   └── users/            # Users feature
├── shared/                # Shared utilities and components
│   ├── components/       # Reusable UI components
│   ├── lib/              # Shared libraries (API client, React Query setup)
│   ├── utils/            # Utility functions
│   └── pages/            # Shared pages (404, etc.)
└── types/                # TypeScript type definitions
```

### Key Architectural Principles

1. **Feature Isolation**: Each feature is self-contained with minimal dependencies on other features
2. **Shared Code**: Common utilities, components, and libraries live in `shared/`
3. **API Layer**: All API calls use React Query hooks defined in feature `api/` directories
4. **Route Configuration**: Routes are defined per-feature and aggregated in `app/routes/`

### Import Path Aliases

The project uses TypeScript path aliases for cleaner imports:

- `@/` → `src/`
- `@features/` → `src/features/`
- `@shared/` → `src/shared/`
- `@app/` → `src/app/`

**Example:**
```typescript
import { useAuth } from '@/features/auth/context';
import { useTickets } from '@features/tickets/api';
import { Button } from '@shared/components';
```

### Route Configuration

Routes are defined in each feature's `routes.tsx` file and aggregated in `src/app/routes/index.tsx`:

```typescript
// features/auth/routes.tsx
export const authRoutes: RouteObject[] = [
  { path: ROUTES.AUTH.LOGIN, element: <LoginPage /> },
  // ...
];

// app/routes/index.tsx
export const allRoutes: RouteObject[] = [
  ...authRoutes,
  ...ticketRoutes,
  ...userRoutes,
  // ...
];
```

### API Layer

All API calls use React Query hooks for server state management:

- **Query hooks** (`useXxx`) for fetching data
- **Mutation hooks** (`useXxxMutation`) for creating/updating/deleting
- Hooks are defined in feature `api/` directories
- Legacy API objects (e.g., `usersAPI`, `ticketAPI`) are deprecated in favor of React Query hooks

**Example:**
```typescript
// Old way (deprecated)
const response = await usersAPI.getUsers();

// New way (preferred)
const { data, isLoading } = useUsers();
```

### Adding a New Feature

1. Create feature directory: `src/features/your-feature/`
2. Add subdirectories: `api/`, `components/`, `pages/`, etc.
3. Create `routes.tsx` with route definitions
4. Export routes and add to `app/routes/index.tsx`
5. Add feature exports to `index.ts` files as needed