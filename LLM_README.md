# React JS Notebook (jsnb) - LLM Agent Guide

This file provides context and structural documentation for AI/LLM agents working on the React JS Notebook codebase.

## Overview
React JS Notebook is a client-side JavaScript experimentation tool heavily inspired by Jupyter Notebooks. It provides an arbitrary code execution environment right in the browser, specifically designed to let users explore JavaScript, visualize data with libraries like Plotly or D3, and write documentation or notes.

## Tech Stack
- **Framework**: React 18, utilizing create-react-app (react-scripts).
- **UI/Styling**: React Bootstrap, standard CSS files.
- **Code Editor**: `react-simple-code-editor` coupled with `prismjs` for syntax highlighting.
- **Data Visualization**: Pre-supported external libraries like Plotly or D3 can be explicitly loaded and used inside code cells.

## Architecture & Code execution
The application relies on stateful class components (specifically `App.js`) combined with functional React components and a backend file server.

### 1. State Management (`src/App.js`)
`App.js` is the core controller and the central source of truth for the active notebook state.
- **`cellContext_data`**: An array residing in `App.js` state. It dictates everything rendered in the notebook. Each object within it represents a cell and holds:
  - `editorsValue` (the string code inside the cell)
  - `cell_type` (whether it is `code` or `markdown`)
  - `output` (a list of string representations to display as execution results/logs)
  - `html_element` (a raw HTML string representing visual outputs)
  - `error` and `executionTime`
- **Execution Engine**: Code is NO LONGER executed via `global.eval()`. Instead, `App.js` dispatches the code payload to a dedicated Web Worker via `KernelManager.js`. This creates a sandboxed, non-blocking execution thread per notebook that mimics a Jupyter "Kernel", preventing long-running scripts from freezing the UI.
- **Kernel Management**: `Dashboard.js` tracks and manages all active kernels across the workspace, allowing you to forcibly shut them down if they hang.

### 2. Components (`src/Components/` & `src/Dashboard.js`)
- **`Dashboard.js`**: The landing routing page (`/tree`). It polls the backend API to list the local filesystem of notebooks and tracks running kernels. Acts as the primary hub for creating, opening, and deleting notebooks.
- **`CellComponent.js`**: Renders a single code or markdown cell. Uses `react-simple-code-editor` and `react-markdown`.
- **`HeaderComponent.js`**: Structural element containing cell manipulation buttons and kernel execution options (Run All, Restart, Interrupt).

### 3. Notebook Utilities (`src/Utils/`)
A collection of scripts designed to mutate the `cellContext_data` list. 
- Files like `InsertCellBelow.js`, `DeleteCell.js`, `MoveCellUp.js`.
- **Note:** These utils receive the `App` class context (referred to as `this_component`) so they can independently update the global state (`this_component.setState(...)`).

## Data Persistence & Storage (`server.js`)
- **Node.js Express Backend**: The application boots concurrently with a local Express backend (`server.js`) attached to port `3001`.
- **True File System**: Notebooks are NO LONGER saved to the browser's `localStorage`. They are physically saved and served out of the `/notebooks` directory within the workspace.
- **File-based Hashing**: The arbitrary UUID hash schema was replaced. A notebook's "hash" or identifier is identically its raw filename (e.g. `my_code.jsnb`). 
- **Auto-Save**: The save frequency is bounded/debounced by a timeout mechanism inside `App.js`'s `componentDidUpdate`, aggressively dispatching `POST /api/notebooks/:name` HTTP requests to silently synchronize state changes directly to the local disk.

## Important Considerations for Agents
- **Concurrent Start**: The `npm start` command uses `concurrently` to spin up both the React dev server and the Node API.
- **Renaming and Collision Protection**: The `server.js` backend API handles unique name collisions (appending digits) and orchestrates filesystem renames automatically when the active UI title name does not match the URL identifier.
