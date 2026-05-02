import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// This is the entry point for your React application.
// It tells the browser to take the 'App' component and 
// inject it into the 'root' div in your public/index.html file.

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);