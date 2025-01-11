import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "YOUR API",
  authDomain: "fitmate-2a2a4.firebaseapp.com",
  projectId: "fitmate-2a2a4",
  storageBucket: "fitmate-2a2a4.firebasestorage.app",
  messagingSenderId: "127441946657",
  appId: "1:127441946657:web:4b4a2be0004ba2309cfb60",
  measurementId: "G-YWMVCJJ6JD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
