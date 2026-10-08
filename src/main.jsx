import React from 'react';
import { createRoot } from 'react-dom/client';
import { MotionConfig } from 'framer-motion';
import App from './App';
import './style.css';
import { PreferencesProvider } from './Preferences';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MotionConfig reducedMotion="user"><PreferencesProvider><App /></PreferencesProvider></MotionConfig>
  </React.StrictMode>
);
