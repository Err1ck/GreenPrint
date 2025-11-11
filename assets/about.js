import React from 'react';
import { createRoot } from 'react-dom/client';
import About from './Pages/About';
import './styles/app.css';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<About />);
}