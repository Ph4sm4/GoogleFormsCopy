import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { ContextProvider } from './contexts/ContextProvider';

ReactDOM.render(
  <ContextProvider>
    <App></App>
  </ContextProvider>,
  document.getElementById('root')
);
