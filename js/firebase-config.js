// Firebase Configuration and Initialization
// SDK version 10.8.0 (modular)

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getAuth, GoogleAuthProvider } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';

// Firebase configuration from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyA-i_Oy64kEir9OtFn-2oSJH-WXrUNpzzo",
  authDomain: "tienda-pokemon-7f8e2.firebaseapp.com",
  projectId: "tienda-pokemon-7f8e2",
  storageBucket: "tienda-pokemon-7f8e2.firebasestorage.app",
  messagingSenderId: "24984718354",
  appId: "1:24984718354:web:d568c388b558a3f405dccb",
  measurementId: "G-P21D8RFYGH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Configure Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Export for use in other modules
export { auth, googleProvider };
