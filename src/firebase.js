import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDc_ZAWdgQy34VCuZO_iydm_0nqeVQhhf0",
  authDomain: "super-mall-fafa2.firebaseapp.com",
  projectId: "super-mall-fafa2",
  storageBucket: "super-mall-fafa2.firebasestorage.app",
  messagingSenderId: "452055595303",
  appId: "1:452055595303:web:69ff71b51fedf8c63e1102"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
