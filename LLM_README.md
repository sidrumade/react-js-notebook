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
The application relies heavily on stateful class components (specifically `App.js`) combined with functional React components. 

### 1. State Management (`src/App.js`)
`App.js` is the core controller and the central source of truth for the application state.
- **`cellContext_data`**: An array residing in `App.js` state. It dictates everything rendered in the notebook. Each object within it represents a cell and holds:
  - `editorsValue` (the string code inside the cell)
  - `output` (a list of string representations to display as execution results/logs)
  - `html_element` (a raw HTML string representing visual outputs e.g. a Plotly chart container)
  - `error` (for handling arbitrary `global.eval()` errors)
  - `executionTime`
- **Execution Engine**: When a user clicks "Play", `App.js` evaluates the code using `global.eval(code)`. 
- **Global Injections**: Before evaluation, the app injects three important functions into the `global` object:
  - `show(...data)`: Functions like `console.log()` but pipes the output directly to the cell's `output` prop.
  - `insertHTML(element)`: Pipes an HTML string to the cell's `html_element` prop. This is used to create specific divs for visualizations like Plotly.
  - `loadLibrary(libraryUrl)`: Dynamically creates a `<script>` tag in the DOM to load external JavaScript libraries onto the page.

### 2. Components (`src/Components/`)
- **`CellComponent.js`**: Renders a single code cell. Takes code editor changes and pipes them back to `App.js`. It displays code, logs (errors and `show()` outputs), and HTML visuals.
- **`CellPlot.js`**: Takes the `html_element` string generated occasionally by a cell and uses `dangerouslySetInnerHTML` (implicitly or explicitly) to render custom graphics directly in the output area.
- **`HeaderComponent.js` & `FooterComponent.js`**: Static structural elements containing menus, cell manipulation buttons, and file export options (`.jsnb` and `.html`).

### 3. Notebook Utilities (`src/Utils/`)
A collection of scripts designed to mutate the `cellContext_data` list. 
- Files like `InsertCellBelow.js`, `DeleteCell.js`, `MoveCellUp.js`.
- **Note:** These utils receive the `App` class context (referred to as `this_component`) so they can independently update the global state (`this_component.setState(...)`).

## Data Persistence & Storage
- Notebooks are auto-saved to the browser's `localStorage` against a randomly generated `notebook_hash`. 
- The save frequency is bounded/debounced by a timeout mechanism inside `App.js`'s `componentDidUpdate`.
- A notebook can be saved to the local file system as a `.jsnb` file, which is essentially stringified JSON of the main application state.

## Important Considerations for Agents
- **Code Evaluation**: Since code is evaluated using `global.eval()`, scope leakage is expected. Code running in any cell can pollute the `window` object affecting all sibling cells. This is a design decision meant to mimic a continuous REPL environment similar to Notebooks.
- **Refactoring Note**: Portions of the codebase (like `App.js`) utilize legacy React Class Component syntax alongside `bind()` methods. When extending functionality, adhere closely to the existing architectural pattern: passing down updater callbacks from `App.js` instead of migrating specific pieces to Redux/Context (unless a complete architectural lift is approved).
