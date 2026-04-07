# Workflow Builder Project Overview

A modern, interactive workflow builder and runner frontend built with Next.js, React Flow, and TypeScript. This project allows users to design automated workflows by dragging and dropping custom nodes, configuring their properties, and executing them through an asynchronous service.

## Core Technologies
- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19, Tailwind CSS 4
- **Diagramming**: [React Flow (@xyflow/react)](https://reactflow.dev/)
- **State Management**: React Hooks (useState, useCallback, useNodesState, etc.)
- **API Client**: Axios for backend communication
- **Type Safety**: TypeScript for robust data models

## Project Structure
- `src/app`: Main application logic using Next.js App Router.
  - `page.tsx`: The primary workflow editor interface.
  - `components/`: UI components for the builder.
    - `Sidebar.tsx`: Draggable node list.
    - `NodeConfigPanel.tsx`: Panel for editing node-specific settings.
    - `CustomNodes.tsx`: Custom React Flow node definitions (Trigger, Search, LLM Call, etc.).
  - `context/`: Context providers like `DnDContext` for Drag-and-Drop functionality.
  - `interfaces/`: TypeScript interfaces for Workflows, Nodes, and Edges.
  - `api/`: Next.js Route Handlers.
    - `workflows/route.ts`: API for listing and reading workflow JSONs from `NewWorkflows/`.
    - `filesave/route.ts`: API for saving workflow configurations.
- `src/services/`: External service integration.
  - `workflowService.tsx`: Client for calling the remote workflow runner API (`/run-json`).
- `NewWorkflows/`: Local directory for storing workflow configuration files in JSON format.
- `public/nodeImages/`: Icons used in the workflow nodes (e.g., `chat.svg`, `document_search.svg`).

## Key Workflows & Features
1. **Visual Editing**: Users can drag nodes from the sidebar onto the canvas and connect them with edges.
2. **Node Configuration**: Selecting a node opens a configuration panel to define its behavior.
3. **Local Persistence**: Workflows are saved and loaded from JSON files stored in the `NewWorkflows/` directory via internal API routes.
4. **Execution**: The `runWorkflowJsonAsync` service sends the workflow definition to a backend runner for processing.

## Building and Running
- **Development**: `npm run dev` starts the Next.js development server at `http://localhost:3000`.
- **Production Build**: `npm run build` generates a production-optimized build.
- **Preview**: `npm run start` runs the production build locally.
- **Linting**: `npm run lint` executes ESLint to ensure code quality.

## Development Conventions
- **Component Design**: Favor modular UI components in `src/app/components`.
- **Typing**: Rigorously use interfaces defined in `src/app/interfaces` to ensure consistency across the application.
- **Service Layer**: Keep API logic within `src/services` to decouple the UI from the backend.
- **Styling**: Use Tailwind CSS 4 for all styling, following a utility-first approach.
