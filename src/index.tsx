import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import App from './App';
import reducers from './store/reducers';
import reportWebVitals from './reportWebVitals';
import OGP from './components/common/ogp/OGP.container';
import { HelmetProvider } from 'react-helmet-async';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { createRoot } from 'react-dom/client';

const store = createStore(
  reducers,
  composeWithDevTools(applyMiddleware(thunk))
);

const theme = createTheme({});
const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <Provider store={store}>
    <React.StrictMode>
      <HelmetProvider>
        <OGP />
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </HelmetProvider>
    </React.StrictMode>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
