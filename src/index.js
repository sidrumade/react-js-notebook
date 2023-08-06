import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

{/* The following line can be included in your src/index.js or App.js file */}

const Routing = () => {
  return(
    <Router>
    <Routes>
        <Route path="*" element={<App />} />
        <Route path="/help" element={<App />} />
    </Routes>
</Router>
  )
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Routing />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
