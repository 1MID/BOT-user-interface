/** React Library */
import React from 'react';
import ReactDOM from 'react-dom';

/** Bootstrap Custom CSS */
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

/** Import Custom CSS */
import './js/customizedCSS';

/** Container Component */
import App from './App'

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);




