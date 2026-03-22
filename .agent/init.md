# Agent Context & Initialization: JavaScript Notebook (JSNB)

## Project Overview
JSNB is an open-source, web-based JavaScript experimentation tool. Its interface closely mirrors Jupyter Notebook, providing an environment for experimenting, computing, and visualizing with JavaScript directly in the browser.

## Technology Stack
- **Core**: React.js (v18.2.0)
- **Styling UI**: Vanilla CSS combined with React-Bootstrap
- **Icons**: FontAwesome
- **Code Editing**: `react-simple-code-editor` with `prismjs` for syntax highlighting
- **Build Tools**: `react-scripts`, customized with a `webpack.config.js` to provide Node.js polyfills (e.g., `buffer`, `stream-browserify`) required for running some scripts in the browser.

## Directory Structure
- `src/App.js`: Main entry point containing application state (notebook array, cell states) and primary layout.
- `src/Components/`: Contains core React components.
  - `CellComponent.js`: Responsible for rendering individual code/HTML cells.
  - `HeaderComponent.js` & `FooterComponent.js`: Main layout structural components.
  - `FileExplorer.js`, `HelpComponent.js`, etc.
- `src/Utils/`: Utility functions primarily mutating or processing the notebook state (e.g., `InsertCellAbove.js`, `DeleteCell.js`, `MoveCellDown.js`).
- `public/`: Static assets.

## Key Development Workflows
- **Install Dependencies**: `npm install`
- **Development Server**: `npm start`
- **Build for Production**: `npm run build`
- **Serve Production Build**: `npm install -g serve` followed by `serve -s build`

## Coding Guidelines for Agents
1. **Style Guide**: Do NOT introduce TailwindCSS. The app natively uses React-Bootstrap and standard CSS stylesheets (e.g., `cellstyle.css`, `notebook.css`). Rely on these for adding UI features.
2. **State Management**: The notebook cells array is typically managed at a high level (likely in `App.js` or via a context). Ensure that modifications involving adding/moving/deleting cells cleanly interact with the pure functions available in `src/Utils/`.
3. **Execution Context**: Since JS evaluation occurs in the browser context to fulfill the application's core purpose, any new browser APIs or required native modules should consider polyfills in `webpack.config.js` or `package.json`.
4. **Clean File Management**: Keep utility structures clean. If introducing new cell manipulation logic, create a new utility file in `src/Utils/` rather than bloating `App.js`.
