# JavaScript Notebook (JSNB) [Try here](https://moonlit-tanuki-508870.netlify.app). 
Notebook for javascript experimentation (in the browser). Overview:
- Easy to use javascript experimentation tool.
- Runs with backend of node.js/npm .  
- UI is similar/close to Jupyter Notebook (for the sake familiarity for python developers). Has a minimalistic UI to put focus on user generated code/content.
- It is styled with react-bootstrap  etc.
- Comes pre-loaded with Plotly, D3 for power usage. More libaries/modules can be easily loaded using load_script or import_module functions.

## Table of contents
<!-- toc -->
1. [Getting Started](#getting-started)
2. [Project Structure](#project-structure)
3. [Features](#features)
4. [Use cases](#use-cases)
5. [Vs. xyz](#how-is-jsnb-different)
6. [Additional Resources](#links)

## Getting Started
### 1. `Clone this repository`
### 2. `npm install`
### 3. `npm run build`
### 4. Run BOTH the backend API and frontend in production:
* **Option A (Easy - Single Command):**
  ```bash
  npm run serve-prod
  ```
* **Option B (Separate Terminals):**
  1. Start backend: `node server.js`
  2. Serve frontend: `npx serve -s build`

### 5. You can also try the hosted version (without downloading anything) here: [( https://moonlit-tanuki-508870.netlify.app )]( https://moonlit-tanuki-508870.netlify.app )
### 6. More examples will be added in the folder examples/ in the repository. Check the [README in that folder](/examples/README.md) for links.

## Project Structure

The project is a React-based frontend alongside an Express.js backend, simulating a Jupyter notebook architecture.

```text
react-js-notebook/
├── public/                 # Static assets
├── sample/                 # Sample JS notebooks (.jsnb)
├── notebooks/              # Local notebook storage directory (for backend API)
├── src/                    # Main application code
│   ├── Components/         # React UI Components
│   │   ├── CellComponent.js   # Code and markdown cell logic
│   │   ├── CellPlot.js        # Plotting interface
│   │   ├── HeaderComponent.js # Notebook toolbar and navigation
│   │   ├── FooterComponent.js # Application footer
│   │   └── HelpComponent.js   # Help and shortcuts modal
│   ├── Utils/              # Utility functions for cell operations (Insert, Move, Delete)
│   ├── App.js              # Application layout and state management
│   ├── Dashboard.js        # File browser and active kernels dashboard
│   ├── KernelManager.js    # Manages background web workers for isolated code execution
│   └── index.js            # React entry point
├── server.js               # Express server providing a file system API and serving the app
├── package.json            # Node dependencies and scripts
└── Dockerfile              # Containerization configuration
```

## Features
- The notebook consists of cells. Each cell will have user inputted code and an output. There is a menu at the top in navbar.
- There are two types of cells: code and html. Each output cell is sync with code cell .
- To get the output of a cell press play ► button on the cell(or Cmd/Ctrl-Enter on keyboard after selecting the cell).
- The cell menu also has buttons for moving the cell up ↑, down ↓, adding a new cell ✛ and deleting the current cell ☓ all in navbar menu.
- A notebook can be downloaded as json (has a default extension of .jsnb). IT can be loaded back into the app. The notebook can also be downloaded as pdf.
- A .jsnb file can also be loaded into the app by opening the default link and choosing the .jsnb file.
- There are many special functions included in the app: show(...) for showing some string in the output box.
- For adding more functionality import an external library through loadLibrary(...) 
- D3JS (for data manipulation and charting), Plotly (for plots) are preloaded and can be used in the notebooks without seperately loading.
- Keyboard Shortcuts: See in help option.


## Use cases
1. For trying new libraries for testing and building
2. For building reproducible research and sharing the results with others

## Not to be used for:
1. Production use cases
2. As an alternative to webapps
3. Working with sensitive data like login/pwd/private keys etc.


## How is JSNB different
- JSNB is an open source application and hence can be downloaded, modified and used freely. Jsfiddle/codepen are cloud based platforms.
- JSNB can have multiple cells so it can create long documents.
- Intended use is for experimenting and computing in javascript. HTML and CSS are secondary in the case of JSNB. Whereas for Jsfiddle and codepen the main use case to test javascript along with html and css.
- JSNB can also be used for scientific computation using several open source javascript libraries.
- After some upgrades the Data Science Model can be build using the JSNB.

## Links
Additional documentation for JSNB:
1. [Docs]()
2. [Sample Notebooks](https://github.com/sidrumade/react-js-notebook/blob/main/sample/)
