import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAtOmcCPkeoMyZq_rhB7LsuB1CakLYwCEQ",
  authDomain: "arctrack-main.firebaseapp.com",
  projectId: "arctrack-main",
  storageBucket: "arctrack-main.appspot.com",
  messagingSenderId: "280162320438",
  appId: "1:280162320438:web:d61a95eca202a80e45d897",
  databaseURL: "https://arctrack-main.firebaseio.com/",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const database = getDatabase(app);

export default app;
