
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAtOmcCPkeoMyZq_rhB7LsuB1CakLYwCEQ",
  authDomain: "arctrack-main.firebaseapp.com",
  projectId: "arctrack-main",
  storageBucket: "arctrack-main.appspot.com",
  messagingSenderId: "280162320438",
  appId: "1:280162320438:web:d61a95eca202a80e45d897"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;
