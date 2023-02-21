import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

//Firebase
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { app } from '../firebaseConfig.js';

export default function Register() {
  const auth = getAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signUp = () => {
    createUserWithEmailAndPassword(auth, email, password).then((response) => {
      sessionStorage.setItem('Token', response.user.accessToken);
      router.push('/');
    });
  };

  useEffect(() => {
    let token = sessionStorage.getItem('Token');

    if (token) {
      router.push('/');
    }
  }, []);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1>Register</h1>
        <input
          placeholder="Email"
          className={styles.inputBox}
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
        />
        <input
          placeholder="Password"
          className={styles.inputBox}
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="password"
        />
        <button className={styles.button} onClick={signUp}>
          Sign Up
        </button>
      </main>
    </div>
  );
}
