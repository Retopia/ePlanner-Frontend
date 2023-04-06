import React from 'react';
import ReactDOM from 'react-dom';
import './stylesheets/index.css';
import HomePage from './App';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <HomePage />
  </React.StrictMode>,
  document.getElementById('root')
);

// Other boilerplate code
reportWebVitals();