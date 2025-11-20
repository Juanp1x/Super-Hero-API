import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = {
  apiKey: "AIzaSyA840UEB3NjmViK65azkyFUlqlzrKMXXtg",
  authDomain: "super-hero-api-fb658.firebaseapp.com",
  projectId: "super-hero-api-fb658",
  storageBucket: "super-hero-api-fb658.firebasestorage.app",
  messagingSenderId: "684116074306",
  appId: "1:684116074306:web:0a9d313fef50847b60f2db",
  measurementId: "G-NP0GCYTS2S"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const db = getFirestore(app); // ✅ ¡Esto es necesario!
export { auth, db };