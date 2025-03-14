# BizGuide Development Guide

## Build Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production (runs TypeScript compiler and Vite)
- `npm run lint` - Run ESLint on the codebase
- `npm run preview` - Preview production build locally

## TypeScript
- Strict mode enabled
- Enforce no unused locals/parameters
- ES2020 target with React JSX support

## Code Style
- Use functional components with React hooks
- Prefer const over let, avoid var
- Named exports for components
- Imports order: React/libraries, then components, then assets/styles
- Use TypeScript interfaces for props and state
- Explicit return types on functions with non-trivial types
- Error boundaries for component-level error handling

## Naming Conventions
- Components: PascalCase (Button.tsx)
- Hooks: camelCase with usePrefix (useState)
- Variables/functions: camelCase
- File names match component names
- CSS modules for component styling