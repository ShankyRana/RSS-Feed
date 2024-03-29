import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './routes';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

const rootEl = document.getElementById('root');

const render = (Component) => {
  ReactDOM.render(
    <App Component={Component} />,
    rootEl
  );
};

render(Routes);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
