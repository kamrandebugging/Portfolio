import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { applyMotionAttribute } from './engine/motion';
import './index.css';

// Before first paint, so the CSS fallback for reduced motion is in place from the start.
applyMotionAttribute();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
