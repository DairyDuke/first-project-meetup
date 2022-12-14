import React from "react";

import "./index.css";

import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

import { ModalProvider } from "./context/Modal";

import configureStore from "./store";
import { restoreCSRF, csrfFetch } from "./store/csrf";
import * as sessionActions from "./store/session";
import * as groupActions from "./store/groups";
import * as eventActions from "./store/events";

const store = configureStore();

if (process.env.NODE_ENV !== "production") {
  restoreCSRF();

  window.csrfFetch = csrfFetch
  window.store = store;
  window.sessionActions = sessionActions;
  window.groupActions = groupActions;
  window.eventActions = eventActions;
}

function Root() {
  return (
    <Provider store={store}>
      <ModalProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ModalProvider>
    </Provider>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
  document.getElementById('root')
);


// import React from 'react';

// import './index.css';

// import ReactDOM from 'react-dom';
// import { Provider } from 'react-redux';
// import { BrowserRouter } from 'react-router-dom';
// import App from './App';

// import configureStore from './store';

// import { restoreCSRF, csrfFetch } from './store/csrf';

// import * as sessionActions from './store/session';

// const store = configureStore();

// if (process.env.NODE_ENV !== 'production') {
//   restoreCSRF();

//   window.csrfFetch = csrfFetch;
//   window.store = store;
//   window.sessionActions = sessionActions;
// }

// if (process.env.NODE_ENV !== 'production') {
//   window.store = store;
// }

// function Root() {
//   return (
//     <Provider store={store}>
//       <BrowserRouter>
//         <App />
//       </BrowserRouter>
//     </Provider>
//   );
// }

// ReactDOM.render(
//   <React.StrictMode>
//     <Root />
//   </React.StrictMode>,
//   document.getElementById('root'),
// );


// TODO: Update Proxy as needed - start backend before testing
