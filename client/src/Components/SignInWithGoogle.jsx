import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const SignInWithGoogle = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <button 
      onClick={() => loginWithRedirect({ connection: 'google-oauth2' })}
      className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
    >
      Sign in with Google
    </button>
  );
};

export default SignInWithGoogle;
