import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Async load CSS so it doesn't block render
import('./styles/global.css');

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);