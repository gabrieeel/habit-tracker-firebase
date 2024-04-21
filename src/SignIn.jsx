import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { firebaseAuth } from './firebase';
import { NavLink, useNavigate } from 'react-router-dom'

function SignIn() {
  const navigate = useNavigate();


  const onLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(firebaseAuth, "x", "y")
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        navigate("/")
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage)
      });

  }

  return (
    <div>
      <h2>Sign In</h2>
      <button onClick={onLogin}>
        Login
      </button>
    </div>
  );
}

export default SignIn;