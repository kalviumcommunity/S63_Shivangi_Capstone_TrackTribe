// src/components/GoogleSignUpButton.jsx
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const GoogleSignUpButton = () => {
  const { loginWithRedirect } = useAuth0();

  const handleSignUp = () => {
    loginWithRedirect({
      screen_hint: 'signup', // Ensures it's a signup flow
      connection: 'google-oauth2' // Specify the Google connection
    });
  };

  return (
    <button onClick={handleSignUp} className="btn btn-google">
      Sign up with Google
    </button>
  );
};

export default GoogleSignUpButton;
