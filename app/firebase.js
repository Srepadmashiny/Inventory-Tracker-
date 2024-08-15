// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; // Import Firebase Storage

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

// Initialize Firebase Analytics only if supported
let analytics;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
});

// Initialize Firebase Storage
const storage = getStorage(app);

// Initialize Firestore
const firestore = getFirestore(app);

export { firestore, storage }; // Export Firestore and Storage
