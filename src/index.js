import React from 'react';
import ReactDOM from 'react-dom';
import './stylesheets/index.css';
import HomePage from './App';
import reportWebVitals from './reportWebVitals';
import { inject } from '@vercel/analytics';

ReactDOM.render(
  <React.StrictMode>
    <HomePage />
  </React.StrictMode>,
  document.getElementById('root')
);

inject();

// Other boilerplate code
reportWebVitals();