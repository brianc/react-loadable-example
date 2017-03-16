import React from 'react';
import { render } from 'react-dom';
import App from './app'
import { BrowserRouter as Router } from 'react-router-dom'

const Root = () => (
  <Router>
    <App />
  </Router>
)

window.onload = () => render(<Root />, document.getElementById('root'))
