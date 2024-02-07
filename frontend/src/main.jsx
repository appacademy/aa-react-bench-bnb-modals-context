import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import './reset.css';
import './index.css';
import configureStore from './store';
import { csrfFetch, restoreCSRF } from './store/csrf';
import * as benchActions from './store/benches';
import * as reviewActions from './store/reviews';

const store = configureStore();

if (import.meta.env.MODE !== "production") {
  restoreCSRF();
  window.store = store;
  window.csrfFetch = csrfFetch;
  window.benchActions = benchActions;
  window.reviewActions = reviewActions;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
  </React.StrictMode>
);
