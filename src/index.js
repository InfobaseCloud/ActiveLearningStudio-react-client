import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import ReactGA from 'react-ga';

import App from './components/App';
import store from './store';
import * as serviceWorker from './serviceWorker';
// import './config';
import './style.scss';

const trackingId = 'UA-1841781-12';
ReactGA.initialize(trackingId, {
  debug: true,
});

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
