// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore'; // Corrected import path

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBGweFSUcKSBuX38BvdbEY_LtxWmmsfrD8',
  authDomain: 'inventory-management-c9b2b.firebaseapp.com',
  projectId: 'inventory-management-c9b2b',
  storageBucket: 'inventory-management-c9b2b.appspot.com',
  messagingSenderId: '229647229063',
  appId: '1:229647229063:web:e19f0c2b57abd720fe5822',
  measurementId: 'G-Q324YH8D99'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export { firestore };
