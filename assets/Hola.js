import React from 'react';
import { createRoot } from 'react-dom/client';

import './styles/app.css';
import Hola from './pages/Hola';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<Hola />);
}