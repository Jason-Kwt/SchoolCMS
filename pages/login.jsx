import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
//Firebase
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '../firebaseConfig.js';

const Login = () => {
  const auth = getAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signUp = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((response) => {
        sessionStorage.setItem('Token', response.user.accessToken);
        router.push('/');
      })
      .catch((err) => {
        alert('is exist');
        console.log(err);
      });
  };

  useEffect(() => {
    let token = sessionStorage.getItem('Token');

    if (token) {
      router.push('/Aesscourse');
    }
  });

  return (
    <div className={{}}>
      <main className={{}}>
        <h1>Login</h1>
        <input
          placeholder="Email"
          className={{}}
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
        />
        <input
          placeholder="Password"
          className={{}}
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="password"
        />
        <button className={{}} onClick={signUp}>
          Sign In
        </button>
      </main>
    </div>
  );
};

export default Login;
