import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

//Go to google firebase select web app it will give you firebase.js for your project, copy your constfirebaseConfig={}
//from there are paste your project here in api,projectID,etc. dont change imports and export function.

const firebaseConfig = {
  apiKey: "YOUR API",
  authDomain: "COM.XYZ",
  projectId: "XYZ",
  storageBucket: "XYZ",
  messagingSenderId: "XYZ",
  appId: "XYZ",
  measurementId: "XYZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
