import './index.css'

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Adjust according to your app's structure
import { Auth0Provider } from '@auth0/auth0-react';

const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;

ReactDOM.createRoot(document.getElementById('root')).render(
  <Auth0Provider
    domain={domain}
    clientId={clientId}
    redirectUri={window.location.origin} // This is where the user will be redirected after login
  >
    <App />
  </Auth0Provider>
);